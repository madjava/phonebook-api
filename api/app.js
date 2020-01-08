const express = require('express');
const app = express();
const helmet = require('helmet');
const csrfProtection = require('@authentication/csrf-protection');

const phoneBookRoutes = require('./routes/phonebook');

app.use(helmet());
app.use(csrfProtection());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', phoneBookRoutes);

app.get('/', (req, res) => {
    res.sendStatus(200);
});

app.use((err, req, res, next) => {
    res.sendStatus(500);
});


module.exports = app;