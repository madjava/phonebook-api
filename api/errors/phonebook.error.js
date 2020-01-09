module.exports = class PhonebookError {
    constructor(message, statusCode) {
        this.message = message;
        this.statusCode = statusCode || 404;
    }
}