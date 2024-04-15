const request = require('supertest');

const app = require('../../app.js');
const { startMongo, endMongo } = require('../../services/mongo.js');


describe('Launches API', () => {
    beforeAll(async () => {
        await startMongo();
    });

    afterAll(async () => {
        await endMongo();
    });

    describe('Test GET /launches', () => {

        test('Test should respond with 200 status', async function(){
            const response = await request(app)
                .get('/launches')
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });
    
    describe('Test POST /launches', () => {

        const blockWithDate = {
            mission: 'Kepler Exploration Alpha',
            target: 'Kepler-62 f',
            rocket: 'Explorer IS1',
            launchDate: 'January 4, 2030'
        };
    
        const blockWithoutDate = {
            mission: 'Kepler Exploration Alpha',
            target: 'Kepler-62 f',
            rocket: 'Explorer IS1',
        };
    
        test('POST should respond with 201', async function(){
            const response = await request(app)
                .post('/launches')
                .send(blockWithDate)
                .expect(201)
                .expect('Content-Type', /json/);
            const reqDate = new Date(blockWithDate.launchDate).valueOf();
            const resDate = new Date(response.body.launchDate).valueOf();
    
            expect(resDate).toBe(reqDate);
            expect(response.body).toMatchObject(blockWithoutDate);
        });
    
        test('POST should respond with 400 for invalid date', async function(){
            const response = await request(app)
                .post('/launches')
                .send({
                    mission: 'Kepler Exploration Alpha',
                    target: 'Kepler-62 f',
                    rocket: 'Explorer IS1',
                    launchDate: 'hello'
                })
                .expect(400)
                .expect('Content-Type', /json/)
    
            expect(response.body).toStrictEqual({error: 'Invalid launch date.'});
        });
    
        test('POST should respond with 400 for missing property', async function(){
            const response = await request(app)
                .post('/launches')
                .send({
                    mission: 'Kepler Exploration Alpha',
                    target: '',
                    rocket: 'Explorer IS1',
                    launchDate: 'January 4, 2030'
                })
                .expect(400)
                .expect('Content-Type', /json/)
            
            expect(response.body).toStrictEqual({error: 'Check request body.'});
        });
    });
});
