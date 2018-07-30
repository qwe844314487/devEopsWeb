import { devEopsRouterMap } from '@/router'

const permission = {
  state: {
    routers: []
  },
  mutations: {
    SET_ROUTERS: (state,routers)=>{
      state.routers = routers
    }
  },
  actions: {
    GenerateRouter({commit}){
      return new Promise((resolve) => {
        if(true){
          commit('SET_ROUTERS',devEopsRouterMap)
          resolve()
        }else{
          commit('SET_ROUTERS',[])
          resolve()
        }
      })
    }
  }
}

export default permission
