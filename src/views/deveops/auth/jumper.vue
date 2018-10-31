<template>
  <div class="manager-jumper-container">
    <div class="filter-container">
      <el-row style="margin-bottom:20px;">
        <el-switch
        v-model="detailSearch"
        inactive-text="详细检索">
        </el-switch>
        <el-button class="filter-item" @click="resetSearch()" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" :disabled="btnStatus">清除</el-button>
        <el-button class="filter-item" @click="handleCreate()" style="float:right;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>
      </el-row>
      <el-row style="margin-bottom:20px;" v-show="detailSearch">
        <el-col :span="7" :offset="1">
          跳板机名称： <el-input size="medium" style="width: 200px;" v-model="search_obj.info" class="filter-item" placeholder="模糊查找跳板机"></el-input>
        </el-col>
        <el-col :span="7" :offset="1">
          应用组名称： <el-input size="medium" style="width: 200px;" v-model="search_obj.group_name" class="filter-item" placeholder="模糊查找应用组下跳板机"></el-input>
        </el-col>
        <el-button class="filter-item" type="primary" @click="searchJumper" icon="el-icon-search" :disabled="btnStatus" style="float:right;">搜索</el-button>
      </el-row>
    </div>

    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">

      <el-table-column width="260px" align="center" label="UUID">
        <template slot-scope="jumper">
          <span>{{ jumper.row.uuid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="170px" align="center" label="连接地址">
        <template slot-scope="jumper">
          <span>{{ jumper.row.connect_ip }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="连接端口">
        <template slot-scope="jumper">
          <span>{{ jumper.row.sshport }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="状态" class-name="status-col" >
        <template slot-scope="jumper">
          <el-tag :type="jumper.row.status | statusFilter">{{ optionStateObj[jumper.row.status] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="名称">
        <template slot-scope="jumper">
          <span>{{ jumper.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="信息">
        <template slot-scope="jumper">
          <span>{{ jumper.row.info }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="jumper">
          <el-button type="primary" size="medium" @click="handleStatus(jumper.row)" :disabled="btnStatus">刷新</el-button>
          <el-button type="warning" size="medium" @click="handleUpdate(jumper.row)" :disabled="btnStatus">编辑</el-button>
          <el-button type="danger"  size="medium" @click="handleDelete(jumper.row)" :disabled="btnStatus">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :total="pagination.count">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogJumperVisible" width="48%" top="20vh">
      <el-form :rules="rules" ref="jumperForm" :model="commit_obj" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>

        <el-form-item label="ID" prop="id">
          <el-input v-model="commit_obj.id" disabled></el-input>
        </el-form-item>

        <el-form-item label="连接地址" prop="connect_ip">
          <el-input v-model="commit_obj.connect_ip"></el-input>
        </el-form-item>

        <el-form-item label="连接端口" prop="sshport">
          <el-input v-model="commit_obj.sshport"></el-input>
        </el-form-item>

        <el-form-item label="名称" prop="name">
          <el-input v-model="commit_obj.name"></el-input>
        </el-form-item>

        <el-form-item label="信息" prop="info">
          <el-input type="textarea" v-model="commit_obj.info"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogJumperVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button type="primary" @click="handleQRCode" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="QRCode二次验证" :visible.sync="dialogQRCodeVisible" width="30%" top="20vh">
      <span>请确认您的权限是运维工程师并且已经拥有QR-Code</span>
      <el-input v-model="commit_obj.qrcode" placeholder="请输入您当前账户的QR-Code"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :disabled="btnStatus">创建</el-button>
        <el-button v-else-if="dialogStatus=='update'" type="primary" @click="updateData" :disabled="btnStatus">更新</el-button>
        <el-button v-else-if="dialogStatus=='delete'" type="primary" @click="deleteData" :disabled="btnStatus">删除</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { fetch_JumperListByPage,create_Jumper,update_Jumper,delete_Jumper,status_Jumper,is_expire_User } from '@/api/auth'
  export default {
    data(){
      return {
        list: null,
        listLoading: true,
        btnStatus:false,
        dialogJumperVisible: false,
        dialogQRCodeVisible: false,
        detailSearch: false,
        dialogStatus:'',
        commit_obj: {},
        search_obj: {},
        pagination: {
          page: 1,
          count: 0
        },
        optionState: [
          {
            value: 0,
            label: '不可达'
          }, {
            value: 1,
            label: '正常'
          }
        ],
        optionStateObj:{
            '-3': '错误密钥',
            '-2': '无对应密钥',
            '-1': '不可达',
            '1': '可达'
        },
        textMap:{
          update: '编辑跳板机',
          create: '新建跳板机',
          delete: '删除跳板机'
        },
        rules: {
          connect_ip: [
            { required: true, message: '连接IP是您操作跳板机的重要信息', trigger: 'blur' },
            { pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/, message: '您输入的IP地址有误',trigger:'blur'}
          ],
          sshport: [{ required: true, message: '连接端口是您管理主机的重要信息', trigger: 'blur' }],
          name: [{ required: true, message: '跳板机名称是必须的', trigger: 'blur' }]
        }
      }
    },
    created(){
      this.init()
    },
    filters:{
      statusFilter(status) {
        const statusMap = {
          '-3': 'danger',
          '-2': 'danger',
          '-1': 'danger',
          '1': 'success'
        }
        return statusMap[status]
      }
    },
    methods: {
      init(){
        this.listLoading = true
        fetch_JumperListByPage(this.pagination,this.search_obj).then(response =>{
          this.pagination.count = response.data.count
          this.list = response.data.results
          this.listLoading = false
        })
      },
      reset_commit(){
        this.commit_obj = {}
      },
      reset_search(){
        this.search_obj = {}
      },
      reset_dialog() {
        this.dialogJumperVisible = false
        this.dialogQRCodeVisible = false
      },
      resetSearch(){
        this.reset_search()
        this.init()
      },
      searchJumper(){
        this.init()
      },
      handleQRCode() {
        is_expire_User()
          .then(response => {
            if (response.data.isexpire) {
              this.reset_dialog()
              this.dialogQRCodeVisible = true
            } else {
              if (this.dialogStatus === "create") {
                this.createData()
              } else if (this.dialogStatus === "update") {
                this.updateData()
              } else if (this.dialogStatus === "status"){
                this.statusData()
              } else if (this.dialogStatus === "delete"){
                this.deleteData()
              }
            }
          }).catch((error) => {
            console.log(error)
            this.$message({
              showClose: true,
              message: "过期时间确定失败",
              type: "danger"
            })
          })
      },
      handleStatus(row){
        this.commit_obj = Object.assign({}, row) // copy obj
        this.dialogStatus = 'status'
        this.handleQRCode()
      },
      statusData(){
        status_Jumper(this.commit_obj).then(()=>{
          this.$message({
            showClose: true,
            message: '刷新任务推出',
            type: 'success'
          })
          this.init()
        }).catch((error)=>{
          this.$message({
            showClose: true,
            message: '刷新失败',
            type: 'success'
          })
        })
      },
      handleCreate(row){
        this.reset_commit()
        this.dialogStatus = 'create'
        this.dialogJumperVisible = true
        this.$nextTick(() => {
          this.$refs['jumperForm'].clearValidate()
        })
      },
      handleCurrentChange(val) {
        this.pagination.page = val
        this.init()
      },
      handleUpdate(row){
        this.commit_obj = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogJumperVisible = true
        this.$nextTick(() => {
          this.$refs['jumperForm'].clearValidate()
        })
      },
      createData(){
        this.$refs['jumperForm'].validate((valid) => {
          if (valid) {
            this.btnStatus=true
            create_Jumper(this.commit_obj).then(() => {
              this.init()
              this.reset_dialog()
              this.$message({
                showClose: true,
                message: '创建成功',
                type: 'success'
              })
              this.btnStatus=false
            }).catch((error)=>{
              this.btnStatus=false
              this.reset_dialog()
              console.log(error)
            })
          }
        })
      },
      updateData(){
        this.$refs['jumperForm'].validate((valid) => {
          if (valid) {
            this.btnStatus=true
            update_Jumper(this.commit_obj).then(() => {
              this.init()
              this.reset_dialog()
              this.$message({
                showClose: true,
                message: '更新成功',
                type: 'success'
              })
              this.btnStatus=false
            }).catch((error)=>{
              this.btnStatus=false
              this.reset_dialog()
              console.log(error)
            })
          }
        })
      },
      handleDelete(row){
        this.commit_obj = Object.assign({},row)
        this.dialogStatus = 'delete'
        this.handleQRCode()
      },
      deleteData(){
        this.btnStatus = true
        this.deleteConfirm()
        this.btnStatus = false
      },
      deleteConfirm() {
        this.$confirm('此操作将删除跳板机, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          delete_Jumper(this.commit_obj).then((response) => {
            this.reset_dialog()
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            this.init()
          }).catch((error)=>{
              this.btnStatus=false
              this.reset_dialog()
              console.log(error)
          })
        })
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .manager-jumper-container {
    padding: 32px;
    /*background-color: rgb(240, 242, 245);*/
  }
</style>
