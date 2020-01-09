const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');

const phoneBookRoutes = require('./routes/phonebook');
const ErrorMiddleWare = require('./middlewares/error.middleware');
const { authMiddleware, validateMiddleware } = require('./middlewares/authmiddleware');

const X_PHONEBOOK_REQUESTER = process.env.X_PHONEBOOK_REQUESTER || 'cGhvbmVib29rYXBp';

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', validateMiddleware, phoneBookRoutes);

app.get('/auth', authMiddleware, (req, res) => {
    res.status(200).send(res.locals.token);
});

app.get('/', (req, res) => {
    res.sendStatus(200);
});

app.use((req, res) => {
    res.sendStatus(404);
});

ErrorMiddleWare(app);



module.exports = app;