<template>
  <div>
    <el-progress :text-inside="true" :stroke-width="18" :percentage="centage" :status="status"></el-progress>
  </div>
</template>

<script>
  export default {
    name: 'YoProgress',
    props: {
      work_uuid:{
        type: String,
        default: 0
      }
    },
    data() {
      return {
        ws: null,
        centage: 0,
        status: ''
      }
    },
    created(){
      this.initWebSocket()
    },
    destroyed(){
      this.websocketclose()
      console.log('destory')
    },
    methods:{
      initWebSocket(){ //初始化weosocket 
        this.websock = new WebSocket(this.API_WEBSOCKET+'ansible/'+this.work_uuid+'/')
        // ,this.$store.getters.token)
        this.websock.onmessage = this.websocketonmessage
        this.websock.onclose = this.websocketclose
      },
      websocketonmessage(e){
        console.log(e)
        if(this.centage+7<100&&e.data=='OK'){
          this.centage = this.centage+11
        }else if(this.centage+7>100&&e.data=='OK'){
          this.centage = this.centage
        }else if(e.data=='SUCCESS'){
          this.centage = 100
          this.status = 'success'
          this.websock.close()
        }else{
          this.websock.close()
          this.status = 'exception'
        }
      },
      websocketclose(e){ 
        this.centage = 100
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
