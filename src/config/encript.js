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
    },
    readToken: (req, res, next) => {
        // pengecekan token
        jwt.verify(req.token, 'eshop!', (err, decript) => {
            if (err) {
                return res.status(401).send({
                    success: false,
                    message: 'Authenticate token failed ⚠️'
                })
            }
            console.log(decript);
            req.decript = decript; // menampung data hasil terjemahan token
            next();
        })
    }
}