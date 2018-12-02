<template>
  <div class="manager-mission-container">
    <div class="filter-container">
      <el-row style="margin-bottom:20px;">
        <el-date-picker
          v-model="select_time"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="selectTime">
        </el-date-picker>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchCodeWork" :disabled="btnStatus">搜索</el-button>
        <el-button class="filter-item" @click="resetSearch()" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" :disabled="btnStatus">清除</el-button>
        <el-switch
          v-model="detailSearch"
          inactive-text="详细检索">
        </el-switch>
        <el-button class="filter-item" @click="handleCreate()" style="float:right;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>
      </el-row>
        <el-row v-show="detailSearch" style="margin-bottom:5px;">
        <el-col :span="7" :offset="1">
          工单信息： <el-input size="medium" style="width: 200px;" v-model="search_obj.info" class="filter-item" placeholder="根据工单信息模糊搜索"></el-input>
        </el-col>
        <el-col :span="7">
          用户信息： <el-input size="medium" style="width: 200px;" v-model="search_obj.user" class="filter-item" placeholder="根据用户信息模糊搜索"></el-input>
        </el-col>
      </el-row>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">

      <!-- <el-table-column width="60px" align="center" label="ID">
        <template slot-scope="work">
          <span>{{ work.row.id }}</span>
        </template>
      </el-table-column> -->

      <el-table-column width="180px" align="center" label="UUID">
        <template slot-scope="work">
          <span>{{ work.row.uuid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="270px" align="center" label="关联任务内容">
        <template slot-scope="work">
          <span>{{ work.row.mission_info }}</span>
        </template>
      </el-table-column>

      <el-table-column width="130px" align="center" label="提交用户">
        <template slot-scope="work">
          <span>{{ work.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column width="380px" align="center" label="工单信息">
        <template slot-scope="work">
          <span>{{ work.row.info }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="创建时间">
        <template slot-scope="work">
          <span>{{ work.row.create_time | timeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="完成时间">
        <template slot-scope="work">
          <span>{{ work.row.finish_time | timeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="150px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="work">      
          <el-button size="mini" v-if="work.row.status<0" type="danger" @click="handleResults(work.row)">失败</el-button>    
          <el-button size="mini" v-else-if="work.row.status==1" type="warning" @click="handleCheck(work.row)" :disabled="btnStatus">审核</el-button>
          <el-button size="mini" v-else-if="work.row.status==2" type="warning" @click="handleUpload(work.row)" :disabled="btnStatus">上传</el-button>
          <el-button size="mini" v-else-if="work.row.status==3" type="danger" @click="handleRun(work.row)" :disabled="btnStatus">执行</el-button>
          <el-button size="mini" v-else-if="work.row.status==4" type="warning" disabled>执行中</el-button>
          <el-button size="mini" v-else-if="work.row.status==5" type="primary" disabled>执行完毕</el-button>
          <el-button size="mini" v-else-if="work.row.status==6" type="warning" disabled>加载参数</el-button>
          <el-button size="mini" v-else-if="work.row.status==7" type="warning" disabled>加载任务</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :total="pagination.count">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogWorkVisible" width="40%" top="20vh">
      <el-form ref="workForm" :model="commit_obj" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>
        <el-row :gutter="20">
          <el-col :span="4">
            <p>选择应用组： </p> 
          </el-col>
          <el-col :span="16">
            <el-select v-model="search_obj.group" placeholder="请选择应用组" @change="groupSelect" filterable clearable>
              <el-option v-for="option in optionGroup" :key="option.label" :label="option.label" :value="option.value"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <p>选择任务： </p> 
          </el-col>
          <el-col :span="16">
            <el-select v-model="commit_obj.mission" placeholder="请选择执行的任务" filterable clearable>
              <el-option v-for="option in optionMission" :key="option.label" :label="option.label" :value="option.value"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <p>发版理由：  </p> 
          </el-col>
          <el-col :span="16">
            <el-input placeholder="重大BUG发版" v-model="commit_obj.info" label="123">
            </el-input>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogWorkVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="handleQRCode" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogUploadVisible" width="60%" top="20vh">
      <el-table :data="upload_tb" border fit highlight-current-row
              style="width: 100%">
      <el-table-column width="220px" align="center" label="上传文件名">
        <template slot-scope="file">
          <span>{{ file.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="文件状态">
        <template slot-scope="file">
          <span>{{ file.row.status }}</span>
        </template>
      </el-table-column>

      <el-table-column width="500px" align="center" label="UUID">
        <template slot-scope="file">
          <span>{{ file.row.uuid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="选择文件">
        <template slot-scope="file">
          <el-button size="small" type="primary" @click="hanldSelectFile(file.row)">点击上传</el-button>
        </template>
      </el-table-column>

      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUploadVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button type="primary" @click="handleUploadWork()" :disabled="btnStatus">提交</el-button>
      </div>

      <el-dialog
        width="20%"
        :title="'文件上传'"
        :visible.sync="dialogFileVisible"
        append-to-body>
          <el-select v-model="update_obj.uuid" placeholder="请选择执行的任务" filterable>
            <el-option v-for="option in optionFiles" :key="option.label" :label="option.label" :value="option.value"></el-option>
          </el-select>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="selectFile()" :disabled="btnStatus">提交</el-button>
          <el-button @click="dialogFileVisible = false" :disabled="btnStatus">关闭</el-button>
        </div>
      </el-dialog>

    </el-dialog>

    <el-dialog
      width="70%"
      title="执行任务"
      :visible.sync="dialogXtermVisible"
      :before-close="handleClose">
      <yo-progress :work_uuid="commit_obj.uuid"></yo-progress>
    </el-dialog>

      <el-dialog
      width="70%"
      title="错误信息"
      top="7vh"
      :visible.sync="dialogResultsVisible">
      <textarea v-model="error" style="height: 700px;width: 1200px;resize: none;"></textarea>
    </el-dialog>

    <el-dialog title="QRCode二次验证" :visible.sync="dialogQRCodeVisible" width="30%" top="20vh">
        <span>请确认您的权限并且已经拥有QR-Code</span>
        <el-input v-model="commit_obj.qrcode" placeholder="请输入您当前账户的QR-Code"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button v-if="dialogStatus=='check'" type="primary" @click="checkWork()" :disabled="btnStatus">审核任务</el-button>
          <el-button v-else-if="dialogStatus=='upload'" type="primary" @click="uploadWork()" :disabled="btnStatus">关联文件</el-button>
          <el-button v-else-if="dialogStatus=='run'" type="primary" @click="runWork()" :disabled="btnStatus">运行任务</el-button>
          <el-button v-else-if="dialogStatus=='create'" type="primary" @click="createWork()" :disabled="btnStatus">创建任务</el-button>
        </div>
    </el-dialog>

  </div>
</template>

<script>
    import { fetch_MissionListByUser } from '@/api/ops';
    import { fetch_WorkListByPage,create_Work,check_Work,run_Work,upload_Work,results_Work } from '@/api/work';
    import { fetch_GroupList } from '@/api/manager';
    import { fetch_FileList,update_File } from '@/api/utils';
    import Xterm from '@/components/Xterm/index';
    import YoProgress from '@/components/Progress/index';
    import { is_expire_User } from "@/api/auth";
    export default {
      data(){
        return{
          list: null,
          listLoading: true,
          btnStatus: false,
          dialogStatus:'',
          dialogUploadVisible: false,
          dialogWorkVisible: false,
          dialogXtermVisible: false,
          dialogFileVisible: false,
          dialogResultsVisible: false,
          dialogQRCodeVisible: false,
          error: '',
          upload_tb: [],
          uuid_list: [],
          update_obj: {},
          mission_item: null,
          select_time: '',
          detailSearch: false,
          textMap:{
            create: '新建工单',
            update: '修改工单',
            upload: '上传任务所需文件'
          },
          pagination: {
            page: 1,
            count: 0
          },
          commit_obj: {
          },
          search_obj: {
          },
          optionMission: [],
          optionGroup: [],
          optionFiles: []
        }
      },
      components: {
        Xterm,YoProgress
      },
      created(){
        this.init()
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
        }
      },
      methods: {
        init(){
          this.list = null
          this.listLoading = true
          fetch_WorkListByPage(this.pagination,this.search_obj).then(response =>{
            this.pagination.count = response.data.count
            this.list=response.data.results
            this.listLoading = false
          })
        },
        init_group(){
          this.optionGroup = []
          fetch_GroupList().then((response)=>{
            for (const group of response.data){
              this.optionGroup.push({
                value: group.id,
                label: group.name,
                disabled: false
              })
            }  
          })
        },
        init_mission(obj){
          this.optionMission = []
          fetch_MissionListByUser(obj).then(response=>{
            for (const mission of response.data){
              this.optionMission.push({
                value: mission.id,
                label: mission.info,
                disabled: false
              })
            }       
          })
        },
        init_files(){
          this.optionFiles = []
          fetch_FileList().then((response)=>{
            for ( const file of response.data){
              this.optionFiles.push({
                value: file.uuid,
                label: file.name,
                disabled: false
              })
            }
          })
        },
        selectTime(){
          this.search_obj.time = this.select_time[0] + 'to' + this.select_time[1]
        },
        searchCodeWork(){
          this.pagination = {
            page: 1,
            count: 0
          }
          this.init()
        },
        reset_commit(){
          this.commit_obj = {}
          this.optionMission = []
        },
        reset_search(){
          this.search_obj = {}
        },
        reset_dialog(){
          this.dialogUploadVisible = false
          this.dialogWorkVisible = false
          this.dialogXtermVisible = false
          this.dialogFileVisible = false
          this.dialogResultsVisible = false
          this.dialogQRCodeVisible = false
        },
        groupSelect(){
          this.reset_commit()
          this.init_mission(this.search_obj)
        },
        handleCreate(){
          this.dialogStatus = 'create'
          this.dialogWorkVisible = true
          this.reset_commit()
          this.reset_search()
          this.init_group()
        },
        createWork(){
          this.$refs['workForm'].validate((valid) => {
            if (valid) {
              this.btnStatus=true
              create_Work(this.commit_obj).then(() => {
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
        resetSearch(){
          this.reset_search()
          this.init()
        },
        handleCurrentChange(val) {
          this.pagination.page = val
          this.init()
        },
        handleResults(row){
          results_Work(row).then((response)=>{
            this.dialogResultsVisible = true
            this.error = response.data.results
          })
        },
        handleCheck(row){
          this.commit_obj = Object.assign({}, row) // copy obj
          this.dialogStatus = 'check'
          this.handleQRCode()
        },
        checkWork(row){
          check_Work(this.commit_obj).then((response)=>{
            this.init()
            this.reset_commit()
            this.reset_dialog()
          }).catch((error)=>{
            this.reset_dialog()
          })
        },
        handleUpload(row){
          this.commit_obj = Object.assign({}, row) // copy obj
          this.upload_tb = []
          for(let file in row.files){
            this.upload_tb.push({'name':row.files[file],'status':'未上传'})
          }
          this.dialogStatus = 'upload'
          this.dialogUploadVisible = true
          this.btnStatus = false
        },
        hanldSelectFile(file){
          this.init_files()
          this.update_obj = {}
          this.update_obj = {'var_name': file.name}
          this.dialogFileVisible = true
        },
        selectFile(){
          update_File(this.update_obj).then((response)=>{
            for(let row in this.upload_tb){
              if(this.upload_tb[row].name == this.update_obj.var_name){
                this.upload_tb[row].status = '选择完毕'
                this.upload_tb[row].uuid = this.update_obj.uuid
              }
            }
            this.dialogFileVisible = false
          })
        },
        handleUploadWork(){
          this.commit_obj.uuid_list = []
          for(let tb in this.upload_tb){
            this.commit_obj.uuid_list.push(this.upload_tb[tb].uuid)
          }
          this.dialogStatus = 'upload'
          this.handleQRCode()
        },
        uploadWork(){
          upload_Work(this.commit_obj).then((response)=>{
            this.$message({
              showClose: true,
              message: '上传文件成功',
              type: 'success'
            })
            this.reset_dialog()
            this.init()
          }).catch((error)=>{
            this.reset_dialog()
          })
        },
        handleQRCode() {
          is_expire_User()
            .then(response => {
              if (response.data.isexpire) {
                this.reset_dialog()
                this.dialogQRCodeVisible = true
              } else {
                if (this.dialogStatus === "check") {
                  this.checkWork()
                } else if (this.dialogStatus === "run") {
                  this.runWork()
                } else if (this.dialogStatus === "upload"){
                  this.uploadWork()
                } else if (this.dialogStatus === "create"){
                  this.createWork()
                }
              }
            }).catch(error => {
              this.$message({
                showClose: true,
                message: "过期时间确定失败",
                type: "danger"
              })
            })
        },
        runWork(){
          run_Work(this.commit_obj).then((response)=>{
            this.$confirm('此操作将执行该并对业务系统造成影响, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(()=>{
              this.reset_dialog()
              this.dialogXtermVisible = true
            }).catch(()=>{
              this.reset_dialog()
              this.dialogXtermVisible = false
            })
          })
        },
        handleRun(row){
          this.commit_obj = Object.assign({}, row) // copy obj
          this.dialogStatus = 'run'
          this.handleQRCode()
        },
        handleClose(done) {
          this.$confirm('关闭窗口您将无法实时获取工单进度')
          .then(_ => {
            done();
          })
          .catch(_ => {});
          this.init()
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .manager-mission-container {
    padding: 32px;
    /*background-color: rgb(240, 242, 245);*/
  }
  .el-tag {
    margin-left: 10px;
    margin-bottom: 5px;
    font-size: 15px;
  }
</style>
