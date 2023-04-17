const dotenv = require('dotenv');
const { isPropertyAccessChain } = require('typescript');

dotenv.config();

module.exports = {
  publicRuntimeConfig: {
    apiKey: process.env.API_KEY
  }
}

//setUp API key and exporting it, now we can use it in our app