const getters = {
  token: state => state.user.token,
  username: state => state.user.username,
  name: state => state.user.name,
  islogin: state => state.user.islogin,
  routers: state => state.permission.routers,
  dber: state => state.user.dber
}

export default getters
