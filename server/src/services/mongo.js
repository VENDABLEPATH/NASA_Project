const mongoose = require('mongoose');

require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', () => {
    console.log('MongoDB successfully connected');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function startMongo(){
    await mongoose.connect(MONGO_URL);
}

async function endMongo(){
    await mongoose.disconnect();
}

module.exports = {
    startMongo,
    endMongo
}
