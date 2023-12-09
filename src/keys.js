
//import {createPool} from 'mysql2/promise'
/*
module.exports = {

    database: {
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: 'fnoel1995',
        database: 'db_links'
    }

};
*/

module.exports = {

    database: {
        connectionLimit: 10,
        host: DB_HOST = process.env.DB_HOST || 'localhost',
        user: DB_USER = process.env.DB_USER || 'root',
        password: DB_PASSWORD = process.env.DB_PASSWORD || 'fnoel1995',
        database: DDB_NAME = process.env.DB_NAME || 'db_links'
    }

};