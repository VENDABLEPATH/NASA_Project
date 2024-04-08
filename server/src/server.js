const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');

const { loadData } = require('./models/planets.model');

const PORT = process.env.PORT || 8000;

const MONGO_URL = 'mongodb+srv://PATH:NASA_API@cluster0.xqealrf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const server = http.createServer(app);

mongoose.connection.once('open', () => {
    console.log('MongoDB successfully connected');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function startServer(){
    await mongoose.connect(MONGO_URL); 
    
    await loadData();
    
    server.listen(PORT, () => {
        console.log(`Server is active.`);
    });
}

startServer();
