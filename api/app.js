const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');

const phoneBookRoutes = require('./routes/phonebook');
const ErrorMiddleWare = require('./middlewares/error.middleware');

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', phoneBookRoutes);

app.get('/', (req, res) => {
    res.sendStatus(200);
});

ErrorMiddleWare(app);

module.exports = app;