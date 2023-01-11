const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    hashPassword: (password) => {
        // membuat random secure key
        const salt = bcrypt.genSaltSync(10);

        // proses hasing password
        const hashPass = bcrypt.hashSync(password, salt);
        return hashPass;
    },
    createToken: (payload, expired = '24h') => {
        console.log(payload);
        let token = jwt.sign(payload, 'eshop!', {
            expiresIn: expired
        })

        return token;
    }
}