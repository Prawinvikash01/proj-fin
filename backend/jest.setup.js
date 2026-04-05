const mongoose = require('mongoose');

beforeAll(async () => {
  jest.setTimeout(120000);
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/conexra_test';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
});

afterEach(async () => {
  const db = mongoose.connection.db;
  if (!db) return;
  const collections = await db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});
