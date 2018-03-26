const mysql = require('mysql');
// const pool = mysql.createPool({
//     host: config.mysql_host,
//     port: config.mysql_port,
//     user: config.mysql_user,
//     password: config.mysql_password,
//     database: config.mysql_database,
//     dateStrings: true,
//     multipleStatements: true
// });

const pool = mysql.createPool({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '',
    database: 'leizuoa',
    dateStrings: true,
    multipleStatements: true
});

// module.exports.connect = function(){
    
//       return new Promise((resolve, reject) => {
//         return pool.getConnection((err, connection) => {
//           if (err) {
//             reject(err);
//             return;
//           }
//           console.log('mySql connect successfully.....');
//           return connection;
//           // var sql = 'SELECT * FROM `stockout_details`';
//           // connection.query(sql, (err, rows) => {
//           //   console.log('success search');
//           //   connection.release();
//           //   if (err) {
//           //     reject(err);
//           //     return;
//           //   }
//           //   resolve(rows);
//           // });
//         });
//       });
    
//   }

module.exports = {
  query(sql, inserts) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }
        console.log('sql, inserts');
        connection.query(sql, inserts, (err, rows) => {
          connection.release();
          if (err) {
            reject(err);
            return;
          }
          resolve(rows);
        });
      });
    });
  }
}