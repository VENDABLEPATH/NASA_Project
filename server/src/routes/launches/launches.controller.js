const { getAllLaunches, setLaunch, removeLaunch, hasFlight } = require('../../models/launches.model');

async function httpGetLaunches(req, res){
    return res.status(200).json(await getAllLaunches());
};

async function httpSetLaunch(req, res){
    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target){
        return res.status(400).json({error: 'Check request body.'});
    };

    launch.launchDate = new Date(launch.launchDate);
    // check if date valid
    if (isNaN(launch.launchDate) || (launch.launchDate < new Date())){
        return res.status(400).json({error: 'Invalid launch date.'}); 
    };

    try {
        await setLaunch(launch);
        return res.status(201).json(launch);
    } catch(err){
        return res.status(400).json({error: 'Destination planet does not exist.'});
    };
};
 
async function httpRemoveLaunch(req, res){
    if (isNaN(req.params.id)){
       return res.status(400).json({error: 'Invalid flight number.'});  
    }
    const flightNumber = Number(req.params.id);

    if (await hasFlight(flightNumber)){
        const flight = await removeLaunch(flightNumber);
        return res.status(200).json(flight);
    } else {
        return res.status(404).json({error: 'Flight not found.'});
    };
}

module.exports = {
    httpGetLaunches,
    httpSetLaunch,
    httpRemoveLaunch
}

