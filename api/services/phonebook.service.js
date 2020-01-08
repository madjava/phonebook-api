const data = require('../../data/contacts.json');
const PhonebookError = require('../errors/phonebook.error');

const fetchContact = async (phoneNumber) => {
    const contact = data.find(c => c.phoneNumber === phoneNumber);
    if (!contact) {
        throw new PhonebookError('Request Not Found', 404);
    }
    return contact;
}

const fetchAll = async () => {
    return data;
}

const createNew = async (contact) => {
    const newcontact = { ...contact };
    newcontact.id = 3;
    data.push(newcontact);
    return newcontact;
}

module.exports = {
    fetchContact,
    fetchAll,
    createNew
}