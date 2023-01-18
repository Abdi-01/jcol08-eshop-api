const mysql = require('mysql');
const util = require('util');

const dbConf = mysql.createPool({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'eshop'
})

const dbQuery = util.promisify(dbConf.query).bind(dbConf);

// Sequelze configuration
const { Sequelize } = require('sequelize');

const dbSequelize = new Sequelize("eshop",process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql'
})

// Pengecekan koneksi
const checkSequelize = async () => {
    try {
        await dbSequelize.authenticate();
        console.log('Sequelize connection success ✅');
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    dbConf, dbSequelize, checkSequelize, dbQuery
}