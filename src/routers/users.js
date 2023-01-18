const express = require('express');
const route = express.Router();
const { usersController } = require('../controllers');
const jwt = require('jsonwebtoken');
const { checkUser } = require('../config/validator');
const { uploader } = require('../config/uploader');
const { readToken } = require('../config/encript');

route.get('/', usersController.getData);
route.post('/regis', checkUser, usersController.regis);
route.post('/login', checkUser, usersController.login);
route.get('/keep', readToken, usersController.keepLogin);

route.patch('/profile', readToken,
    uploader('/imgProfile', 'IMGPROFILE').array('images', 1),
    usersController.profileImg);

route.patch('/verified', readToken, usersController.verifiedAccount)
module.exports = route;