const phonebookService = require('../../../api/services/phonebook.service');

describe('Phonebook Service', () => {
    describe('fetchContact', () => {
        test('should fetch a particular contact based on phone number', async () => {
            const phone = '07000000111';

            const contact = await phonebookService.fetchContact(phone);

            const { firstName, lastName, phoneNumber, postCode } = contact;
            expect(firstName).toBe('John');
            expect(lastName).toBe('Doe');
            expect(phoneNumber).toBe('07000000111');
            expect(postCode).toBe('E1 6AN');
        });
    });

    describe('fetchAll', () => {
        test('should return all contact details', async () => {
            const list = await phonebookService.fetchAll();

            expect(list.length).toBe(2);
        });
    });

    describe('createNew', () => {
        test('should create a new contact detail with diven payload', async () => {
            const payload = {
                firstName: "Adam",
                lastName: "Frank",
                phoneNumber: "07000000333",
                city: "Dover",
                postCode: "CT157FD"
            };
            const contact = await phonebookService.createNew(payload);

            expect(contact).toHaveProperty('id');
            expect(contact.id).toBe(3);
        });
    });

    describe('update', () => {
        test('should update existing contact detail', () => {
            
        });
    });
});