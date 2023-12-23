require('./console')
const wx = require('./wx')

const fs = require('fs-extra-promise')
const koa = require('koa')
const mount = require('koa-mount')
const serve = require('koa-static')
const Router = require('koa-router')
const koaCors = require('koa-cors')
const koaBetterBody = require('koa-better-body')
const { join, basename } = require('path')
const uploadPath = join(__dirname, '../upload')

fs.ensureDirSync(uploadPath)

const app = koa()
const cors = koaCors({
    origin: '*'
})
const router = new Router()

router.get('/wxsign', function*() {
    const referer = this.request.get('referer')
    const sign = yield wx.getJsApiSign(referer)
    this.body = sign
})

router.post('/upload', koaBetterBody({
    uploadDir: uploadPath,
    keepExtensions: true
}), function*() {
    const { path } = this.request.files.image
    this.body = { url: `/upload/${basename(path)}` }
})



app.use(cors)
app.use(router.routes())

app.listen(8099)