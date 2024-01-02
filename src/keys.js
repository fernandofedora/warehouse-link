
//import {createPool} from 'mysql2/promise'
/*
module.exports = {

    database: {
        connectionLimit: 10,
        host: 'roundhouse.proxy.rlwy.net',
        user: 'root',
        password: 'EDEE66H3BbGH2heFd4f-ecAAAE2F-dAG',
        database: 'railway'

        planet:
        username : pc8gxbt6ni0dqgcfi558
        passwoird: pscale_pw_jrZEwyHZpxKt4jvuMoHIgXZsXVKt12LCYFCtCL4WfRC
        .end: DATABASE_URL='mysql://pc8gxbt6ni0dqgcfi558:pscale_pw_jrZEwyHZpxKt4jvuMoHIgXZsXVKt12LCYFCtCL4WfRC@aws.connect.psdb.cloud/db_links?ssl={"rejectUnauthorized":true}'

    }

};
*/


module.exports = {

    database: {
        connectionLimit: 10,
        host: DB_HOST = process.env.DB_HOST || 'localhost',
        user: DB_USER = process.env.DB_USER || 'root',
        password: DB_PASSWORD = process.env.DB_PASSWORD || 'fnoel1995',
        database: DB_NAME = process.env.DB_NAME || 'db_links',
        ssl:{
            rejectUnauthorized: false
        }
       // port:DB_PORT = process.env.DB_PORT || 3306
    }

};