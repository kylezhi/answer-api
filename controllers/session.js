const db = require('../models/db');
const md5 = require('blueimp-md5');

/**
 * 获取会话状态
 */
exports.get = (req, res, next) => {
    const {user} = req.session;
    if(!user){
        return res.status(401).json({
            error : 'Unauthorized'
        })
    }
    res.status(200).json(user);
}
/**
 * 用户登录
 * 
 */
exports.create = async (req, res, next) => {
    //接收表彰数据
   
    try {
        const body = req.body;
        body.password = md5(md5(body.password));

        const sqlStr = `SELECT * FROM users WHERE email='${body.email}' and password='${body.password}'`;
        const [user] = await db.query(sqlStr);

        if(!user){
            return res.status(404).json({
                error : 'Invalid email or password!'
            });
        }
        //登录成功
        req.session.user = user;
        //发送响应
        res.status(201).json(user);

    } catch (err) {
        next(err)
    }

}

/**
 * 注销登陆
 */
exports.destroy = (req, res, next) => {
    delete req.session.user;
    res.status(201).json({});
}