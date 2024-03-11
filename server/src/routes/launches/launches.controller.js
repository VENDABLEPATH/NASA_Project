const { getAllLaunches, setLaunch, removeLaunch } = require('../../models/launches.model');

function httpGetLaunches(req, res){
    return res.status(200).json(getAllLaunches());
};

function httpSetLaunch(req, res){
    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target){
        return res.status(400).json({error: 'Check request body.'});
    };

    launch.launchDate = new Date(launch.launchDate);
    // check if date valid
    if (isNaN(launch.launchDate) || (launch.launchDate < new Date())){
        return res.status(400).json({error: 'Invalid launch date.'}); 
    };

    setLaunch(launch);
    return res.status(201).json(launch);
};
 
function httpRemoveLaunch(req, res){
    const flightNumber = req.body.id;
    if (getAllLaunches().find(e => e.flightNumber === flightNumber)){
        removeLaunch(flightNumber);
        return res.status(200).json({success: `Flight ${flightNumber} removed.`});
    } else {
        return res.status(404).json({error: 'Flight not found.'}); 
    };
}

module.exports = {
    httpGetLaunches,
    httpSetLaunch,
    httpRemoveLaunch
}

