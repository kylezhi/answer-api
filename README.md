### 1.answer

### 第三方包

- moment  //时间
- express
- body-parser
- blueimp-md5
- mysql

#### 1.1 生成数据库
```javascript
create database if not exists answer;

use answer;

create table user(
	id int unsigned not null auto_increment,
	username varchar(50) not null comment '用户名',
	password varchar(50) not null comment '密码',
	email varchar(50) not null comment '邮箱',
	avatar varchar(150) null comment '头像',
	gender bit null comment '性别',
	create_time datetime not null comment '创建时间',
	modify_time datetime not null comment '修改时间',
	primary key(id)
)engine=InnoDB charset=utf8 comment '用户表'; 

create table topics(
	id int unsigned not null auto_increment,
	title varchar(100) not null comment '标题',
	content text not null comment '内容',
	create_time datetime not null comment '创建时间',
	modify_time datetime not null comment '修改时间',
	user_id int unsigned not null comment '所属用户',
	primary key(id)
)engine=InnoDB charset=utf8 comment '话题表'; 

create table comments(
	id int unsigned not null auto_increment,
	content text not null comment '评论内容',
	create_time datetime not null comment '创建时间',
	modify_time datetime not null comment '修改时间',
	topics_id int unsigned not null comment '所属话题',
	user_id int unsigned not null comment '所属用户',
	reply_id int unsigned null comment '所属回复人',
	primary key(id)
)engine=InnoDB charset=utf8 comment '评论表'; 

```
#### 1.2 初始化服务端结构
```javascript
|--- app.js
|--- config.js
|--- controllers
|--- models
|--- node_modules
|--- package.json
|--- package-lock.json
|--- routes
```
#### 1.3 设计接口(数据库路由)

### 2. 接口设计规范 :RESTful
> 接口的目的就是用于资源操作的
>
>  增册改查

- GET/topics
- POST/topics/new
- POST/topics/modify

#### 2.1 域名
应该尽量将API部署在专用域名之下

`https://api.example.com`

#### 2.2 版本
应该将API的版本号放入URL。

`https://api.example.com/v1/`

#### 2.3 路径（Endpoint）
路径又称"终点"（endpoint），表示API的具体网址。

在RESTful架构中，每个网址代表一种资源（resource），所以网址中不能有动词，只能有名词，而且所用的名词往往与数据库的表格名对应。一般来说，数据库中的表都是同种记录的"集合"（collection），所以API中的名词也应该使用复数。

举例来说，有一个API提供动物园（zoo）的信息，还包括各种动物和雇员的信息，则它的路径应该设计成下面这样。

```javascript
https://api.example.com/v1/zoos
https://api.example.com/v1/animals
https://api.example.com/v1/employees
```


#### 2.4 HTTP 动词
- GET（SELECT）：从服务器取出资源（一项或多项）。
- POST（CREATE）：在服务器新建一个资源。
- PUT（UPDATE）：在服务器更新资源（客户端提供改变后的完整资源）。
- PATCH（UPDATE）：在服务器更新资源（客户端提供改变的属性）。
- DELETE（DELETE）：从服务器删除资源。

下面是一些例子
```javascript
GET /zoos：列出所有动物园
POST /zoos：新建一个动物园
GET /zoos/ID：获取某个指定动物园的信息
PUT /zoos/ID：更新某个指定动物园的信息（提供该动物园的全部信息）
PATCH /zoos/ID：更新某个指定动物园的信息（提供该动物园的部分信息）
DELETE /zoos/ID：删除某个动物园
GET /zoos/ID/animals：列出某个指定动物园的所有动物
DELETE /zoos/ID/animals/ID：删除某个指定动物园的指定动物
```

#### 2.5 过滤信息（Filtering）
如果记录数量很多，服务器不可能都将它们返回给用户。API应该提供参数，过滤返回结果。

下面是一些常见的参数。
```javascript
?limit=10：指定返回记录的数量
?offset=10：指定返回记录的开始位置。
?page=2&per_page=100：指定第几页，以及每页的记录数。
?sortby=name&order=asc：指定返回结果按照哪个属性排序，以及排序顺序。
?animal_type_id=1：指定筛选条件
```
参数的设计允许存在冗余，即允许API路径和URL参数偶尔有重复。比如，GET /zoo/ID/animals 与 GET /animals?zoo_id=ID 的含义是相同的。


#### 2.6 状态码（Status Codes）
服务器向用户返回的状态码和提示信息，常见的有以下一些（方括号中是该状态码对应的HTTP动词）。
```javascript
200 OK - [GET]：服务器成功返回用户请求的数据，该操作是幂等的（Idempotent）。
201 CREATED - [POST/PUT/PATCH]：用户新建或修改数据成功。
202 Accepted - [*]：表示一个请求已经进入后台排队（异步任务）
204 NO CONTENT - [DELETE]：用户删除数据成功。
400 INVALID REQUEST - [POST/PUT/PATCH]：用户发出的请求有错误，服务器没有进行新建或修改数据的操作，该操作是幂等的。
401 Unauthorized - [*]：表示用户没有权限（令牌、用户名、密码错误）。
403 Forbidden - [*] 表示用户得到授权（与401错误相对），但是访问是被禁止的。
404 NOT FOUND - [*]：用户发出的请求针对的是不存在的记录，服务器没有进行操作，该操作是幂等的。
406 Not Acceptable - [GET]：用户请求的格式不可得（比如用户请求JSON格式，但是只有XML格式）。
410 Gone -[GET]：用户请求的资源被永久删除，且不会再得到的。
422 Unprocesable entity - [POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误。
500 INTERNAL SERVER ERROR - [*]：服务器发生错误，用户将无法判断发出的请求是否成功。
```

#### 2.7 错误处理（Error handling）
如果状态码是4xx，就应该向用户返回出错信息。一般来说，返回的信息中将error作为键名，出错信息作为键值即可。
```javascript
{
    error: "Invalid API key"
}
```

#### 2.8 返回结果
针对不同操作，服务器向用户返回的结果应该符合以下规范。
```js
GET /collection：返回资源对象的列表（数组）
GET /collection/resource：返回单个资源对象
POST /collection：返回新生成的资源对象
PUT /collection/resource：返回完整的资源对象
PATCH /collection/resource：返回完整的资源对象
DELETE /collection/resource：返回一个空文档
```


### 3. 接口设计
> 基于RESTful接口设计规范来设计接口
#### 3.1 用户资源处理
##### 3.1.1 获取所有用户
请求方法: `GET`

请求路径: URL: `/users`

请求体:
```js
无
```
响应结果:
```js

```

##### 3.1.2 添加用户
请求方法: `POST`

请求路径: URL: `/users`

请求体:
```js
无
```
响应结果:
```js
{
	email :
	password : 
	nickname :
}
```
##### 3.1.3 修改用户
请求方法: `PATCH`

请求路径: URL: `/users/:id`

请求参数: `id`  用户id

请求体:

```js
无
```

响应结果:

```js

```

##### 3.1.4 删除用户
请求方法: `DELETE`

请求路径: URL: `/users/:id`

请求体:
```js
无
```
响应结果:
```js

```

#### 3.2 话题资源处理
##### 3.2.1 分页获取所有话题
请求方法: `GET`

请求路径: URL: `/topics`

请求参数: 

- `_page`  默认值:1
- `_limit` 默认值:20

请求体:
```js
无
```
响应结果:
```js

```
##### 3.2.2 添加话题
请求方法: `POST`

请求路径: URL: `/topics`

请求体:
```js
无
```
响应结果:
```js

```
##### 3.2.3 修改话题

请求方法: `PATCH`

请求路径: URL: `/topics/:id`

请求参数: `id`  话题id

请求体:

```js
无
```

响应结果:

```js

```

##### 3.2.4 删除话题

请求方法: `DELETE`

请求路径: URL: `/topics/:id`

请求体:

```js
无
```

响应结果:

```js

```

#### 3.3 评论资源处理

##### 3.3.1 获取所有评论

请求方法: `GET`

请求路径: URL: `/comments`

请求体:

```js
无
```

响应结果:

```js

```

##### 3.3.2 添加评论

请求方法: `POST`

请求路径: URL: `/comments`

请求体:

```js
无
```

响应结果:

```js

```

##### 3.3.3 修改评论

请求方法: `PATCH`

请求路径: URL: `/comments/:id`

请求体:

```js
无
```

响应结果:

```js

```

##### 3.31.4 删除评论

请求方法: `DELETE`

请求路径: URL: `/comments/:id`

请求体:

```js
无
```

响应结果:

```js

```

#### 3.4 会话管理
##### 3.4.1 创建会话(用户登录)

请求方法: `POST`

请求路径: URL: `/session`

请求体:

```js
无
```

响应结果:

```js

```



##### 3.4.2 删除会话(用户退出)

请求方法: `DELETE`

请求路径: URL: `/session`

请求体:

```js
无
```

响应结果:

```js

```



##### 3.4.3 获取登录状态(获取会话状态)

请求方法: `GET`

请求路径: URL: `/session`

请求体:

```js
无
```

响应结果:

```js

```

#### 



> GET用来获取资料,POST用来新建资料(也可以用于更新资资源),PUT用来更新资源,DELETE用来删除资源

- /users
- /topics
- /comments