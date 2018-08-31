<template>
  <div class="manager-host-container">
    <div class="filter-container">
      <el-row style="margin-bottom:20px;">
          <el-col :span="7">
            实例组名称： <el-input style="width: 200px;" v-model="search_obj.name" class="filter-item" placeholder="根据实例组名称模糊搜索"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchDBInstanceGroup" :disabled="btnStatus">搜索</el-button>
            <el-button class="filter-item" @click="resetSearch()" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" :disabled="btnStatus">清除</el-button>
          </el-col>
          <el-button class="filter-item"  style="float:right;" type="primary" icon="el-icon-edit" @click="handleCreate" :disabled="btnStatus">新增</el-button>
      </el-row>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      ref="multipleTable"
      style="width: 100%"
      tooltip-effect="dark">

      <el-table-column width="260px" align="center" label="UUID">
        <template slot-scope="dbgroup">
          <span>{{ dbgroup.row.uuid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="实例名称">
        <template slot-scope="dbgroup">
          <span>{{ dbgroup.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="应用组">
        <template slot-scope="dbgroup">
          <span>{{ dbgroup.row.groupname }}</span>
        </template>
      </el-table-column>

        <el-table-column width="150px" align="center" label="实例数" class-name="status-col" >
        <template slot-scope="dbgroup">
          <el-tag type="success">{{ dbgroup.row.instancecount }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="业务库数" class-name="status-col" >
        <template slot-scope="dbgroup">
          <el-tag type="success">{{ dbgroup.row.databasecount }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="状态" class-name="status-col" >
        <template slot-scope="dbgroup">
          <el-tag :type="dbgroup.row._status | statusFilter">{{ getOptionState(dbgroup.row._status) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="450px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="dbgroup">
          <el-button type="warning" size="medium" @click="handleUpdate(dbgroup.row)">编辑</el-button>
          <el-button type="danger" size="medium" @click="handleDelete(dbgroup.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDBGroupInstance" width="35%" top="20vh">
      <el-form ref="dataForm" :model="commit_obj" label-position="left" label-width="100px">

        <el-form-item label="实例组名称" prop="name" size="medium">
          <el-tooltip content="请输入该实例组的名称" placement="bottom" effect="light">
            <el-input v-model="commit_obj.name" style="width: 400px;"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="所属应用组" prop="group" size="medium">
          <el-select v-model="commit_obj.group" placeholder="请选择" filterable>
            <el-option
              v-for="item in groups"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDBGroupInstance = false" :disabled="btnStatus">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createInstanceGroup" :disabled="btnStatus">提交</el-button>
        <el-button v-else type="primary" @click="updateInstanceGroup" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { fetch_DBInstanceGroupListByPage,create_DBInstanceGroup,update_DBInstanceGroup,delete_DBInstanceGroup } from '@/api/zdb';
  import { fetch_GroupList } from '@/api/manager';
  export default {
      data(){
        return{
          list: null,
          listLoading: true,
          btnStatus: false,
          dialogDBGroupInstance: false,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
          pagination: {
            page: 1,
            count: 0
          },
          textMap:{
            update: '编辑实例组',
            create: '新建实例组',
          },
          dialogStatus:'',
          groups: [],
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
            '1': 'success',
          }
          return statusMap[_status]
        },
      },
      methods:{
        init(){
          this.reset_search()
          this.init_instance_group()
        },
        init_instance_group(){
          fetch_DBInstanceGroupListByPage(this.pagination,this.search_obj).then((response)=>{
            this.pagination.count = response.data.count
            this.list=response.data.results
            this.listLoading = false
          })
        },
        init_group(obj){
          fetch_GroupList(obj).then((response)=>{
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
        searchDBInstanceGroup(){
          this.init_instance_group()
        },
        getOptionState(status){
            let option = {
              '-1': '不可达',
              '1': '正常'
            }
            return option[status]
        },
        reset_search(){
          this.search_obj = {}
        },
        reset_commit(){
          this.commit_obj = {}
        },
        resetSearch(){
          this.init()
        },
        handleCreate(){
          this.dialogStatus = 'create'
          this.init_group({'instance_group':'True'})
          this.reset_commit()
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
          this.dialogDBGroupInstance = true
        },
        createInstanceGroup(){
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.btnStatus=true
              create_DBInstanceGroup(this.commit_obj).then(() => {
                this.init()
                this.dialogDBGroupInstance = false
                this.$message({
                  showClose: true,
                  message: '创建成功',
                  type: 'success'
                })
                this.btnStatus=false
              }).catch((error)=>{
                this.btnStatus=false
                this.dialogDBGroupInstance = false
              })
            }
          })
        },
        handleUpdate(row){
          this.init_group({})
          this.commit_obj = Object.assign({}, row) // copy obj
          this.dialogStatus = 'update'
          this.dialogDBGroupInstance = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        },
        updateInstanceGroup(){
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.btnStatus=true
              update_DBInstanceGroup(this.commit_obj).then(() => {
                this.init()
                this.dialogDBGroupInstance = false
                this.$message({
                  showClose: true,
                  message: '更新成功',
                  type: 'success'
                })
                this.btnStatus=false
              }).catch((error)=>{
                this.btnStatus=false
                this.dialogDBGroupInstance = false
              })
            }
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
            delete_DBInstanceGroup(this.commit_obj).then((response) => {
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              })
              this.init()
            })
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
