require('dotenv').config();
const request = require('supertest');
const app = require('../app');

// App-level behaviors that are not tied to a specific feature model:
// health check, unknown-route 404 handler, and malformed-JSON handling.
// No database connection is required for these.

describe('GET /api/health', () => {
  it('should return 200 with the standard success envelope', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toBe('Server is running');
  });
});

describe('Unknown route handling', () => {
  it('should return 404 with the standard error envelope for an unknown route', async () => {
    const res = await request(app).get('/api/this-route-does-not-exist');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Route not found');
  });
});

describe('Malformed JSON body handling', () => {
  it('should reject an invalid JSON body without leaking a stack trace', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('Content-Type', 'application/json')
      .send('{ "name": "broken", '); // malformed JSON

    // express.json() surfaces a parse error; the centralized handler returns
    // a JSON body. Accept 400 (mapped) or 500 (default), but never a raw
    // HTML stack trace, and always the success:false envelope shape.
    expect([400, 500]).toContain(res.statusCode);
    expect(res.body.success).toBe(false);
    expect(typeof res.body.message).toBe('string');
  });
});
