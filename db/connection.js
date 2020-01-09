async function init() {
    const chalk = require('chalk');
    const log = console.log;
    const mongoose = require('mongoose');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const DB_PORT = +process.env.DB_PORT || 27018;
    const mongoServer = new MongoMemoryServer();

    const mongoUri = await mongoServer.getUri('phonebook_db');
    const port = await mongoServer.getPort();
    const dbPath = await mongoServer.getDbPath();
    const dbName = await mongoServer.getDbName();

    const mongooseOpts = {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    };

    mongoose.connect(mongoUri, mongooseOpts);

    mongoose.connection.on('error', (e) => {
        if (e.message.code === 'ETIMEDOUT') {
            log(e);
        }
        log(e);
    });

    mongoose.connection.once('open', () => {
        log('\n');
        log(chalk.yellowBright(`Phonebook API MongoDB successfully connected to ${mongoUri}`));
    });
}
module.exports = { init };