'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: '"https://dev-deveops.8531.cn/"',
  API_WEBSOCKET: "'wss://dev-deveops.8531.cn/'",
  API_TIMEOUT: '"90000"'
})
