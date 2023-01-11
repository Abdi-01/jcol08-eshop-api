const mysql = require('mysql');

const dbConf = mysql.createPool({
    host: 'localhost',
    user: 'AL',
    password: '007@001',
    database: 'eshop'
})

// Sequelze configuration
const { Sequelize } = require('sequelize');

const dbSequelize = new Sequelize("eshop", "AL", "007@001", {
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
    dbConf, dbSequelize, checkSequelize
}