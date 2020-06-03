const mysql = require('mysql');

function createDBConnection() {
    const conn = mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'mok7376',
        database: 'honorscloset',
        multipleStatements: true
    });
    conn.connect();

    return conn;
}

module.exports = createDBConnection;
