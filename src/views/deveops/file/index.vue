<template>
  <div class="manager-file-container">
    <div class="filter-container">
      <el-row style="margin-bottom:20px;">
        <!-- <el-switch
        v-model="detailSearch"
        inactive-text="详细检索">
        </el-switch>
        <el-button class="filter-item" @click="resetSearch()" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" :disabled="btnStatus">清除</el-button> -->
        <el-button class="filter-item" @click="handleCreate()" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>
      </el-row>
      <el-row style="margin-bottom:20px;" v-show="detailSearch">
        <el-col :span="7" :offset="1">
          文件名称： <el-input size="medium" style="width: 200px;" v-model="search_obj.name" class="filter-item" placeholder="模糊查找密钥名称"></el-input>
        </el-col>
        <el-button class="filter-item" type="primary" @click="searchFile" icon="el-icon-search" :disabled="btnStatus" style="float:right;">搜索</el-button>
      </el-row>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">

      <el-table-column width="260px" align="center" label="UUID">
        <template slot-scope="file">
          <span>{{ file.row.uuid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="260px" align="center" label="文件名称">
        <template slot-scope="file">
          <span>{{ file.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="360px" align="center" label="关联任务">
        <template slot-scope="file">
          <span>{{ file.row.mission_uuid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="220px" align="center" label="变量名称">
        <template slot-scope="file">
          <el-tag>{{ file.row.var_name }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="260px" align="center" label="上传时间">
        <template slot-scope="file">
          <span>{{ file.row.create_time|filter_time }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="file">
          <el-button type="danger"  size="medium" @click="handleDelete(file.row)" :disabled="btnStatus">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :total="pagination.count">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFileVisible" width="50%" top="15vh">
      <el-form :rules="rules" ref="fileForm" :model="commit_obj" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>

        <el-form-item label="ID" prop="id">
          <el-input v-model="commit_obj.id" disabled></el-input>
        </el-form-item>

        <el-form-item label="文件名称" prop="name">
          <el-input v-model="commit_obj.name"></el-input>
        </el-form-item>
              <!-- :http-request="uploadFile" -->
          <el-form-item label="上传文件" prop="file">
            <el-upload
              action="string"
              :limit="1"
              :http-request="uploadFile"
              class="upload-demo"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFileVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="updateData" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { fetch_FileListByPage,create_File,delete_File,update_File } from '@/api/utils';
  export default {
    data(){
      return {
        list: null,
        listLoading: true,
        loading: null,
        btnStatus:false,
        dialogFileVisible: false,
        dialogStatus:'',
        detailSearch: false,
        fileList: [],
        percentage: 70,
        commit_obj: {
        },
        search_obj: {

        },
        pagination: {
          page: 1,
          count: 0
        },
        textMap:{
          create: '新增分发文件',
        },
        rules: {
            name:[{ required: true, message: '文件的名称是必须的', trigger: 'blur' }],
        }
      }
    },
    created(){
      this.init()
    },
    filters: {
      filter_time(data){
        const ary = data.split('T')
        const bry = ary[1].split('.')
        return ary[0] + ' ' + bry[0]
      }
    },
    methods: {
      init(){
        this.listLoading = true
        fetch_FileListByPage(this.pagination,this.search_obj).then(response =>{
          this.pagination.count = response.data.count
          this.list = response.data.results
          this.listLoading = false
        })
      },
      reset_commit(){
        this.fileList = []
        this.commit_obj = {}
      },
      reset_search(){
        this.search_obj = {}
      },
      searchFile(){
        this.init()
      },
      resetSearch(){
        this.reset_search()
        this.init()
      },
      handleCreate(row){
        this.reset_commit()
        this.dialogStatus = 'create'
        this.dialogFileVisible = true
        this.$nextTick(() => {
          this.$refs['fileForm'].clearValidate()
        })
      },
      handleCurrentChange(val) {
        this.pagination.page = val
        this.init()
      },
      uploadFile(item){
        const formData=new FormData()
        formData.append('file',item.file)
        this.loading = this.$loading({
          lock: true,
          text: '上传文件中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        create_File(formData).then((response)=>{
          this.commit_obj.uuid = response.data.uuid
          this.commit_obj.id = response.data.id
          this.loading.close()
          this.$message({
            showClose: true,
            message: '上传成功',
            type: 'success'
          })
        }).catch((error)=>{
          this.loading.close()
          this.$message({
            showClose: true,
            message: '上传失败',
            type: 'danger'
          })
        })
      },
      updateData(){
        this.$refs['fileForm'].validate((valid) => {
          if (valid) {
            this.btnStatus=true
            update_File(this.commit_obj).then(() => {
              this.init()
              this.dialogFileVisible = false
              this.$message({
                showClose: true,
                message: '创建成功',
                type: 'success'
              })
              this.btnStatus=false
            }).catch((error)=>{
              this.btnStatus=false
              this.dialogFileVisible = false
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
        this.$confirm('此操作将删除分发文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          delete_File(this.commit_obj).then((response) => {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            this.init()
          })
        })
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .manager-file-container {
    padding: 32px;
    /*background-color: rgb(240, 242, 245);*/
  }
</style>
