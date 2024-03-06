const { launches } = require('../../models/launches.model');

function getLaunches(req, res){
    for (const value of launches.values()){
        return res.status(200).json(value);
    };
};

module.exports = {
    getLaunches
}

