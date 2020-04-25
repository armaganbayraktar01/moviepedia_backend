const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const uri = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

module.exports = () => {
  mongoose.connect(uri, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  mongoose.connection.on('open', () => {
     console.log('MongoDB: Connected');
  });
  mongoose.connection.on('error', (err) => {
    console.log('MongoDB: Error', err);
  });

  mongoose.Promise = global.Promise;
};