const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');

const { startMongo } = require('./services/mongo');

const { loadData } = require('./models/planets.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer(){
    await startMongo();
    
    await loadData();
    
    server.listen(PORT, () => {
        console.log(`Server is active. Port: ${PORT}`);
    });
}

startServer();
