
const mongoose = require('mongoose');
const app = require('./app');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/conexra';
const port = process.env.PORT || 5000;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
