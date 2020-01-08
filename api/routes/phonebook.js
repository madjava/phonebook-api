const { Router } = require('express');
const route = Router();
const { fetchContactValidator } = require('../middlewares/validation.middleware');
const PhonebookError = require('../errors/phonebook.error');
const phonebookService = require('../services/phonebook.service');

route.get('/', (req, res) => {
    // TODO: send info on avaiable apis
    res.sendStatus(200);
});

route.get('/contacts', async (req, res, next) => {
    const { phoneNumber, city, postCode } = req.params;
    try {
        const data = await phonebookService.fetchAll({ phoneNumber, city, postCode });
        res.json(data);
    } catch (error) {
        next(error);
    }
});

route.get('/contact/:phonenumber', async (req, res, next) => {
    const phonenumber = req.params.phonenumber;
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
        contact = await phonebookService.createContact(contact);
        res.status(201).json(contact);
    } catch (error) {
        next(error);
    }
});

route.post('/contact', async (req, res, next) => {
    let contact = req.body;
    if (!contact) {
        return res.status(400).send('Valid Data Required');
    }
    if (contact && !contact.id) {
        return res.status(404).send('Invalid Data.');
    }
    try {
        contact = await phonebookService.updateContact(contact);
        res.status(202).json(contact);
    } catch (error) {
        next(error);
    }
});

route.delete('/contact/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        await phonebookService.deleteContact(id);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});

module.exports = route;
