const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db1.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)

// 自定义路由，需要我们用jsonServer的reWrite方法进行重定向
// server.use(jsonServer.rewriter({
//     '/api/*': '/$1',
//     '/blog/:resource/:id/show': '/:resource/:id'
// }))

// 在此添加自定义的路由
server.get('/echo', (req, res) => {
    res.jsonp(req.query)
})

server.use(jsonServer.bodyParser)

server.post('/authLogin', (req, res) => {
    // req.body:username  password
    if (req.body.username === 'admin' && req.body.password === 'PU8r8H3BvjiyDNbkaUmhBx+dDj0') {
        res.jsonp({
            code: 1,
            msg: '登录成功',
            auth_token: 'huzhenxiao'
        })
    } else {
        res.jsonp({
            code: 8,
            msg: '登录失败',
        })
    }
})



// 给post的请求返回创建时间的属性
server.use((req, res, next) => {
    if (req.method === 'POST') {
        req.body.createdAt = Date.now()
    }
    next()
})

// 这是挂载登录校验的中间件
server.use('/api', (req, res, next) => {

    // 约定：发送ajax请求：必须带一个header：Authorization:xxxxxxxxxxxxxxxxxxxx;
    // 加密的字符串是前端登录的时候后台生成并返回给客户端登录的凭证。

    // isAuthorized就是你自己校验的逻辑
    if (req.get('Authorization')) { // add your authorization logic here
        next() // continue to JSON Server router
    } else {
        // res.sendStatus(401)  // 给客户端发送一个未校验的字符串
        res.status(401).jsonp({
            code: 7, // 7是未登录
            msg: "没有登录，不能访问"
        })
    }
})

router.render = (req, res) => {
    res.jsonp({
        msg: 'ok',
        code: 1,
        data: res.locals.data
    })
}

// 这个就相当于把当前所有的路由地址挂载在 '/api/course
server.use('/api', router)
server.listen(3000, () => {
    console.log('JSON Server is running')
})