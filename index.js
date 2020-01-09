const http = require('http');

// DB Connection setup
const db = require('./db/connection');

const app = require('./api/app');
const loadData = require('./data/load');
const server = http.createServer(app);

const PORT = process.env.PORT || 9002;

// Load db data
try {
    loadData();
} catch (e) {
    console.log(e);
}

server.listen(PORT, () => {
    console.log(`Phonebook API Service running on ${PORT}`);
    db.init();
});
