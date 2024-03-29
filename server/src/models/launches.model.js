const launches = new Map();

let latestFlightNumber = 100;

const launch = {
    flightNumber: 100,
    mission: "Kepler Exploration x",
    rocket: "Explorer IS1",
    launchDate: new Date('December 27, 2030'),
    target: "Kepler-442 b",
    customers: ['NASA', 'ZTM'],
    upcoming: true,
    success: true,
};

launches.set(launch.flightNumber, launch);

function hasFlight(id){
    return launches.has(id);
}

function getAllLaunches (){
    return Array.from(launches.values());
};

function setLaunch(launch){
    latestFlightNumber++;
    launches.set(latestFlightNumber, Object.assign(launch, {
        customers: ['ZTM', 'NASA'],
        flightNumber: latestFlightNumber,
        upcoming: true,
        success: true
    }));
}

function removeLaunch(launch){
    const flight = launches.get(launch);
    flight.upcoming = false;
    flight.success = false;
    return flight;
}

module.exports = {
    getAllLaunches,
    setLaunch,
    hasFlight,
    removeLaunch
};