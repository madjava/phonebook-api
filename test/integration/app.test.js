const request = require('supertest');
const mongoose = require('mongoose');
const db = require('../db/test.connection');
const app = require('../../api/app');
const PhonebookError = require('../../api/errors/phonebook.error');
const contactData = require('../fixtures/contact.data.json');
let testata = [];
const X_PHONEBOOK_REQUESTER = process.env.X_PHONEBOOK_REQUESTER || 'cGhvbmVib29rYXBp';

describe('Phonebook API', () => {
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
    describe('Auth', () => {
        test.skip('should return a valid token if correct auth data is provided', () => {
            return request(app)
                .get('/auth')
                .set('x-phonebook-requester', X_PHONEBOOK_REQUESTER)
                .expect(200);
        });

        test('should return a 403 if  no auth data is provided', () => {
            return request(app)
                .get('/auth')
                .expect(403);
        });

        test('should return a 403 if incorrect  auth data is provided', () => {
            return request(app)
                .get('/auth')
                .set('x-phonebook-requester', 'incorrectvalue')
                .expect(403);
        });
    });

    test('should hit the base endpoint and return 200', () => {
        return request(app)
            .get('/')
            .expect(200);
    });

    describe('GET: /api', () => {
        test('should hit the base /api route', () => {
            return request(app)
                .get('/api')
                .expect(200);
        });
    });

    describe('GET: /api/contacts', () => {
        test('should list all the contact details based on provided criteria', async () => {
            const test1 = testdata[0];
            return request(app)
                .get('/api/contacts')
                .expect(200)
                .expect((response) => {
                    const data = response.body;
                    expect(data.length).toBe(db.MAX_DATA);
                    expect(data[0]._id.toString()).toBe(test1._id.toString());
                });
        });
    });

    describe('GET: /api/contact/:phonenumber', () => {
        test('should fetch the correct contact detail', () => {
            const contactData = testdata[0];
            return request(app)
                .get(`/api/contact/${contactData.phoneNumber}`)
                .expect('Content-Type', /json/)
                .expect(200)
                .expect((response) => {
                    const { firstName, lastName, phoneNumber, postCode } = response.body;
                    expect(firstName).toBe(contactData.firstName);
                    expect(lastName).toBe(contactData.lastName);
                    expect(phoneNumber).toBe(contactData.phoneNumber);
                    expect(postCode).toBe(contactData.postCode);
                });
        });

        test('should return 404 if phoneNumber is not found', () => {
            const invalidNumber = '09234';
            return request(app)
                .get(`/api/contact/${invalidNumber}`)
                .expect(404);
        });
    });

    describe('PUT: /api/contact', () => {
        test('should create a new phone record when correct payload is sent', () => {
            const payload = {
                firstName: "Adam",
                lastName: "Frank",
                phoneNumber: "07000000333",
                city: "Dover",
                postCode: "CT157FD"
            };

            return request(app)
                .put('/api/contact')
                .send(payload)
                .expect('Content-Type', /json/)
                .expect(201)
                .expect((response) => {
                    const data = response.body;
                    expect(data).toHaveProperty('_id');
                    expect(data.firstName).toBe(payload.firstName);
                });
        });

        test('should return 400 when no payload is sent', () => {
            return request(app)
                .put('/api/contact')
                .expect(400);
        });
    });

    describe('POST: /contact', () => {
        test('should update contact detail when valid input is provided', () => {
            const contact = testdata[1];
            const previousPhoneNumber = contact.phoneNumber;
            const payload = {
                _id: contact._id,
                phoneNumber: "07000000444"
            };
            return request(app)
                .post('/api/contact')
                .send(payload)
                .expect(202)
                .expect((response) => {
                    const updatedContact = response.body;
                    expect(updatedContact.phoneNumber).not.toBe(previousPhoneNumber);
                    expect(updatedContact.phoneNumber).toBe('07000000444');
                });
        });
    });

    describe('DELETE: /contact/:id', () => {
        test('should remove the requested contact detail', () => {
            const testcontact = testdata[0];
            return request(app)
                .delete(`/api/contact/${testcontact._id}`)
                .expect(200);
        });
    });

});