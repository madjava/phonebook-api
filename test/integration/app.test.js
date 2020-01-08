const request = require('supertest');
const app = require('../../api/app');
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

    describe('POST: /api/contact', () => {
        beforeEach(() => {
            phonebookService
                .fetchContact
                .mockReturnValue(contactData[0]);
        });
        afterEach(() => {
            phonebookService
                .fetchContact
                .mockReset();
        });

        test('should fetch the correct contact detail', () => {
            const phoneNumber = '07000000111';
            return request(app)
                .post('/api/contact')
                .send({ phoneNumber })
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

        test('should return 400 if phoneNumber is not provided', (done) => {
             request(app)
                .post('/api/contact')
                .expect(400)
                .end(done)
        });
    });
});