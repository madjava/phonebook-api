const mongoose = require('mongoose');
const db = require('../../db/test.connection');
const phonebookService = require('../../../api/services/phonebook.service');
let testdata = [];

describe('Phonebook Service', () => {
    beforeAll(async () => {
        await db.init();
        await db.loadTestData();
        testdata = db.getTestData();
    });
    afterAll(async () => {
        await db.cleanUp();
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    describe('fetchContact', () => {

        test('should fetch a particular contact based on phone number', async () => {
            const contactData = testdata[0];
            const phone = contactData.phoneNumber;

            const contact = await phonebookService.fetchContact(phone);

            const { firstName, lastName, phoneNumber, postCode } = contact;
            expect(firstName).toBe(contactData.firstName);
            expect(lastName).toBe(contactData.lastName);
            expect(phoneNumber).toBe(contactData.phoneNumber);
            expect(postCode).toBe(contactData.postCode);
        });
    });

    describe('fetchAll', () => {

        test('should return all contact details', async () => {
            const list = await phonebookService.fetchAll();
            expect(list.length).toBe(db.MAX_DATA);
        });
    });

    describe('createContact', () => {
        test('should create a new contact detail with diven payload', async () => {
            const payload = {
                firstName: "Adam",
                lastName: "Frank",
                phoneNumber: "07000000333",
                city: "Dover",
                postCode: "CT157FD"
            };
            const contact = await phonebookService.createContact(payload);

            expect(contact).toHaveProperty('_id');
            expect(contact.firstName).toBe(payload.firstName);
            expect(contact.phoneNumber).toBe(payload.phoneNumber);
        });
    });

    describe('updateContact', () => {
        test('should update existing contact detail', async () => {
            const testdata1 = testdata[2];
            const payload = {
                _id: testdata1._id,
                phoneNumber: "07000000444"
            };
            const contact = await phonebookService.updateContact(payload);

            const { firstName, lastName, phoneNumber, postCode } = contact;
            expect(firstName).toBe(testdata1.firstName);
            expect(lastName).toBe(testdata1.lastName);
            expect(phoneNumber).toBe(payload.phoneNumber);
            expect(postCode).toBe(testdata1.postCode);
        });

        test('should return 400 if invalid id is provided', async () => {
            const payload = {
                phoneNumber: "07000000444"
            };
            try {
                await phonebookService.updateContact(payload);
            } catch (error) {
                expect(error.statusCode).toBe(400);
            }
        });
    });

    describe('deleteContact', () => {
        test('should delete an existing contact', async () => {
            const testdata3 = testdata[2];
            const id = testdata3._id;

            let list = await phonebookService.fetchAll();
            expect(list.length).toBe(4);

            await phonebookService.deleteContact(id);

            list = await phonebookService.fetchAll();
            expect(list.length).toBe(3);

            expect(async () => {
                try {
                    const contact = await phonebookService.fetchContact(testdata3.phoneNumber);
                } catch (error) {
                    expect(error instanceof PhonebookError).toBe(true);
                }
            });    

        });
    })
});