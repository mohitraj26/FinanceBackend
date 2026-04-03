const request = require('supertest');
const app = require('../app');

describe('Health endpoint', () => {
  it('should return status ok', async () => {
    const response = await request(app).get('/health');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: { status: 'ok' }
    });
  });
});
