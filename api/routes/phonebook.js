const { Router } = require('express');
const route = Router();
const { fetchContactValidator } = require('../middlewares/validation.middleware');
const PhonebookError = require('../errors/phonebook.error');
const phonebookService = require('../services/phonebook.service');

route.get('/', (req, res) => {
    // TODO: send info on avaiable apis
    res.sendStatus(200);
});

route.get('/phonebook', async (req, res, next) => {
    const { phoneNumber, city, postCode } = req.params;
    try {
        const data = await phonebookService.fetchAll({ phoneNumber, city, postCode });
        res.json(data);
    } catch (error) {
        next(error);
    }
});

route.get('/phonebook/cities', async (req, res, next) => {
    try {
        const data = await phonebookService.fetchAllDataFor({ filter: 'city' });
        res.json(data);
    } catch (error) {
        next(error);
    }
});

route.get('/phonebook/postcodes', async (req, res, next) => {
    try {
        const data = await phonebookService.fetchAllDataFor({ filter: 'postCode' });
        res.json(data);
    } catch (error) {
        next(error);
    }
});

route.get('/phonebook/:city/:postCode', async (req, res, next) => {
    const { city, postCode } = req.params;
    try {
        const data = await phonebookService.fetchDataFor({ city, postCode });
        res.json(data);
    } catch (error) {
        next(error);
    }
});

route.get('/phonebook/:phonenumber', async (req, res, next) => {
    const phonenumber = req.params.phonenumber;
    if (!phonenumber) {
        return res.sendStatus(400);
    }
    try {
        const contact = await phonebookService.fetchContact(phonenumber);
        if (!contact) {
            return res.sendStatus(404);
        }
        res.json(contact);
    } catch (error) {
        next(error);
    }
});

route.put('/phonebook', async (req, res, next) => {
    let contact = req.body;
    if (!contact || !contact.phoneNumber) {
        return res.status(400).send('Valid Data Required');
    }
    try {
        contact = await phonebookService.createContact(contact);
        res.status(201).json(contact);
    } catch (error) {
        next(error);
    }
});

route.post('/phonebook', async (req, res, next) => {
    let contact = req.body;
    try {
        contact = await phonebookService.updateContact(contact);
        if (!contact) {
            return res.sendStatus(400);
        }
        res.status(202).json(contact);
    } catch (error) {
        next(error);
    }
});

route.delete('/phonebook/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        await phonebookService.deleteContact(id);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});

module.exports = route;
