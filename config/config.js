const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    api_secret_key: `${process.env.API_SECRET_KEY}`
}


