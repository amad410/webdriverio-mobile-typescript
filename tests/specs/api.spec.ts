import request from 'supertest';
import assert from 'assert';


describe('WebdriverIO and Appium, when interacting with a login form,', () => {
    beforeEach(async () => {
       
    });

    it('should be able login successfully', async () => {
        const response = await request('./')
        .get('/user')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

    });

    after(async() => {
        
    });
});