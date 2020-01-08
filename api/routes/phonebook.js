const { Router } = require('express');
const route = Router();
const { fetchContactValidator } = require('../middlewares/validation.middleware');
const PhonebookError = require('../errors/phonebook.error');
const phonebookService = require('../services/phonebook.service');

route.get('/', (req, res) => {
    // TODO: send info on avaiable apis
    res.sendStatus(200);
});

route.get('/contact/:phonenumber', async (req, res, next) => {
    const { phonenumber } = req.params;
    if (!phonenumber) {
        return res.sendStatus(400);
    }
    try {
        const contact = await phonebookService.fetchContact(phonenumber);
        res.json(contact);
    } catch (error) {
        next(error);
    }
});

route.put('/contact', async (req, res, next) => {
    let contact = req.body;
    if (!contact || !contact.phoneNumber) {
        return res.status(400).send('Valid Data Required');
    }
    if (contact && contact.id) {
        return res.status(400).send(`${contact.id} already exists.`);
    }
    try {
        contact = phonebookService.createNew(contact);
        res.status(201).json(contact);
    } catch (error) {
        next(error);
    }
});

route.post('/contact', async (req, res) => {
    let contact = req.body;
    if (!contact) {
        return res.status(400).send('Valid Data Required');
    }
    if (contact && !contact.id) {
        return res.status(404).send('Invalid Data.');
    }
    try {
        contact = phonebookService.update(contact);
        res.status(202).json(contact);
    } catch (error) {
        next(error);
    }
});
// route.delete('/contact/:phonenumber', async (req, res) => {});

module.exports = route;
