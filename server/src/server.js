const http = require('http');

require('dotenv').config();

const app = require('./app');


const { startMongo } = require('./services/mongo');

const { loadData } = require('./models/planets.model');

const { loadLaunchData } = require('./models/launches.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer(){
    await startMongo();
    await loadData();
    await loadLaunchData();
    
    server.listen(PORT, () => {
        console.log(`Server is active. Port: ${PORT}`);
    });
}

startServer();
