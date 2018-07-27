<template>
  <div class="manager-host-container">
      <div ref="yoshell"></div>
  </div>
</template>

<script>
  import { Terminal } from 'xterm'
  import * as fit from 'xterm/lib/addons/fit/fit'
  export default {
      data(){
        return{
        }
      },
      created(){

      },
      mounted(){
        Terminal.applyAddon(attach);
        this.term = new Terminal({
          rows: 400,
          cols: 500,
          screenKeys: true,
          useStyle: true,
          cursorBlink: true
          })
        this.term.open(this.$refs.yoshell,false)
        this.socket = new WebSocket('ws://'+ GLOBAL.API_URL+'/ansible/'+this.work_uuid+'/')
        this.term.attach(this.socket)
        this.term.focus()
      },
      methods:{
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .manager-host-container {
    padding: 32px;
    /*background-color: rgb(240, 242, 245);*/
  }
  .el-tag {
    margin-left: 10px;
    margin-bottom: 5px;
    font-size: 15px;
  }
</style>
