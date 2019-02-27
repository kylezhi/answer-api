const express = require('express');
const router = require('./router');
const session = require('express-session');

const app = express();

const bodyParser = require('body-parser');

//配置解析表单请求体
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

//配置session
app.use(session({
    // 配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密
    // 目的是为了增加安全性，防止客户端恶意伪造
    secret: 'answer',
    resave: false,
    saveUninitialized: false // 无论你是否使用 Session ，我都默认直接给你分配一把钥匙
  }))
  

//把路由应用到app中
app.use(router);

//统一处理500错误
app.use((err, req, res, next) => {
    res.status(500).json({
        error: err.message
    })
})


app.listen(3000, () => {
    console.log('app is running at port 3000')
});