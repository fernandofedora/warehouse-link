
//import {createPool} from 'mysql2/promise'
/*
module.exports = {

    database: {
        connectionLimit: 10,
        host: '
        user: 'root',
        password: '',
        database: ''
    }

};
*/


module.exports = {

    database: {
        connectionLimit: 10,
        host: DB_HOST = 'localhost', //process.env.DB_HOST,
        user: DB_USER = 'root', //process.env.DB_USER,
        password: DB_PASSWORD = 'mypassword56426', //process.env.DB_PASSWORD,
        database: DB_NAME = 'warehouse', // process.env.DB_NAME,
        port:DB_PORT = 3306, // process.env.DB_PORT,
        ssl: {
            rejectUnauthorized: false
        }
    }

};