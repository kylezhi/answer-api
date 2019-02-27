const md5 = require('blueimp-md5'); //加密
const moment = require('moment'); //时间
const db = require('../models/db');
exports.list = (req, res, next) => {

}

exports.create = async (req, res, next) => {
    //console.log(req.body);
    try {
        const body = req.body;
        const sqlStr = `INSERT INTO USERS(username, password, email, nickname, avatar, gender, create_time, modify_time) VALUES('${body.email}', '${md5(md5(body.password))}', '${body.email}', '${body.nickname}', 'default-avatar.png', 0, '${moment().format('YYYY-MM-DD hh:mm:ss')}', '${moment().format('YYYY-MM-DD hh:mm:ss')}')`;
        const ret = await db.query(sqlStr);
        const users = await db.query(`SELECT * FROM users WHERE id='${ret.insertId}'`);
        res.status(201).json(users[0]);
        //console.log(ret);
    }catch(err){
        // res.status(500).json({
        //     error : err.message
        // })
        next(err)
    }
    
   // console.log(ret[0]);
}

exports.update = (req, res, next) => {

}

exports.destroy = (req, res, next) => {

}