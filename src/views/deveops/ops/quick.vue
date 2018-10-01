<template>
  <div class="manager-meta-container">
  <el-row type="flex" justify="center">
    <el-col :offset="6">
      <div class="step-dialog" v-show="step === 0">
        <el-button type="primary" @click="commit_obj.type='gitmeta';step=1">git发布</el-button>
        <el-button type="primary" @click="commit_obj.type='filemeta';step=1">文件上传</el-button>
      </div>
    <el-form ref="dataForm" :model="commit_obj" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>

    <div class="step-dialog" v-show="step ===1 && commit_obj.type==='gitmeta'">
      <el-form-item label="任务名称" prop="gitmeta.name">
        <el-tooltip content="请输入任务名称" placement="bottom" effect="light">
          <el-input v-model="commit_obj.gitmeta.name"></el-input>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="分支地址" prop="gitmeta.src_git">
        <el-tooltip content="请输入要发布的分支地址" placement="bottom" effect="light">
          <el-input v-model="commit_obj.gitmeta.src_git"></el-input>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="分支名称" prop="gitmeta.src_branch">
        <el-tooltip content="请输入分支名称 如master" placement="bottom" effect="light">
          <el-input v-model="commit_obj.gitmeta.src_branch" value="master"></el-input>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="发布源路径" prop="gitmeta.src_path">
        <el-tooltip content="请输入分支中发布的目录 如/" placement="bottom" effect="light">
          <el-input v-model="commit_obj.gitmeta.src_path" value="/"></el-input>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="发布目标路径" prop="gitmeta.dest_path">
        <el-tooltip content="请输入目的路径 如/var/www" placement="bottom" effect="light">
          <el-input v-model="commit_obj.gitmeta.dest_path" value="/var/www"></el-input>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="是否验证" prop="gitmeta.need_validate">
        <el-tooltip content="请确认该任务是否需要审核" placement="bottom" effect="light">
          <el-select v-model="commit_obj.gitmeta.need_validate" placeholder="请选择">
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
    <div class="step-dialog" v-show="step ===1 && commit_obj.type==='filemeta'">
      
      <el-form-item label="任务名称" prop="filemeta.name">
        <el-tooltip content="请输入任务名称" placement="bottom" effect="light">
          <el-input v-model="commit_obj.filemeta.name"></el-input>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="文件名称" prop="filemeta.filename">
        <el-tooltip content="请输入上传文件的名称(大写英文)" placement="bottom" effect="light">
          <el-input v-model="commit_obj.filemeta.filename" value="HOSTS"></el-input>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="目标文件" prop="filemeta.dest_file">
        <el-tooltip content="请输入目标文件(完整路径)" placement="bottom" effect="light">
          <el-input v-model="commit_obj.filemeta.dest_file" value="/etc/hosts"></el-input>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="是否验证" prop="filemeta.need_validate">
        <el-tooltip content="请确认该任务是否需要审核" placement="bottom" effect="light">
          <el-select v-model="commit_obj.filemeta.need_validate" placeholder="请选择">
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
  </el-form>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24" :offset="16">
        <el-button type="primary" @click="step=step-1">上一步</el-button>
        <el-button type="primary" @click="step=step-1">下一步</el-button>
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
        gitmeta: {},
        filemeta: {}
      },
      group_options: []
    };
  },
  components: {},
  created() {
    this.init_group();
  },
  methods: {
    init_host(value) {
      fetch_HostList({ groups: value }).then(response => {
        this.hosts = [];
        for (const host of response.data) {
          this.hosts.push({
            key: host.id,
            label: host.hostname,
            disabled: false
          });
        }
      });
    },
    init_group() {
      fetch_GroupOpsList().then(response => {
        this.group_options = [];
        for (const group of response.data) {
          this.group_options.push({
            value: group.id,
            label: group.name,
            disabled: false
          });
        }
      });
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
}
</style>
