const request = require('supertest');
const app = require('../../api/app');
const PhonebookError = require('../../api/errors/phonebook.error');
const contactData = require('../fixtures/contact.data.json');
const phonebookService = require('../../api/services/phonebook.service');
jest.mock('../../api/services/phonebook.service');

describe('Phonebook API', () => {
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
            return request(app)
                .get('/api/contacts')
                .expect(200);
        });
    });

    describe('GET: /api/contact/:phonenumber', () => {
        afterAll(() => {
            phonebookService
                .fetchContact
                .mockReset();
        });

        test('should fetch the correct contact detail', () => {
            phonebookService
                .fetchContact
                .mockReturnValueOnce(Promise.resolve(contactData[0]));

            const phonenumber = '07000000111';
            return request(app)
                .get(`/api/contact/${phonenumber}`)
                .expect('Content-Type', /json/)
                .expect(200)
                .expect((response) => {
                    const { firstName, lastName, phoneNumber, postCode } = response.body;
                    expect(firstName).toBe('John');
                    expect(lastName).toBe('Doe');
                    expect(phoneNumber).toBe('07000000111');
                    expect(postCode).toBe('E1 6AN');
                });
        });

        test('should return 400 if phoneNumber is not found', () => {
            const invalidNumber = '09234';
            phonebookService
                .fetchContact
                .mockImplementation(() => {
                    throw new PhonebookError('Request Not Found', 404)
                });

            return request(app)
                .get(`/api/contact/${invalidNumber}`)
                .expect(404);
        });
    });

    describe('PUT: /api/contact', () => {
        test('should create a new phone record when correct payload is sent', () => {
            const payload = {
                "firstName": "Adam",
                "lastName": "Frank",
                "phoneNumber": "07000000333",
                "city": "Dover",
                "postCode": "CT157FD"
            };

            return request(app)
                .put('/api/contact')
                .send(payload)
                .expect('Content-Type', /json/)
                .expect(201);
        });

        test('should return 400 when no payload is sent', () => {
            return request(app)
                .put('/api/contact')
                .expect(400);
        });
    });

    describe('POST: /contact', () => {
        test('should update contact detail when valid input is provided', () => {
            const payload = {
                id: 1,
                phoneNumber: "07000000444"
            };
            return request(app)
                .post('/api/contact')
                .send(payload)
                .expect(202);
        });
    });


    describe('DELETE: /contact/:id', () => {
        test('should remove the requested contact detail', () => {
            const id = 1;
            return request(app)
                .delete(`/api/contact/${id}`)
                .expect(200);
        });
    });

});