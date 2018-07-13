'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: '"http://10.100.100.246:8888/"',
  API_WEBSOCKET: "'ws://10.100.100.246:8888/'",
  API_TIMEOUT: '"90000"'
})
