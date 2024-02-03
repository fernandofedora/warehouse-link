
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
        host: DB_HOST = process.env.DB_HOST,
        user: DB_USER = process.env.DB_USER,
        password: DB_PASSWORD = process.env.DB_PASSWORD,
        database: DB_NAME = process.env.DB_NAME,
        port:DB_PORT = process.env.DB_PORT,
        ssl: {
            rejectUnauthorized: false
        }
    }

};