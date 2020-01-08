const data = require('../../data/contacts.json');

const fetchContact = (phonenumber) => {
    return data.find(c => c.phoneNumber === phonenumber);
}

const fetchAll = () => {
    return data;
}

module.exports = {
    fetchContact,
    fetchAll
}