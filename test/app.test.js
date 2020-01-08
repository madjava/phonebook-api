const request = require('supertest');
const app = require('../api/app');

describe('Phonebook API', () => {
    test('should hit the base endpoint and return 200', () => {
        return request(app)
            .get('/')
            .expect(200);
    });

    describe('/api', () => {
        test('should hit the base /api route', () => {
            return request(app)
                .get('/api')
                .expect(200);
        });
    });
});