
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
        host: DB_HOST = process.env.DB_HOST || 'xxx',
        user: DB_USER = process.env.DB_USER || 'xxx',
        password: DB_PASSWORD = process.env.DB_PASSWORD || 'xxx',
        database: DB_NAME = process.env.DB_NAME || 'xxx',
        port:DB_PORT = process.env.DB_PORT || 3306,
        ssl: {
            rejectUnauthorized: false
        }
    }

};