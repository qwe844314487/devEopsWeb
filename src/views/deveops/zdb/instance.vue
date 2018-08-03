<template>
  <div class="manager-host-container">
    <div class="filter-container">
      <el-row style="margin-bottom:20px;">
          <el-select v-model="search_obj.group" placeholder="请选择" @change="changeGroup" filterable clearable style="width: 400px;">
            <el-option
              v-for="item in instancegroups"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-switch
            v-model="detailSearch"
            inactive-text="详细检索">
          </el-switch>
          <el-button class="filter-item" @click="resetSearch()" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" :disabled="btnStatus">清除</el-button>
          <el-button class="filter-item" @click="handleExpired()" style="margin-left: 10px;" type="primary" icon="el-icon-time" :disabled="btnStatus">过期资源</el-button>
          <el-button class="filter-item" @click="handleType()" style="float:right;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>
      </el-row>
      <el-row v-show="detailSearch" style="margin-bottom:20px;">
          <el-button class="filter-item" type="primary" icon="el-icon-search" style="float:right;" @click="searchDBInstance" :disabled="btnStatus">搜索</el-button>
      </el-row>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      ref="multipleTable"
      style="width: 100%"
      tooltip-effect="dark">

      <el-table-column width="260px" align="center" label="UUID">
        <template slot-scope="db">
          <span>{{ db.row.uuid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="实例名称">
        <template slot-scope="db">
          <span>{{ db.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="实例组">
        <template slot-scope="role">
          <span>{{ role.row.groupname }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="状态" class-name="status-col" >
        <template slot-scope="db">
          <el-tag :type="db.row._status | statusFilter">{{ getOptionState(db.row._status) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="类型" class-name="status-col" >
        <template slot-scope="db">
          <el-tag>{{ getOptionType(db.row.type) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="连接地址">
        <template slot-scope="db">
          <span>{{ db.row.connect_ip }}</span>
        </template>
      </el-table-column>

      <el-table-column width="145px" align="center" label="端口">
        <template slot-scope="db">
          <span>{{ db.row.port }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="450px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="db">
          <el-button type="warning" size="medium" @click="handleUpdate(db.row)">编辑</el-button>
          <el-button type="danger" size="medium" @click="handleDelete(db.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper">
      </el-pagination>
    </div>

    <el-dialog title="入库类型" :visible.sync="dialogDBChoiceType" width="20%" top="30vh">
      <el-row>
        <el-col :offset="2" :span="11">
          <el-button type="primary" round @click="handleImport">实例入库</el-button>
        </el-col>
        <el-col :span="11">
          <el-button type="primary" round @click="dialogDBCreate=true">新建实例</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDBImport" width="40%" top="20vh">
      <el-form ref="dataForm" :model="commit_obj" label-position="left" label-width="100px">
        <el-form-item label="实例名称" prop="name" size="medium">
          <el-tooltip content="请输入该实例的名称" placement="bottom" effect="light">
            <el-select v-model="formselect" @change="reset_commit" placeholder="请选择" clearable>
              <el-option
                key="aliyun"
                label="阿里云"
                value="aliyun"
              ></el-option>
              <el-option
                key="vmware"
                label="私有云"
                value="vmware"
              ></el-option>
              </el-select>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="实例名称" prop="name" size="medium">
          <el-tooltip content="请输入该实例的名称" placement="bottom" effect="light">
            <el-input v-model="commit_obj.name"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="所属实例组" prop="group" size="medium">
          <el-select v-model="commit_obj.group" placeholder="请选择" filterable>
            <el-option
              v-for="item in instancegroups"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <div v-show="formselect==='aliyun'">
          <el-form-item label="RDS-ID" prop="aliyun_id" size="medium">
            <el-tooltip content="请输入RDS实例ID" placement="bottom" effect="light">
              <el-input v-model="commit_obj.aliyun_id"></el-input>
            </el-tooltip>
          </el-form-item>

          <el-form-item label="连接地址" prop="connect_ip" size="medium">
            <el-tooltip content="请输入RDS连接地址" placement="bottom" effect="light">
              <el-input v-model="commit_obj.connect_ip"></el-input>
            </el-tooltip>
          </el-form-item>
        </div>

        <div v-show="formselect==='vmware'">
          <el-form-item label="所属应用组" prop="group" size="medium">
            <el-select v-model="temp_group" placeholder="请选择" @change="init_hosts" filterable>
              <el-option
                v-for="item in groups"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item label="部署主机" prop="host" size="medium">z`
            <el-select v-model="commit_obj.host" placeholder="请选择" filterable>
              <el-option
                v-for="item in hosts"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> -->

        <el-form-item label="部署主机" prop="host" size="medium">
          <el-select v-model="commit_obj.host" placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in hosts"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

          <el-form-item label="实例端口" prop="port" size="medium">
            <el-tooltip content="请输入该实例连接端口" placement="bottom" effect="light">
              <el-input v-model="commit_obj.port"></el-input>
            </el-tooltip>
          </el-form-item>
        </div>

        <el-form-item label="超管账户" prop="admin_user" size="medium">
          <el-tooltip content="请输入超管账户" placement="bottom" effect="light">
            <el-input v-model="commit_obj.admin_user"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="超管密码" prop="passwd" size="medium">
          <el-tooltip content="请输入超管账户密码" placement="bottom" effect="light">
            <el-input type="password" v-model="commit_obj.passwd"></el-input>
          </el-tooltip>
        </el-form-item>
    </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDBImport = false" :disabled="btnStatus">取消</el-button>
        <el-button @click="importInstance" type="primary" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { fetch_DBInstanceGroupList,fetch_DBInstanceListByPage,create_DBInstance,import_DBInstance,update_DBInstance,delete_DBInstance } from '@/api/zdb';
  import { fetch_GroupList,fetch_HostList } from '@/api/manager';
  export default {
      data(){
        return{
          list: null,
          listLoading: true,
          btnStatus: false,
          dialogDBChoiceType: false,
          dialogDBImport: false,
          dialogDBCreate: false,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
          pagination: {
            page: 1,
            count: 0
          },
          temp_group: null,
          textMap:{
            import: '入库数据库实例',
            update: '编辑数据库实例',
            create: '新建数据库实例',
          },
          dialogStatus:'',
          instancegroups: [],
          groups: [],
          hosts:[],
          formselect: null,
          detailSearch: false,
          commit_obj: {},
          search_obj: {}
        }
      },
      created(){
        this.init()
      },
      filters:{
        statusFilter(_status) {
          const statusMap = {
            '-1': 'danger',
            '1': 'success'
          }
          return statusMap[_status]
        }
      },
      methods:{
        init(){
          this.reset_search()
          this.init_instance()
          this.init_ingroup()
        },
        init_instance(){
          fetch_DBInstanceListByPage(this.pagination,this.search_obj).then((response)=>{
            this.pagination.count = response.data.count
            this.list=response.data.results
            this.listLoading = false
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
        reset_search(){
          this.search_obj = {}
        },
        reset_commit(){
          this.commit_obj = {}
        },
        resetCommit(value){
          console.log('ddr')
          this.reset_commit()
        },
        resetSearch(){
          this.init()
        },
        getOptionState(status){
            let option = {
              '-1': '不可达',
              '1': '正常'
            }
            return option[status]
        },
        getOptionType(status){
            let option = {
              '1': '主节点',
              '2': '从节点',
              '3': 'MGR'
            }
            return option[status]
        },
        changeGroup(){
          this.pagination = {
            page: 1,
            count: 0
          }
          this.init_instance()
        },
        searchDBInstance(){
          this.init_instance()
        },
        handleType(){
          this.reset_commit()
          this.dialogDBChoiceType = true
        },
        handleImport(){
          this.dialogDBImport = true
          this.dialogStatus = 'import'
          this.init_group()
          this.hosts = []
        },
        handleCreate(){
          this.dialogDBCreate = true
        },
        handleUpdate(row){
          this.commit_obj = Object.assign({}, row) // copy obj
          this.init_hosts(this.commit_obj.group)
          this.dialogStatus = 'update'
          this.dialogDBVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        },
        handleDelete(row){
          this.commit_obj = Object.assign({},row)
          this.btnStatus=true
          this.deleteConfirm()
          this.btnStatus=false
        },
        deleteConfirm() {
          this.$confirm('此操作将删除实例, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            delete_DBInstance(this.commit_obj).then((response) => {
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              })
              this.init()
            })
          })
        },
        handleManager(){
          this.commit_obj = Object.assign({}, row) // copy obj
          this.dialogStatus = 'update'
          this.dialogDBDetailVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        },
        handleExpired(){
            this.$router.push({path:'/db/expired'})
        },
        createInstance(){
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.btnStatus=true
              create_DBInstance(this.commit_obj).then(() => {
                this.init()
                this.dialogDBVisible = false
                this.$message({
                  showClose: true,
                  message: '创建成功',
                  type: 'success'
                })
                this.btnStatus=false
              }).catch((error)=>{
                this.btnStatus=false
                this.dialogDBVisible = false
              })
            }
          })
        },
        importInstance(){
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.btnStatus=true
              import_DBInstance(this.commit_obj).then(() => {
                this.init()
                this.dialogDBChoiceType = false
                this.dialogDBImport = false
                this.$message({
                  showClose: true,
                  message: '创建成功',
                  type: 'success'
                })
                this.btnStatus=false
              }).catch((error)=>{
                this.btnStatus=false
                this.dialogDBChoiceType = false
                this.dialogDBImport = false
              })
            }
          })
        },
        updateInstance(){
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.btnStatus=true
              update_DBInstance(this.commit_obj).then(() => {
                this.init()
                this.dialogDBVisible = false
                this.$message({
                  showClose: true,
                  message: '更新成功',
                  type: 'success'
                })
                this.btnStatus=false
              }).catch((error)=>{
                this.btnStatus=false
                this.dialogDBVisible = false
              })
            }
          })
        },
        handleCurrentChange(val) {
          this.pagination.page = val
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
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
