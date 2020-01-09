const atob = require('atob');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
    let passkey = req.get('x-phonebook-requester');
    if (!passkey) {
        return res.sendStatus(403);
    }
    passkey = atob(passkey);
    if (passkey !== 'phonebookapi') {
        return res.sendStatus(403);
    }

    try {
        const token = generateToken(req);
        res.locals.token = token;
    } catch (e) { 
        return res.sendStatus(403);
    }

    next();
}

function generateToken(req) {
    return jwt.sign({
        requester: 'phonebook-api'
    }, JWT_SECRET, {
        expiresIn: '12h'
    });
}


function validateMiddleware(req, res, next) {
    let token = req.get('x-phonebook-token');
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
        console.log(`Auth token validation failed: ${e}`);
        return res.sendStatus(403);
    }

    next();
}

module.exports = { authMiddleware, validateMiddleware };