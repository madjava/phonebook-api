const { body, sanitizeBody, validationResult } = require('express-validator');

const fetchContactValidator = () => {
    return [
        body('phoneNumber')
            .exists()
            .notEmpty()
            .isLength({ min: 10 })
            .withMessage('Invalid request'),
        sanitizeBody('phoneNumber')
            .toString()
    ];
};

module.exports = {
    fetchContactValidator
}