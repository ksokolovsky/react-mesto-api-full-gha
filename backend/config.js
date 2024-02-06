require('dotenv').config();

const jwtSecret = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret';
module.exports = { jwtSecret };

