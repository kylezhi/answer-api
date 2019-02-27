const mysql = require('mysql');
//创建一个连接池
const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : 'root',
    database        : 'answer'
  });
   

/**
 * query 方法:
 * 查询返回数组 
 * 增删改返回对象
 * 
 */
exports.query = function(sqlStr){
   
    return new Promise((resolve, reject) => {
         //从连接池中拿一个连接
        pool.getConnection((err, connection) => {
            if(err){
                return reject(err);
            }
            connection.query(sqlStr, (err, ...args)=>{
                connection.release(); //释放连接池
                if(err){
                    return reject(err);
                }
                resolve(...args);
            })
        })
    })
}