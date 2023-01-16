const express = require('express');
const route = express.Router();
const { usersController } = require('../controllers');
const jwt = require('jsonwebtoken');
const { checkUser } = require('../config/validator');
const { uploader } = require('../config/uploader');

route.get('/', usersController.getData);
route.post('/regis', checkUser, usersController.regis);
route.post('/login', checkUser, usersController.login);
route.get('/keep', (req, res, next) => {
    // pengecekan token
    jwt.verify(req.token, 'eshop!', (err, decript) => {
        if (err) {
            return res.status(401).send({
                success: false,
                message: 'Authenticate token failed ⚠️'
            })
        }

        req.decript = decript; // menampung data hasil terjemahan token
        next();
    })

}, usersController.keepLogin);

route.patch('/profile', uploader('/imgProfile', 'IMGPROFILE').array('images', 1), usersController.profileImg);
module.exports = route;