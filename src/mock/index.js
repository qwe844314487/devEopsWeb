const Mock = require('mockjs')
const Random = Mock.Random
import loginAPI from './login'

Mock.mock('/api-auth/login/', 'post', loginAPI.login)
Mock.mock('/api-auth/userinfo/', 'get', loginAPI.userinfo)
export default Mock