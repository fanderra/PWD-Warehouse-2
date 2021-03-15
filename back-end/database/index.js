const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'final_project',
    user: process.env.DB_USER,
    password:proccess.env.DB_PASSWORD
})

module.exports=connection