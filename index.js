const fs = require('fs')
const Koa = require('koa')
const app = new Koa()

// Global constants
const path = './all-zones'

// Store data []object in memory
let data = []

// Load data from path
const files = fs.readdirSync(path)
for (const e of files) {
  const hcKey = e.split('.')[0].toUpperCase()
  const values = fs.readFileSync(path + '/' + e).toString().replace(/\n/g, '<br>')
  data.push({ hc_key: hcKey, values: values })
}

// Logger
app.use(async (ctx, next) => {
  await next()
  const rt = ctx.response.get('X-Response-Time')
  console.log(`${ctx.method} ${ctx.url} - ${rt}`)
})

// index.html & /data
app.use(async ctx => {
  if (ctx.URL.pathname === '/data') {
    ctx.type = 'application/json; charset=utf-8'
    ctx.body = JSON.stringify(data)
    return
  }
  ctx.type = 'text/html; charset=utf-8'
  ctx.body = fs.createReadStream('./index.html')
})

console.log('Server listening on 8000')
app.listen(8000)
