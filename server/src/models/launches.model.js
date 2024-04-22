const launches = require('./launches.mongo');
const { planetExists } = require('./planets.model');
const axios = require('axios');

const DEFAULT_FLIGHT_NUMBER = 100;

async function getFlightNumber(){
    const latestLaunch = await launches.findOne({}).sort('-flightNumber');

    if (!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    };

    return latestLaunch.flightNumber + 1;
}

async function hasFlight(id){
    return (await findLaunch({flightNumber: id})).length > 0;
}

async function findLaunch(filter){
    return await launches.findOne(filter); 
 }

async function getAllLaunches(limit, skip){
    return await launches.find({}, "-__v -_id")
    .limit(limit)
    .skip(skip)
    .sort('flightNumber');
};

async function saveNewLaunch(launch){
    let latestFlightNumber = await getFlightNumber();

    // check planet exists
    if (!await planetExists(launch.target)){
        throw new Error('Destination planet does not exist.');
    }; 

    // add attributes to launch
    const newLaunch = Object.assign(launch, {
        flightNumber: latestFlightNumber,
        customers: ['ZTM', 'NASA'],
        upcoming: true,
        success: true 
    });

    await saveLaunch(newLaunch);
}

async function saveLaunch(launch){
    try {
        await launches.findOneAndUpdate({
           flightNumber: launch.flightNumber 
        }, launch, {
            upsert: true
        });
    } catch(err){
        console.error(`Could not save launch. ${err}`);
    };
}

async function removeLaunch(flightNumber){
    try {
        const aborted = await launches.updateOne({
            flightNumber: flightNumber
        }, {
            success: false,
            upcoming: false
        });
        return aborted.modifiedCount === 1;
    } catch(err) {
        console.error(`Could not remove launch. ${err}`);
    };
}

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches(){
    console.log(`Loading API Data...`);
        const response = await axios.post(SPACEX_API_URL, {
            query: {},
            options: {
                pagination: false,
                populate: [
                    {
                        path: 'rocket',
                        select: {
                            name: 1
                        }
                    }, {
                        path: 'payloads',
                        select: {
                            customers: 1
                        }
                    }
                ]
            }
        });

        if (response.status !== 200){
            console.log(`Problem downloading launch data.`);
            throw new Error('Launch data downlaod failed.');
        };
    
        const launchDocs = response.data.docs;
    
        launchDocs.forEach(launchDoc => {
            const payloads = launchDoc['payloads'];
            const customers = payloads.flatMap((payload) => {
                return payload['customers'];
            });
    
            const launch = {
                flightNumber: launchDoc['flight_number'],
                rocket: launchDoc['rocket']['name'],
                success: launchDoc['success'],
                upcoming: launchDoc['upcoming'],
                mission: launchDoc['name'],
                launchDate: launchDoc['date_local'],
                customers: customers
            };
            console.log(`${launch.flightNumber} ${launch.mission}`);
            saveLaunch(launch); 
        });
}

async function loadLaunchData(){
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    });

    if (!firstLaunch){
        await populateLaunches();
    } else {
        console.log(`Launch data already loaded.`);
    };
};


module.exports = {
    getAllLaunches,
    saveNewLaunch,
    hasFlight,
    removeLaunch,
    loadLaunchData
};