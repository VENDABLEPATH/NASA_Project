const http = require('http');

const app = require('./app');

const { loadData } = require('./models/planets.model');

const PORT = process.env.PORT || 8000;

async function startServer(){
    const server = http.createServer(app);
    
    await loadData();
    
    server.listen(PORT, () => {
        console.log(`Server is active.`);
    });
}

startServer();
