const chalk = require('chalk');
const faker = require('faker');
faker.locale = 'en_GB';
const log = console.log;
const MAX_RECORDS = process.env.MAX_RECORDS || 100;

const Contact = require('../db/models/contact.model');

const loadData = async () => {
    console.clear();
    log(chalk.dim('-------------------'));
    log(chalk.blue.bold('Phonebook API is Generating sample data'));
    log(chalk.green('Data generation done...'));
    log(chalk.dim('\n'));

    for (let i = 0; i < MAX_RECORDS; i++) {
        const contact = new Contact(generateContact(i));
        try { await contact.save(); } catch (e) { console.log(e); }
    }

    log(chalk.dim('-------------------'));
    log(chalk.blue.bold(`Adding ${MAX_RECORDS} data records to MongoDB`));
    log(chalk.green('Done...'));
    log(chalk.dim('\n'));
}

const generateContact = (id) => {
    return {
        id,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phoneNumber: faker.phone.phoneNumber(),
        city: faker.address.city(),
        postCode: faker.address.zipCode()
    }
};

module.exports = loadData; 