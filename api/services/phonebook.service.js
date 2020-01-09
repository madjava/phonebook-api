const Contact = require('../../db/models/contact.model');
const PhonebookError = require('../errors/phonebook.error');

const fetchContact = async (phoneNumber) => {
    try {
        const contact = await Contact.findOne({ phoneNumber });
        return contact;
    } catch (error) {
        throw new PhonebookError('Request Not Found', 404);
    }
}

const fetchAll = async (options) => {
    return await Contact.find({});
}

const createContact = async (contact) => {
    try {
        contact = new Contact(contact);
        contact.save();
        return contact;
    } catch (error) {
        throw new PhonebookError('Bad Requset', 400);
    }
}

const updateContact = async (contactData) => {
    if (!contactData || !contactData._id) {
        throw new PhonebookError('Invalid Data', 400);
    }
    try {
        const _id = contactData._id;
        delete contactData._id;
        contactData = await Contact.findByIdAndUpdate(_id, contactData, { upsert: false });
        return contactData;
    } catch (error) {
        throw new PhonebookError('Bad Requset', 400);
    }
}

const deleteContact = async (id) => {
    if (!id) {
        throw new PhonebookError('Invalid Data', 400);
    }
    try {
        await Contact.deleteOne({_id: id});
    } catch (error) {
        throw new PhonebookError('Bad Request', 400);
    }
}

module.exports = {
    fetchContact,
    fetchAll,
    createContact,
    updateContact,
    deleteContact
}