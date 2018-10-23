<template>
  <div class="manager-host-container">
    <div class="filter-container">
      <el-row style="margin-bottom:20px;">
        <el-switch
          v-model="detailSearch"
          inactive-text="详细检索">
        </el-switch>
        <el-button class="filter-item" @click="resetSearch()" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" :disabled="btnStatus">清除</el-button>
        <el-button class="filter-item" @click="handleCreate()" style="float:right;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>
      </el-row>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      ref="multipleTable"
      style="width: 100%"
      tooltip-effect="dark">
      <el-table-column width="260px" align="center" label="UUID">
        <template slot-scope="setup">
          <span>{{ setup.row.uuid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="操作时间">
        <template slot-scope="setup">
          <span>{{ setup.row.create_time | timeFilter }}</span>
        </template>
      </el-table-column>

    <el-table-column width="200px" align="center" label="应用类型">
        <template slot-scope="setup">
          <el-tag>{{ typeStateObj[setup.row.type] }}</el-tag>
        </template>
    </el-table-column>

    <el-table-column width="200px" align="center" label="状态">
        <template slot-scope="setup">
          <el-tag :type="setup.row.status | statusFilter">{{ optionStateObj[setup.row.status]}} </el-tag>
        </template>
    </el-table-column>

    </el-table>
    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :total="pagination.count">
      </el-pagination>
    </div>
  
    <el-dialog title="安装类型" :visible.sync="dialogChoiceVisible" width="20%" top="30vh">
      <el-row>
        <el-col :offset="2" :span="11">
          <el-button type="primary" round @click="handleRedis">Redis</el-button>
        </el-col>
        <el-col :span="11">
          <el-button type="primary" round @click="handleMySQL">MySQL</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogRedisVisible" width="53%" top="8vh">
      <el-form ref="redisForm" :model="commit_obj" label-position="left" label-width="100px">

        <el-form-item label="所属应用组" prop="detail.group" size="medium">
          <el-select v-model="commit_obj.group" placeholder="请选择" @change="init_hosts" filterable>
            <el-option
              v-for="item in groups"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="部署主机" prop="hosts">
          <el-transfer v-model="commit_obj.hosts" :data="hosts" placeholder="请选择部署主机" filterable>
          </el-transfer>
        </el-form-item>

      <el-row>
        <el-col :span="10">
          <el-form-item label="部署端口" prop="detail.redis_port" size="medium">
            <el-tooltip content="请输入部署端口" placement="bottom" effect="light">
              <el-input v-model="commit_obj.detail.redis_port"></el-input>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :offset="1" :span="10">
          <el-form-item label="实例密码" prop="detail.redis_passwd" size="medium">
            <el-tooltip content="请输入实例密码" placement="bottom" effect="light">
              <el-input type="password" v-model="commit_obj.detail.redis_passwd"></el-input>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="部署版本" prop="detail.version" size="medium">
            <el-tooltip content="请输入部署的版本" placement="bottom" effect="light">
              <el-select v-model="commit_obj.detail.version" placeholder="请选择" clearable>
                <el-option
                  key="4.0.1"
                  label="4.0.1"
                  value="4.0.1"
                ></el-option>
                </el-select>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRedisVisible = false;dialogChoiceVisible=false;" :disabled="btnStatus">取消</el-button>
        <el-button @click="createRedis" type="primary" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogMySQLVisible" width="43%" top="5vh">
      <el-form ref="mysqlForm" :model="commit_obj" label-position="left" label-width="100px">

        <el-form-item label="实例名称" prop="name" size="medium">
          <el-tooltip content="请输入该实例的名称" placement="bottom" effect="light">
            <el-input v-model="commit_obj.name"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="所属实例组" prop="detail.ingroup" size="medium">
          <el-select v-model="commit_obj.detail.ingroup" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in instancegroups"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属应用组" prop="detail.group" size="medium">
          <el-select v-model="commit_obj.group" placeholder="请选择" @change="init_hosts" filterable>
            <el-option
              v-for="item in groups"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="部署主机" prop="hosts">
          <el-transfer v-model="commit_obj.hosts" :data="hosts" placeholder="请选择部署主机" filterable>
          </el-transfer>
        </el-form-item>

      <el-row>
        <el-col :span="10">
          <el-form-item label="实例内存" prop="detail.memory" size="medium">
            <el-tooltip content="请输入该实例内存" placement="bottom" effect="light">
              <el-input v-model="commit_obj.detail.memory"></el-input>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :offset="1" :span="10">
          <el-form-item label="部署端口" prop="detail.port" size="medium">
            <el-tooltip content="请输入部署端口" placement="bottom" effect="light">
              <el-input v-model="commit_obj.detail.port"></el-input>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="部署版本" prop="detail.version" size="medium">
            <el-tooltip content="请输入部署的版本" placement="bottom" effect="light">
              <el-select v-model="commit_obj.detail.version" placeholder="请选择" clearable>
                <el-option
                  key="5.6"
                  label="5.6"
                  value="5.6"
                ></el-option>
                <el-option
                  key="5.7"
                  label="5.7"
                  value="5.7"
                ></el-option>
                </el-select>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :offset="1" :span="11">
        </el-col>
      </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRedisVisible = false;dialogChoiceVisible=false;" :disabled="btnStatus">取消</el-button>
        <el-button @click="createRedis" type="primary" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>



  </div>
</template>

<script>
  import { fetch_EZSetupList,create_EZSetupRedis,create_EZSetupMySQL } from '@/api/ezsetup';
  import { fetch_DBInstanceGroupList } from '@/api/zdb';
  import { fetch_GroupList,fetch_HostList } from '@/api/manager';
  export default {
      data(){
        return{
          list: null,
          listLoading: true,
          btnStatus: false,
          dialogChoiceVisible: false,
          dialogRedisVisible: false,
          dialogMySQLVisible: false,
          pagination: {
            page: 1,
            count: 0
          },
          typeStateObj:{
            '1': 'Redis',
            '2': 'MySQL',
          },
          textMap:{
            update: '编辑DNS',
            create: '新建DNS',
            redis: '新建redis实例',
            mysql: '新建mysql实例',
          },
          groups: [],
          hosts: [],
          instancegroups: [],
          dialogStatus:'',
          search_obj:{
          },
          commit_obj: {
            detail:{}
          },
          detailSearch: null,
          optionStateObj:{
            '1': '执行中',
            '2': '执行完毕',
            '-1': '执行错误',
            '-2': '缺少密钥或跳板机',
            '-3': '密钥或跳板机不可达'
          },
          rules: {
            name:[{ required: true, message: '分域名名称是必须的', trigger: 'blur' }]
          }
        }
      },
      filters: {
        timeFilter(timeformat){
          if(timeformat){
            const date = timeformat.split('T')
            const time = date[1].split('.')
            return date[0]+' '+time[0]
          }else{
            return ''
          }
        },
        statusFilter(status) {
          if(status<0){
            return 'danger'
          }else if(status == 1){
            return 'primary'
          }else{
            return 'success'
          }
          const statusMap = {
            '-2': 'danger',
            '1': 'success',
            '-1': 'warning'
          }
          return statusMap[_status]
        },
      },
      created(){
        this.init()
      },
      methods:{
        init_group(){
          fetch_GroupList().then((response)=>{
            this.groups = []
            for (const group of response.data){
              this.groups.push({
                value: group.id,
                key: group.id,
                label: group.name,
                disabled: false
              })
            }
          })
        },
        init_hosts(value){
          this.hosts = []
          fetch_HostList({'groups':value}).then(response=>{
              this.hosts = []
              for (const host of response.data){
                this.hosts.push({
                  value: host.id,
                  key: host.id,
                  label: host.hostname,
                  disabled: false
                })
              }
            })
        },
        init_ingroup(){
          fetch_DBInstanceGroupList().then((response)=>{
            this.instancegroups = []
            for (const ingroup of response.data){
              this.instancegroups.push({
                value: ingroup.id,
                key: ingroup.id,
                label: ingroup.name,
                disabled: false
              })
            }
          })
        },
        reset_search(){
          this.search_obj = {}
        },
        reset_commit(){
          this.commit_obj = {detail:{}}
        },
        init(){
          fetch_EZSetupList(this.pagination,this.search_obj).then((response)=>{
            this.pagination.count = response.data.count
            this.list=response.data.results
            this.listLoading = false
          })
          this.listLoading = false
        },
        handleCurrentChange(val) {
          this.pagination.page = val
          this.init()
        },
        resetSearch(){
          this.reset_search()
          this.init()
        },
        handleCreate(){
          this.reset_search()
          this.reset_commit()
          this.dialogStatus = "choice"
          this.dialogChoiceVisible = true
        },
        handleRedis(){
          this.dialogRedisVisible = true
          this.dialogStatus = "redis"
          this.init_group()
        },
        handleMySQL(){
          this.dialogMySQLVisible = true
          this.dialogStatus = "mysql"
          this.init_group()
          this.init_ingroup()
        },
        createRedis(){
          this.$refs['redisForm'].validate((valid) => {
            if (valid) {
              this.btnStatus=true
              this.commit_obj.type = 1
              create_EZSetupRedis(this.commit_obj).then(() => {
                this.reset_search()
                this.init()
                this.dialogRedisVisible = false
                this.dialogChoiceVisible = false
                this.$message({
                  showClose: true,
                  message: '进行装机进程',
                  type: 'success'
                })
                this.btnStatus=false
              }).catch((error)=>{
                this.btnStatus=false
                this.dialogRedisVisible = false
                this.dialogChoiceVisible = false
              })
            }
          })
        },
        createMySQL(){
          this.$refs['mysqlForm'].validate((valid) => {
            if (valid) {
              this.btnStatus=true
              this.commit_obj.type = 2
              create_EZSetupMySQL(this.commit_obj).then(() => {
                this.reset_search()
                this.init()
                this.dialogMySQLVisible = false
                this.dialogChoiceVisible = false
                this.$message({
                  showClose: true,
                  message: '进行装机进程',
                  type: 'success'
                })
                this.btnStatus=false
              }).catch((error)=>{
                this.btnStatus=false
                this.dialogMySQLVisible = false
                this.dialogChoiceVisible = false
              })
            }
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
