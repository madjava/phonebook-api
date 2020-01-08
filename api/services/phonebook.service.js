const data = require('../../data/contacts.json');

const fetchContact = async (phoneNumber) => {
    return data.find(c => c.phoneNumber === phoneNumber);
}

const fetchAll = async () => {
    return data;
}

module.exports = {
    fetchContact,
    fetchAll
}