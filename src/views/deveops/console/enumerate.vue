<template>
  <div class="manager-host-container">
    <el-row>
      <el-col :span="12">
        <div ref="yoshell"></div>
      </el-col>
    </el-row>
    
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogGroupVisible" width="25%" top="20vh" :before-close="handleClose">
      <el-form ref="groupForm" :model="commit_obj" label-position="left" label-width="100px">
        <el-form-item label="操作应用组" prop="group">
          <el-select v-model="commit_obj.group" placeholder="应用组">
            <el-option v-for="option in groups" :key="option.id" :label="option.name" :value="option.id"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createTruck" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { fetch_GroupOpsList } from '@/api/manager'
  import { create_Truck } from '@/api/console'
  import { Terminal } from 'xterm'
  import * as attach from 'xterm/lib/addons/attach/attach';
  import * as fit from 'xterm/lib/addons/fit/fit'
  export default {
      data(){
        return{
          dialogGroupVisible: false,
          dialogStatus: '',
          btnStatus: false,
          groups: [],
          hosts: [],
          textMap: {
            create: '选择应用组',
          },
          commit_obj: {
          }
        }
      },
      created(){
        this.init_groups()
      },
      mounted(){
        // Terminal.applyAddon(fit);
        // this.term = new Terminal({
        //   rows: 30,
        //   cols: 30,
        //   screenKeys: true,
        //   useStyle: true,
        //   cursorBlink: true
        // })
        // this.term.open(this.$refs.yoshell,false)
        // this.socket = new WebSocket(this.API_WEBSOCKET)
        // this.socket
        // this.term.attach(this.socket)
        // this.term.focus()
      },
      methods:{
        init_hosts(group_id){
          fetch_HostList({'groups':group_id}).then((response)=>{
            this.hosts = []
            for (const host of response.data){
              this.hosts.push({
                key: host.id,
                label: host.hostname,
                disabled: false
              })
            }
          })
        },
        init_groups(){
          this.dialogStatus = 'create'
          fetch_GroupOpsList().then((response)=>{
            this.groups = []
            for (const group of response.data){
              this.groups.push({
                value: group.id,
                key: group.id,
                label: group.name,
                disabled: false
              })
            }
            this.dialogGroupVisible = true
          }).catch((error)=>{
            console.log(error)
          })
        },
        reset_commit(){
          this.commit_obj = {}
        },        
        handleClose(done) {
          this.$confirm('您必须选择操作应用组')
        },
        createTruck(){
          create_Truck(this.commit_obj).then((response)=>{
            this.init_hosts(this.commit_obj.group)
          })
        }
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
