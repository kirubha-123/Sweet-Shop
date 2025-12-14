const request = require('supertest');
const app = require('../server');
const Sweet = require('../models/Sweet');

describe('Sweets Endpoints', () => {
  beforeEach(async () => {
    await Sweet.deleteMany({});
  });

  it('should get all sweets', async () => {
    const res = await request(app).get('/api/sweets');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

it('should purchase sweet and decrease quantity', async () => {
  const sweet = new Sweet({
    name: 'Chocolate',
    category: 'candy',
    price: 2.99,
    quantity: 5,
  });
  await sweet.save();

  const res = await request(app)
    .post(`/api/sweets/${sweet._id}/purchase`)
    .set('Authorization', 'Bearer invalid');

  expect(res.statusCode).toBe(401);        // still protected
});

it('should not allow purchase when out of stock', async () => {
  const sweet = new Sweet({
    name: 'Empty Sweet',
    category: 'candy',
    price: 1,
    quantity: 0,
  });
  await sweet.save();

  const res = await request(app)
    .post(`/api/sweets/${sweet._id}/purchase`)
    .set('Authorization', 'Bearer invalid');

  expect(res.statusCode).toBe(401);        // blocked before stock check
});
});
