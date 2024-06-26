const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const planets = require('./planets.mongo');

function isHabitablePlanet(planet){
        return planet['koi_disposition'] === 'CONFIRMED' 
        && planet['koi_insol'] < 1.11 
        && planet['koi_insol'] > 0.36
        && planet['koi_prad'] < 1.6;
}

async function loadData(){
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true,
            }))
            .on('data', async function(data){
                if (isHabitablePlanet(data)){
                   savePlanet(data);
                };
            })
            .on('error', (err) => {
                reject(err);
            })
            .on('end', () => {
                resolve();
            });
    });
};

async function getAllPlanets(){
    return await planets.find({}, '-__v -_id');
}

async function planetExists(planet){
    return (await planets.find({keplerName: planet}, '-__v, -_id')).length > 0;
}

async function savePlanet(planet){
    try{
        await planets.updateOne({
            keplerName: planet.kepler_name
        }, {
            keplerName: planet.kepler_name
        }, {
            upsert: true
        });
    } catch(err) {
        console.error(`Could not save planet: ${err}`);
    }
}

module.exports = {
    loadData,
   getAllPlanets,
   planetExists
}