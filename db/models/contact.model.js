const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contactSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    city: String,
    postCode: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('contacts', contactSchema);