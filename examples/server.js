const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')
const path = require('path')

const app = express()
const port = 8080
const compiler = webpack(WebpackConfig)

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}))

app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname, {
  setHeaders(res) {
    res.cookie('XSRF-TOKEN-D', '1234abc')
  }
}))

app.use(bodyParser.json())

const router = express.Router()

registerSimpleRouter()
registerBaseRouter()

app.use(router)

module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})

function registerSimpleRouter() {
  router.get('/simple/get', function(req, res) {
    res.json({
      msg: 'hello world'
    })
  })
}

function registerBaseRouter() {
  router.get('/base/get', function(req, res) {
    res.json(req.query)
  })
  router.post('/base/post', function(req, res) {
    res.json(req.body)
  })
  router.post('/base/buffer', function(req, res) {
    let msg = []
    req.on('data', (chunk) => {
      if (chunk) {
        msg.push(chunk)
      }
    })
    req.on('end', () => {
      let buf = Buffer.concat(msg)
      res.json(buf.toJSON())
    })
  })
}

