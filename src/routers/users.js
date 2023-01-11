const express = require('express');
const route = express.Router();
const { usersController } = require('../controllers');
const jwt = require('jsonwebtoken');

route.get('/', usersController.getData);
route.post('/regis', usersController.regis);
route.post('/login', usersController.login);
route.get('/keep', (req, res, next) => {
    // pengecekan token
    jwt.verify(req.token, 'eshop!', (err,decript)=>{
        if(err){
            return res.status(401).send({
                success:false,
                message:'Authenticate token failed ⚠️'
            })
        }

        req.decript = decript; // menampung data hasil terjemahan token
        next();
    })

}, usersController.keepLogin);

module.exports = route;