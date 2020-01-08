module.exports = class PhonebookError {
    constructor(message, statusCode = 404) {
        this.message = message;
        this.statusCode = statusCode;
    }
}