const request = require('supertest');
const mongoose = require('mongoose');
const db = require('../db/test.connection');
const app = require('../../api/app');
const PhonebookError = require('../../api/errors/phonebook.error');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;
jest.setTimeout(10000);
let testata = [];
const X_PHONEBOOK_REQUESTER = process.env.X_PHONEBOOK_REQUESTER || 'cGhvbmVib29rYXBp';
const X_PHONEBOOK_TOKEN = 'x-phonebook-token';
let validToken = '';

describe('Phonebook API', () => {
    beforeAll(async () => {
        await db.init();
        await db.loadTestData();
        testdata = db.getTestData();
        return request(app)
            .get('/auth')
            .set('x-phonebook-requester', X_PHONEBOOK_REQUESTER)
            .expect((response) => {
                validToken = response.text;
            });
    });
    afterAll(async () => {
        await db.cleanUp();
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    describe('Auth', () => {

        test('should return a valid token if correct auth data is provided', () => {
            return request(app)
                .get('/auth')
                .set('x-phonebook-requester', X_PHONEBOOK_REQUESTER)
                .expect(200)
                .expect((response) => {
                    expect(response.text).toBeTruthy();
                });
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
                .set(X_PHONEBOOK_TOKEN, validToken)
                .expect(200);
        });
    });

    describe('GET: /api/phonebook', () => {
        test('should list all the contact details based on provided criteria', async () => {
            const test1 = testdata[0];
            return request(app)
                .get('/api/phonebook')
                .set(X_PHONEBOOK_TOKEN, validToken)
                .expect(200)
                .expect((response) => {
                    const data = response.body;
                    expect(data.length).toBe(db.MAX_DATA);
                    expect(data[0]._id.toString()).toBe(test1._id.toString());
                });
        });
    });

    describe('GET: /api/phonebook/cities', () => {
        test('should list all the cities in the database', async () => {
            const cities = testdata.map(t => t.city);
            return request(app)
                .get('/api/phonebook/cities')
                .set(X_PHONEBOOK_TOKEN, validToken)
                .expect(200)
                .expect((response) => {
                    const data = response.body;
                    expect(data.length).toBe(cities.length);
                });
        });
    });

    describe('GET: /api/phonebook/postcodes', () => {
        test('should list all the postcodes in the database', async () => {
            const postcodes = testdata.map(t => t.postCode);
            return request(app)
                .get('/api/phonebook/postcodes')
                .set(X_PHONEBOOK_TOKEN, validToken)
                .expect(200)
                .expect((response) => {
                    const data = response.body;
                    expect(data.length).toBe(postcodes.length);
                });
        });
    });

    describe('GET: /api/phonebook/:city/:postCode', () => {
        test('should list all the phone number in a city under a postcode in the database', async () => {
            const contactData = testdata[0];
            return request(app)
                .get(`/api/phonebook/${contactData.city}/${contactData.postCode}`)
                .set(X_PHONEBOOK_TOKEN, validToken)
                .expect(200)
                .expect((response) => {
                    const data = response.body;
                    const { firstName, lastName, phoneNumber, postCode } = data[0];
                    expect(data.length).toBe(1);
                    expect(firstName).toBe(contactData.firstName);
                    expect(lastName).toBe(contactData.lastName);
                    expect(phoneNumber).toBe(contactData.phoneNumber);
                    expect(postCode).toBe(contactData.postCode);
                });
        });
    });

    describe('GET: /api/phonebook/:phonenumber', () => {
        test('should fetch the correct contact detail', () => {
            const contactData = testdata[0];
            return request(app)
                .get(`/api/phonebook/${contactData.phoneNumber}`)
                .set(X_PHONEBOOK_TOKEN, validToken)
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
                .get(`/api/phonebook/${invalidNumber}`)
                .set(X_PHONEBOOK_TOKEN, validToken)
                .expect(404);
        });
    });

    describe('PUT: /api/phonebook', () => {
        test('should create a new phone record when correct payload is sent', () => {
            const payload = {
                firstName: "Adam",
                lastName: "Frank",
                phoneNumber: "07000000333",
                city: "Dover",
                postCode: "CT157FD"
            };

            return request(app)
                .put('/api/phonebook')
                .set(X_PHONEBOOK_TOKEN, validToken)
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
                .put('/api/phonebook')
                .set(X_PHONEBOOK_TOKEN, validToken)
                .expect(400);
        });
    });

    describe('POST: /phonebook', () => {
        test('should update contact detail when valid input is provided', () => {
            const contact = testdata[1];
            const previousPhoneNumber = contact.phoneNumber;
            const payload = {
                _id: contact._id,
                phoneNumber: "07000000444"
            };
            return request(app)
                .post('/api/phonebook')
                .set(X_PHONEBOOK_TOKEN, validToken)
                .send(payload)
                .expect(202)
                .expect((response) => {
                    const updatedContact = response.body;
                    expect(updatedContact.phoneNumber).not.toBe(previousPhoneNumber);
                    expect(updatedContact.phoneNumber).toBe('07000000444');
                });
        });
    });

    describe('DELETE: /phonebook/:id', () => {
        test('should remove the requested contact detail', () => {
            const testcontact = testdata[0];
            return request(app)
                .delete(`/api/phonebook/${testcontact._id}`)
                .set(X_PHONEBOOK_TOKEN, validToken)
                .expect(200);
        });
    });

});