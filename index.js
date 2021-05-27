/*
 * @author: DSCode
 * @create: 2021-05-27 14:20 PM
 * @license: MIT
 * @lastAuthor: DSCode
 * @lastEditTime: 2021-05-27 15:28 PM
 * @desc: 用户业务
 */

// 引入众多包
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const mysql = require('mysql')

// 初始化应用程序
const app = new Koa()
const router = new Router()

/**
 * TODO 根路由
 */
// ctx = requset + response
router.get('/', (ctx, next) => {
  ctx.body = 'Hello Koa'
})

/**
 * TODO Login 服务
 */
router.post('/login', async (ctx, next) => {
  try {
    const username = ctx.request.body.username
    const password = ctx.request.body.password
    // ! 定义 SQL 语句
    const sql = `SELECT ID FROM user WHERE username="${username}" AND password="${password}";`
    const id = await query(sql)
    console.log(id)
    if (id) {
      ctx.body = '你好,你来了'
    } else {
      ctx.body = '你失败了'
    }
  } catch (err) {
    ctx.body = [username, password]
  }
})

/**
 * TODO Singup 服务
 */
router.post('/singup', async (ctx, next) => {
  try {
    const username = ctx.request.body.username
    const password = ctx.request.body.password
    // ! 定义 SQL 语句
    const sql = `SELECT ID FROM user WHERE username="${username}";`
    const id = await query(sql)
    console.log(id)
    if (id) {
      ctx.body = '当前账号已注册'
    } else {
      const sql =
        "INSERT INTO `user`(`username`,`password`) VALUES ('" +
        username +
        "','" +
        password +
        "');"
      ctx.body = '注册成功'
    }
  } catch (err) {
    ctx.body = err
  }
})

// TODO 数据库配置
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'ds',
  database: 'userdb',
})

// TODO 创建数据库查询函数
const query = (sql) => {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          // 结束会话
          connection.release()
        })
      }
    })
  })
}

/**
 * TODO 注册相关服务
 */
app.use(bodyParser())
app.use(router.routes())

/**
 * TODO 监听网络接口
 */
app.listen('3000')
