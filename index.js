/*
 * @Author: your name
 * @Date: 2021-05-26 10:10:10
 * @LastEditTime: 2021-05-27 10:22:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \05jieduan-nodejs\koa-test\index.js
 */
const Koa = require('koa'); // 引入koa
const Router = require('koa-router');// 引入路由
const cors = require('koa-cors'); // 解决跨域                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
const mysql = require('mysql')
const bodyParser = require('koa-bodyParser');

const app = new Koa(); // 初始化实例
const router = new Router(); // 添加路由

// 跨域处理
app.use(cors());
app.use(bodyParser());

// 添加新路由
router.get('/', async (ctx, next) => {
  ctx.response.body = "hello world"
})

// 获取前端发送的参数
// TODO 登录功能
router.post('/login', async (ctx, next) => {
  let preData = ctx.request.body; // 获取前端传来的数据
  let findval = `select * from ceshi where username = '${preData.username}'and password = '${preData.password}'`; // 在数据库中要查找的内容（就是用户输入内容）
  // 获取数据库数据 let data = await new Mysql().query()
  let data = await new Mysql("mytest", "root", "123", "3306", "localhost").query(findval); // 从数据库中查询出来的那条数据
  ctx.body = {
    "data": data
  }
})

// TODO 注册功能
router.post('/register', async (ctx, next) => {
  let preData = ctx.request.body; // 获取前端传来的数据
  let creatVal = `insert into ceshi (username, password)values('${preData.username}','${preData.password}')`; // 在数据库中要创建的内容（就是用户输入内容）
  // 如果没有，加入数据库，并且再次登录可以成功
  let data2 = await new Mysql("mytest", "root", "123", "3306", "localhost").query(creatVal); // 在数据库中创建那条数据
  ctx.body = {
    'data': data2
  }
})

// TODO 表格-渲染
// 获取表格数据
router.post('/gettable', async (ctx, next) => {
  // 为填充表格内容获取数据库 ceshi2 的所有信息
  let ceshi2Data = `select * from ceshi2`; // 需要查找的内容
  let finalData = await new Mysql("mytest", "root", "123", "3306", "localhost").query(ceshi2Data);
  ctx.body = {
    'data': finalData 
  }
})

// TODO 表格-修改
// 修改表格数据
router.post('/settable', async(ctx, next) => {
  let tableData = ctx.request.body; // 获取前端传来的数据
  console.log(tableData);
  let modifyVal = `update ceshi2 set name='${tableData.name}', class='${tableData.class}', score='${tableData.score}' where id=${tableData.id}`; // 在数据库中要查找的内容（就是用户输入内容） 
  let msqVal = await new Mysql("mytest", "root", "123", "3306", "localhost").query(modifyVal); // 修改数据库中的内容
  ctx.body = {
    'data': msqVal
  }
})

// TODO 表格-删除
// 删除某一项
router.post('/deltableitem', async (ctx, next) => {
  let tableData = ctx.request.body; // 获取前端传来的数据
  console.log(tableData);
  let deleteVal = `delete from ceshi2 where id = ${tableData.id}` // 要在数据库删除的内容
  let msqVal = await new Mysql("mytest", "root", "123", "3306", "localhost").query(deleteVal); // 删除操作 返回 id
  ctx.body = {
    'data': msqVal
  }
})


// 注册路由
app.use(router.routes());

// 输出软件运行信息
// console.log("Sever is running http://127.0.0.1:3000");
// 设置配置文件
const config = {
  // 启动端口
  port: 3000,
  // 数据库配置
  database: {
    DATABASE: 'mytest',
    USERNAME: 'root',
    PASSWORD: '123',
    PORT: '3306',
    HOST: 'localhost'
  }
}
// 连接数据库
var pool = mysql.createPool({
  host: config.database.HOST,
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE
});

class Mysql {
  constructor(_database, _databasename, _databasepwd, _databaseport, _localhost) {
    // 数据库名称，数据库用户名，密码，端口，主机名
    this.database = _database; 
    this.databasename = _databasename;
    this.databasepwd = _databasepwd;
    this.databaseport = _databaseport;
    this.localhost = _localhost;
  }
  query(_val) {
    return new Promise((resolve, reject) => {
      pool.query(_val, function (error, results, fields) {
        if (error) {
          throw error
        };
        resolve(results)
        // console.log('The solution is: ', results);
      });
    })

  }
}
// 监听端口
app.listen(config.port);






