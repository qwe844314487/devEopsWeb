<template>
  <div>
    <h1>{{ msg }}</h1>
    <el-button @click="initWebSocket">WEBSOCKET</el-button>
    <el-button @click="websocketstart">START</el-button>
    <el-button @click="websocketsend">SEND</el-button>
  </div>
</template>

<script>
  import { fetch_DNSListByPage,fetch_DNSList,create_DNS,update_DNS,delete_DNS } from "@/api/dns";
  import { fetch_GroupList } from '@/api/manager';
  export default {
      data(){
        return{
          msg: '123',
          websock: null
        }
      },
      created(){
      
      },
      methods:{      
        initWebSocket(){ //初始化weosocket 
          this.websock = new WebSocket(this.API_WEBSOCKET+'ansible/c8174d03-0256-4c95-932d-018f781f296b/')
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
        websocketstart(){
          this.websock.send('START')
        },
        websocketsend(){
          this.websock.send('123123123')
        },
        websocketclose(e){ 
          this.centage = 100
        }
      }
    }
</script>