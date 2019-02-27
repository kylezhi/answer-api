const db = require('../models/db');
exports.list = async (req, res, next) => {

}

//添加
exports.create = async (req, res, next) => {
    //
    try {

        const {
            content = '',
            topics_id,
        } = req.body;
        const sqlStr = `
                        INSERT INTO comments(content,create_time,modify_time,topics_id,user_id) 
                        VALUES('${content}', '${Date.now()}', '${Date.now()}', ${topics_id},${req.session.user.id})`;
        
        //进行增删改操作时,db.query返回一个对象,可以使用解构赋值的方式
        const {insertId} = await db.query(sqlStr);
        //执行查询操作返回数组,可以用数组解构来取值
        const [comment] = await db.query(`SELECT * FROM comments WHERE id=${insertId}`);
        //响应
        res.status(201).json(comment);
    } catch (err) {
        next(err)
    }
}

exports.update = async (req, res, next) => {

}

exports.destroy = async (req, res, next) => {

}