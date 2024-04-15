const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://PATH:NASA_API@cluster0.xqealrf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

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
