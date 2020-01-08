const { Router } = require('express');
const route = Router();
const { fetchContactValidator } = require('../middlewares/validation.middleware');
const PhonebookError = require('../errors/phonebook.error');
const phonebookService = require('../services/phonebook.service');

route.get('/', (req, res) => {
    // TODO: send info on avaiable apis
    res.sendStatus(200);
});

route.post('/contact', async (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
        return res.sendStatus(400);
    }
    const contact = await phonebookService.fetchContact(phoneNumber);
    res.json(contact);
});


module.exports = route;
