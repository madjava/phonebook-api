const http = require('http');
const app = require('./api/app');
const server = http.createServer(app);

const PORT = process.env.PORT || 9002;


server.listen(PORT, () => {
    console.log(`Phonebook API Service running on ${PORT}`);
});
