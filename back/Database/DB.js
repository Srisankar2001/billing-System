const mysql = require('mysql2')

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '20011112',
    database : 'billing_system'
})

module.exports = db