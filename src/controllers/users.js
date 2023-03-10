const { dbConf, dbQuery } = require("../config/db");
const { hashPassword, createToken } = require("../config/encript");
const UsersModel = require("../model/users");
const bcrypt = require('bcrypt');
const { transport } = require("../config/nodemailer");

module.exports = {
    getData: async (req, res) => {
        try {
            await client.connect();
            let dataRedis = await client.get('allUser');
            console.log(dataRedis);
            if (dataRedis) {
                res.status(200).send({ isCached: true, data: JSON.parse(dataRedis) });
            } else {
                let data = await UsersModel.findAll();
                await client.set('allUser', JSON.stringify(data), 'EX', 120);
                res.status(200).send(data);
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);

        }
        // dbConf.query(`SELECT * FROM users;`, (err, results) => {
        //     if (err) {
        //         console.log(err);
        //         return res.status(500).send(err);
        //     }
        //     return res.status(200).send(results);
        // })
    },
    regis: async (req, res) => {
        try {
            let { username, email, password } = req.body;
            // 0. Hashing password dahulu
            const newPass = hashPassword(password);
            console.log(newPass);
            // 1. GET data untuk memeriksa, apakah email dan/atau username, sudah pernah digunakan
            let results = await dbQuery(`SELECT * FROM USERS
            WHERE email=${dbConf.escape(email)} OR username=${dbConf.escape(username)};`);
            if (results.length > 0) {
                // 2. Jika ada value yang didapatkan, maka kirim response untuk regis ulang
                return res.status(200).send({
                    success: false,
                    message: 'Username or Email is existed ⚠️'
                });
            } else {
                // 3. jika tidak ada yang sama maka registrasi berlanjut
                let resultInsert = await dbQuery(`INSERT INTO users (username,email,password) 
                values (${dbConf.escape(username)},${dbConf.escape(email)},${dbConf.escape(newPass)});`);

                let token = createToken({ id: resultInsert.insertId, username, email });
                transport.sendMail({
                    from: 'ESHOP ADMIN',
                    to: email,
                    subject: 'Verification email account',
                    html: `<div>
                    <h3>Click link below for verification your email</h3>
                    <a href="http://localhost:3000/verification?t=${token}">Verifie Now</a>
                    </div>`
                }, (err, info) => {
                    if (err) {
                        return res.status(400).send(err);
                    }
                    return res.status(201).send({
                        success: true,
                        message: 'Register your account success ✅, check your email',
                        info
                    })
                })
            }

        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },
    login: (req, res) => {
        console.log(req.body);
        dbConf.query(`Select id as iduser, username, email, phone, password, role, status, address, profile 
        from users where email=${dbConf.escape(req.body.email)};`, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            console.log(results);
            const check = bcrypt.compareSync(req.body.password, results[0].password);
            console.log(check);
            delete results[0].password;
            if (check) {
                console.log(results[0]);
                let token = createToken({ ...results[0] });
                return res.status(200).send({ ...results[0], token });
            } else {
                return res.status(401).send({
                    success: false,
                    message: "Your password is wrong ⚠️"
                });
            }
        })
    },
    keepLogin: (req, res) => {
        console.log(req.decript);
        dbConf.query(`Select id as iduser, username, email, phone, password, role, status, address, profile 
        from users where id=${dbConf.escape(req.decript.iduser)};`, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            let token = createToken({ ...results[0] });
            return res.status(200).send({ ...results[0], token });
        })
    },
    update: (req, res) => {

    },
    delete: (req, res) => {

    },
    profileImg: (req, res) => {
        console.log(req.files);
        // yang disimpan ke database : /imgProfile/filename
        dbConf.query(`UPDATE users set profile=${dbConf.escape(`/imgProfile/${req.files[0].filename}`)}
        where id=${dbConf.escape(req.decript.iduser)};`, (err, results) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: err
                });
            }
            return res.status(200).send({
                success: true,
                message: 'Upload success ✅'
            });
        })
    },
    verifiedAccount: (req, res) => {
        // Digunakan untuk merubah status akun, yang awalnya unverified menjadi verified
        console.log(req.decript);
        dbConf.query(`UPDATE users set status="verified" where id=${dbConf.escape(req.decript.id)};`, (err, results) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: err
                });
            }
            return res.status(200).send({
                success: true,
                message: 'Your account verified ✅'
            });
        })
    }
}