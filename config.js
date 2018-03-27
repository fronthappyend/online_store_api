const generatePassword = require('password-generator');

const  config = {
    url: 'http://localhost:3000',
    port: 3000,
    vendor: {
        email_regexp: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    admin: {
        password: generatePassword()
    }
}

module.exports = config
