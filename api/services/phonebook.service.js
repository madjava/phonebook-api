let data = require('../../data/contacts.json');
const PhonebookError = require('../errors/phonebook.error');

const fetchContact = async (phoneNumber) => {
    const contact = data.find(c => c.phoneNumber === phoneNumber);
    if (!contact) {
        throw new PhonebookError('Request Not Found', 404);
    }
    return contact;
}

const fetchAll = async (options) => {
    return data;
}

const createContact = async (contact) => {
    const newcontact = { ...contact };
    newcontact.id = 3;
    data.push(newcontact);
    return newcontact; 
}

const updateContact = async (contactData) => {
    if (!contactData || !contactData.id) {
        throw new PhonebookError('Invalid Data', 400);
    }
    let contact = data.find(c => c.id === contactData.id);
    return Object.assign(contact, contactData);
}

const deleteContact = async (id) => {
    if(!id) {
        throw new PhonebookError('Invalid Data', 400);
    }
    data = data.filter(c => c.id !== id);
}

module.exports = {
    fetchContact,
    fetchAll,
    createContact,
    updateContact,
    deleteContact
}