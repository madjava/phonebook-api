const atob = require('atob');

function authMiddleware(req, res, next) {
    const passkey = req.get('x-phonebook-requester');
    if (!passkey || (passkey && passkey !== 'phonebookapi')) {
        return res.sendStatus(403);
    }

    const buff = atob(passkey);
    console.log(buff);
    next();
}

module.exports = authMiddleware;