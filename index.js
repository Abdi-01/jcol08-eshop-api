const express = require('express');
const PORT = 2600;
const app = express();
const cors = require('cors');
const bearerToken = require('express-bearer-token');

app.use(cors());
app.use(bearerToken());

app.use(express.json());
app.use(express.static('src/public'));

app.get('/', (req, res) => {
    res.status(200).send('<h1>ESHOP API</h1>');
});

// TESTING MYSQL CONNECTION
const { dbConf, checkSequelize } = require('./src/config/db');
dbConf.getConnection((err, connection) => {
    if (err) {
        console.log(`Error MySQL Connection`, err.sqlMessage);
    }

    console.log(`Connect MySQL ✅ : ${connection.threadId}`);
})

// TESTING SEQUELIZE CONNECTION
checkSequelize();
// CONFIG ROUTE
const { usersRouter } = require('./src/routers');
app.use('/users', usersRouter);

app.listen(PORT, () => console.log(`RUNNING API ${PORT}`))