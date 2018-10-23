<template>
  <div class="manager-meta-container">
  <el-row type="flex" justify="center" class="step-dialog">
    <el-col :offset="6">
      <div class="step-dialog" v-show="step === 0">
        <div class="step-choice">
          <el-button class="step-choice-btn" type="primary" @click="commit_obj.metatype='git';step=1" round>git发布</el-button>
          <el-button class="step-choice-btn" type="primary" @click="commit_obj.metatype='file';step=1" round>文件上传</el-button>
        </div>
      </div>
    <el-form :rules="rules" ref="dataForm" :model="commit_obj" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>

    <div class="step-form" v-show="step ===1 && commit_obj.metatype==='git'">
      <el-form-item label="任务名称" prop="data.name">
        <el-tooltip content="请输入任务名称" placement="bottom" effect="light">
          <el-input v-model="commit_obj.data.name"></el-input>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="分支地址" prop="data.src_git">
        <el-tooltip content="请输入要发布的分支地址" placement="bottom" effect="light">
          <el-input v-model="commit_obj.data.src_git"></el-input>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="分支名称" prop="data.src_branch">
        <el-tooltip content="请输入分支名称 如master" placement="bottom" effect="light">
          <el-input v-model="commit_obj.data.src_branch" value="master"></el-input>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="发布源路径" prop="data.src_path">
        <el-tooltip content="请输入分支中发布的目录 如/" placement="bottom" effect="light">
          <el-input v-model="commit_obj.data.src_path" value="/"></el-input>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="发布目标路径" prop="data.dest_path">
        <el-tooltip content="请输入目的路径 如/var/www" placement="bottom" effect="light">
          <el-input v-model="commit_obj.data.dest_path" value="/var/www"></el-input>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="是否验证" prop="data.need_validate">
        <el-tooltip content="请确认该任务是否需要审核" placement="bottom" effect="light">
          <el-select v-model="commit_obj.data.need_validate" placeholder="请选择">
            <el-option
              key="True"
              label="需要验证"
              value="True">
            </el-option>
            <el-option
              key="False"
              label="不需要验证"
              value="False">
            </el-option>
          </el-select>
        </el-tooltip>
      </el-form-item>
    </div>

    <div class="step-form" v-show="step ===1 && commit_obj.metatype==='file'">
      <el-form-item label="任务名称" prop="data.name">
        <el-tooltip content="请输入任务名称" placement="bottom" effect="light">
          <el-input v-model="commit_obj.data.name"></el-input>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="文件名称" prop="data.filename">
        <el-tooltip content="请输入上传文件的名称(大写英文)" placement="bottom" effect="light">
          <el-input v-model="commit_obj.data.filename" value="HOSTS"></el-input>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="目标文件" prop="data.dest_file">
        <el-tooltip content="请输入目标文件(完整路径)" placement="bottom" effect="light">
          <el-input v-model="commit_obj.data.dest_file" value="/etc/hosts"></el-input>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="是否验证" prop="data.need_validate">
        <el-tooltip content="请确认该任务是否需要审核" placement="bottom" effect="light">
          <el-select v-model="commit_obj.data.need_validate" placeholder="请选择">
            <el-option
              key="True"
              label="需要验证"
              value="True">
            </el-option>
            <el-option
              key="False"
              label="不需要验证"
              value="False">
            </el-option>
          </el-select>
        </el-tooltip>
      </el-form-item>
    </div>

    <div class="step-area"  v-show="step === 2">
      <el-row :gutter="1">
          <el-col :span="6">
            <p>请选择操作的应用组:</p>
          </el-col>
          <el-col :span="10">
            <el-select v-model="commit_obj.data.group" placeholder="请选择" @change="init_host" filterable>
              <el-option
                v-for="item in group_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
      </el-row>

      <el-row :gutter="1">
          <el-col :span="6">
            <p>请选择操作的主机:</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-transfer v-model="commit_obj.data.hosts" :data="host_options" placeholder="请选择应用主机IP" filterable>
            </el-transfer>
          </el-col>
        </el-row>

    </div>
  </el-form>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24" :offset="16">
        <el-button v-show="step!=0" type="primary" @click="handleStepUp">上一步</el-button>
        <el-button v-show="step!=0" type="primary" @click="handleStepDown">下一步</el-button>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <el-steps :active="step" finish-status="success" align-center>
        <el-step title="快速创建类型" icon="el-icon-question"></el-step>
        <el-step title="工单内容" icon="el-icon-edit"></el-step>
        <el-step title="操作范围" icon="el-icon-location"></el-step>
      </el-steps>
    </el-col>
  </el-row>
  </div>
</template>

<script>
import { create_Quick } from "@/api/ops";
import { fetch_GroupOpsList, fetch_HostList } from "@/api/manager";
export default {
  data() {
    return {
      step: 0,
      commit_obj: {
        data: {},
      },
      group_options: [],
      host_options: [],
      rules: {}
    };
  },
  components: {},
  created() {
    this.init_group()
  },
  methods: {
    init_host(value) {
      fetch_HostList({ groups: value }).then(response => {
        this.host_options = [];
        for (const host of response.data) {
          this.host_options.push({
            key: host.id,
            label: host.hostname,
            disabled: false
          })
        }
      })
    },
    reset_commit(){
      this.commit_obj = {
        data: {},
      }
    },
    init_group(){
      fetch_GroupOpsList().then(response => {
        this.group_options = []
        for (const group of response.data) {
          this.group_options.push({
            value: group.id,
            label: group.name,
            disabled: false
          })
        }
      })
    },
    handleStepUp(){
      this.step = this.step-1
    },
    handleStepDown(){
      if(this.step!=2){
        this.step = this.step+1
      }else{
        this.$refs['dataForm'].validate((valid) => {
          if (valid){
            create_Quick(this.commit_obj).then(() => {
              this.$message({
                showClose: true,
                message: '快速创建工单成功',
                type: 'success'
              })
              this.reset_commit()
              this.step = 0
            }).catch((error)=>{
              this.reset_commit()
              this.step = 0
              console.log(error)
            })
          }
        })
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.manager-meta-container {
  padding: 32px;
  /*background-color: rgb(240, 242, 245);*/
}
.el-tag {
  margin-left: 10px;
  margin-bottom: 5px;
  font-size: 15px;
}
.el-table {
  margin-bottom: 5px;
}
.step-dialog {
  width: 100%;
  height: 500px;
  .step-choice{
    margin-top: 230px;
    margin-left: 100px;
    .step-choice-btn{
      margin-left:100px;
      margin-right:100px;
    }
  }
  .step-form{
    margin-top: 50px;
  }
}
</style>
