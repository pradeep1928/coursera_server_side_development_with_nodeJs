const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    'secretKey': '12345-67890-09876-54321',
    'mongoUrl' : process.env.MONGOURL,
    'facebook': {
        clientID: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET
    }
}