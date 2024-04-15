const launches = require('./launches.mongo');
const { planetExists } = require('./planets.model');

const DEFAULT_FLIGHT_NUMBER = 100;

async function getFlightNumber(){
    const latestLaunch = await launches.findOne({}).sort('-flightNumber');

    if (!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    };

    return latestLaunch.flightNumber + 1;
}

async function hasFlight(id){
    return (await launches.find({flightNumber: id})).length > 0;
}

async function getAllLaunches(){
    return await launches.find({}, "-__v -_id");
};

async function setLaunch(launch){
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

    try {
        await launches.findOneAndUpdate({
           flightNumber: latestFlightNumber 
        }, newLaunch, {
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
        })
        return aborted.ok === 1 && aborted.nModified === 1;
    } catch(err) {
        console.error(`Could not remove launch. ${err}`);
    };
}

module.exports = {
    getAllLaunches,
    setLaunch,
    hasFlight,
    removeLaunch
};