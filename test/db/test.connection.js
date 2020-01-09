const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoServer = new MongoMemoryServer();
const Contact = require('../../db/models/contact.model');
const faker = require('faker');
const log = console.log;
faker.locale = 'en_GB';
let testData = [];
const MAX_DATA = 3;

async function init() {
    const mongoUri = await mongoServer.getUri();
    const port = await mongoServer.getPort();
    const dbPath = await mongoServer.getDbPath();
    const dbName = await mongoServer.getDbName();

    const mongooseOpts = {
        useUnifiedTopology: true,
        useNewUrlParser: true
    };

    mongoose.connect(mongoUri, mongooseOpts);

    mongoose.connection.on('error', (e) => {
        if (e.message.code === 'ETIMEDOUT') {
            log(e);
        }
        log(e);
    });
    // mongoose.connection.once('open', () => {
    //     log(mongoUri);
    // });
}

async function cleanUp() {
    await Contact.deleteMany({});
}

async function loadTestData() {
    testData = [];
    for (let i = 0; i < MAX_DATA; i++) {
        let contact = new Contact(_generateContact());
        try {
            await contact.save();
            testData.push(contact);
        } catch (e) {
            log(e);
        }
    }
}

function getTestData() {
    return testData;
}

const _generateContact = () => {
    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phoneNumber: faker.phone.phoneNumber(),
        city: faker.address.city(),
        postCode: faker.address.zipCode()
    }
};

module.exports = {
    init,
    loadTestData,
    getTestData,
    MAX_DATA
};