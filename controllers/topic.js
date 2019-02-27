const moment = require('moment'); //时间
const db = require('../models/db');

//查询话题
exports.list = async (req, res, next) => {
    try {
        const {
            _page = 1, _limit = 20
        } = req.query;
        //分页校验
        if (_page < 1) {
            _page = 1;
        }
        if (_limit < 1) {
            _limit = 1;
        }

        if (_limit > 20) {
            _limit = 20;
        }
        //开始页
        const start = (_page - 1) * _limit;
        const sqlStr = `SELECT * FROM topics LIMIT ${start}, ${_limit}`;
        const topics = await db.query(sqlStr);
        res.status(200).json(topics);


    } catch (err) {
        next(err)
    }

}

//创建话题
exports.create = async (req, res, next) => {
    try {
        const body = req.body;
        body.create_time = moment().format('YYYY-MM-DD hh:mm:ss');
        body.modify_time = moment().format('YYYY-MM-DD hh:mm:ss');
        body.user_id = user.id;

        const sqlStr = `INSERT INTO topics(title, content, user_id, create_time, modify_time) VALUES('${body.title}', '${body.content}', '${body.user_id}', '${body.create_time}', '${body.modify_time}')`;

        const ret = await db.query(sqlStr);
        const topic = await db.query(`SELECT * FROM topics WHERE id=${ret.insertId}`);
        res.status(201).json(topic[0]);

    } catch (err) {
        next(err)
    }


}

exports.update = async (req, res, next) => {
    try {
        const {id} = req.params;
        const body = req.body;
        
        const sqlStr = `UPDATE topics SET title='${body.title}', content='${body.content}', modify_time='${moment().format('YYYY-MM-DD hh:mm:ss')}' WHERE id=${id}`;
        //执行更新操作
        //console.log(sqlStr);

        await db.query(sqlStr);
        //返回资源
        const [updateTopic] = await db.query(`SELECT * FROM topics WHERE id=${id}`);
        res.status(201).json(updateTopic);

    } catch (err){
        next(err)
    }

}

exports.destroy = async (req, res, next) => {
    //根据话题 id 查询作者 id 如果话题中的user_id === 当前登陆用户名 id


    //url :id 动态路由参数 通过req.params获取
    //查询字符串: req.query
    //POST请求体 : req.body
    //动态路由参数 : req.params
    try {
        const {id} = req.params;

        //执行删除操作
        const sqlStr = `DELETE FROM topics WHERE id=${id}`;
        await db.query(sqlStr);
        //响应
        res.status(201).json({});
    } catch (err) {
        next(err)
    }



}