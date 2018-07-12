<template>
  <div>
    <el-progress :text-inside="true" :stroke-width="18" :percentage="centage" :status="status"></el-progress>
  </div>
</template>

<script>
  import GLOBAL from '@/config'
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
        this.websock = new WebSocket(GLOBAL.WEBSOCKET_URL+'ansible/'+this.work_uuid+'/')
        this.websock.onmessage = this.websocketonmessage
        this.websock.onclose = this.websocketclose
      },
      websocketonmessage(e){
        if(this.centage+11<100&&e.data=='OK'){
          this.centage = this.centage+11
        }else if(e.data=='SUCCESS'){
          this.centage = 100
          this.status = 'success'
        }
        else{
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
