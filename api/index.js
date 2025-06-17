// api/index.js

const serverless = require('serverless-http');
const app = require('../app'); // your main Express app
module.exports.handler = serverless(app);
