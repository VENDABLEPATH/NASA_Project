const { launches } = require('../../models/launches.model');

function getLaunches(req, res){
    return res.status(200).json(launches);
};

module.exports = {
    getLaunches
}

