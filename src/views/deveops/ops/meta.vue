<template>
  <div class="manager-meta-container">
    <div class="filter-container">
      <el-row style="margin-bottom:20px;">
        <el-select v-model="search_obj.group" placeholder="请选择" @change="changeGroup" @clear="clearGroup" filterable clearable style="width: 400px;">
          <el-option
            v-for="item in group_options"
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
        <el-button class="filter-item" @click="handleCreate();dialogStatus = 'create'" style="float:right;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>
      </el-row>
      <el-row style="margin-bottom:20px;" v-show="detailSearch">
        <el-col :span="5" :offset="1">
          信息： <el-input size="medium" style="width: 200px;" v-model="search_obj.info" class="filter-item" placeholder="根据元操作名称模糊搜索"></el-input>
        </el-col>
        <el-col :span="7" :offset="1">
          主机： <el-input size="medium" style="width: 250px;" v-model="search_obj.host" class="filter-item" placeholder="根据主机连接IP或主机名模糊搜索"></el-input>
        </el-col>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchMeta" style="float:right;" :disabled="btnStatus">搜索</el-button>
      </el-row>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <!-- <el-table-column width="70px" align="center" label="ID">
        <template slot-scope="meta">
          <span>{{ meta.row.id }}</span>
        </template>
      </el-table-column> -->

      <el-table-column width="300px" align="center" label="ID">
        <template slot-scope="meta">
          <span>{{ meta.row.uuid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="250px" align="center" label="所属应用组">
        <template slot-scope="meta">
          <span>{{ meta.row.group_name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="需求文件标签">
        <div slot-scope="meta">
          <template v-for="f in meta.row.need_files">
              <el-tag>{{ f }}</el-tag>
          </template>
          <!--<el-tag>...</el-tag>-->
        </div>
      </el-table-column>

      <el-table-column width="600px" align="center" label="信息">
        <template slot-scope="meta">
          <span>{{ meta.row.info }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="280" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="meta">
          <el-button type="warning" @click="handleUpdate(meta.row);dialogStatus = 'update'" :disabled="btnStatus">编辑</el-button>
          <el-button type="danger" @click="handleDelete(meta.row);dialogStatus = 'delete'" :disabled="btnStatus">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :total="pagination.count">
      </el-pagination>
    </div>
    
    <el-form ref="metaForm" :model="commit_obj" label-position="left" label-width="100px">
      <el-dialog
        width="70%"
        :title="textMap[dialogStatus]+'Step1'"
        :visible.sync="dialogMetaVisible"
        top="5vh">
        <el-row :gutter="1">
          <el-col :span="10">
            <el-form-item label="所属权限组" prop="group">
              <el-select v-model="commit_obj.group" placeholder="请选择" @change="init_host_args" filterable>
                <el-option
                  v-for="item in group_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="操作信息" prop="info">
              <el-input v-model="commit_obj.info" placeholder="填写操作信息"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作内容" prop="_tasks">
              <editor v-model="commit_obj._tasks" @init="editorInit" lang="yaml" theme="github" height="500"></editor>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-collapse v-model="activeNames">
              <el-collapse-item name="1">
                <template slot="title">
                  操作注意事项 Attention<i class="header-icon el-icon-info"></i>
                </template>
                <div>请在左侧直接填写元操作中的Task部分;</div>
                <div>书写内容需要符合yaml语法;</div>
              </el-collapse-item>
              <el-collapse-item title="组参数 GroupArgs" name="2">
                <template v-for="arg in group_args">
                  <el-tag :key="arg.key">{{ arg.key }}:{{ arg.value }}</el-tag>
                </template>
                <div>以上参数可以直接在Task内容中引入;</div>
              </el-collapse-item>
              <el-collapse-item title="文件分发与分发中心 DispenseCenter" name="3">
                <div v-text="collapse.mission"></div>
                <div v-text="collapse.example"></div>
                <div>分发中心将会依据来源文件的关键词分配文件 请保持一个任务中的分发文件名唯一;</div>
              </el-collapse-item>
              <el-collapse-item title="代码同步 CodeRsync" name="4">
                <div>代码同步仅限于前端与php代码 暂时不接受其余类型代码部署;</div>
                <div>请注意源地址与目标地址之前的对应关系;</div>
                <div>举例：synchronize: src=/tmp/A/ dest=/tmp/B</div>
                <div>以上含义为将A目录下的所有文件移动到B目录下;</div>
                <div v-text="collapse.workspace"></div>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
        

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleAsset" :disabled="btnStatus">下一步</el-button>
          <el-button @click="dialogMetaVisible = false" :disabled="btnStatus">取消</el-button>
        </div>
      </el-dialog>

      <el-dialog
        width="50%"
        title="确定操作范围Step2"
        :visible.sync="dialogAssetVisible">
        <!-- <el-row :gutter="1">
          <el-col :span="6">
            <p>请选择操作的应用组:</p>
          </el-col>
          <el-col :span="10">
            <el-form-item label="所属权限组" prop="group">
              <el-select v-model="commit_obj.group" placeholder="请选择" @change="init_host" filterable>
                <el-option
                  v-for="item in group_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> -->

        <el-row>
          <el-col :span="6">
            <p>请选择操作的主机:</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="" prop="hosts">
              <el-transfer v-model="commit_obj.hosts" :data="hosts" placeholder="请选择应用主机IP" filterable>
              </el-transfer>
            </el-form-item>
          </el-col>
        </el-row>
        
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleAssetBack" :disabled="btnStatus">上一步</el-button>
          <el-button type="primary" @click="handleQRCode" :disabled="btnStatus">下一步</el-button>
        </div>
      </el-dialog>

      <el-dialog title="QRCode二次验证" :visible.sync="dialogQRCodeVisible" width="30%" top="20vh">
        <span>请确认您的权限是运维工程师并且已经拥有QR-Code</span>
        <el-input v-model="commit_obj.qrcode" placeholder="请输入您当前账户的QR-Code"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button v-if="dialogStatus!='delete'" @click="handleQRCodeBack" :disabled="btnStatus">上一步</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="createMeta" :disabled="btnStatus">创建</el-button>
          <el-button v-else-if="dialogStatus=='update'" type="primary" @click="updateMeta" :disabled="btnStatus">更新</el-button>
          <el-button v-else type="primary" @click="deleteMeta" :disabled="btnStatus">删除</el-button>
        </div>
      </el-dialog>

    </el-form>

  </div>
</template>

<script>
import {
  fetch_MetaListByPage,
  create_Meta,
  update_Meta,
  delete_Meta,
  checkFile_Meta
} from "@/api/ops";
import { fetch_GroupOpsList, fetch_HostList } from "@/api/manager";
import { fetch_VariableList } from "@/api/variable";
import Xterm from "@/components/Xterm/index";
import editor from "vue2-ace-editor";
export default {
  data() {
    return {
      list: null,
      listLoading: true,
      btnStatus: false,
      dialogStatus: "",
      textMap: {
        create: "新建元操作",
        update: "修改元操作",
        delete: "删除元操作"
      },
      collapse:{
        example: '举例：copy: src=file:{{HOSTS}} dest=/etc/hosts;',
        mission: '上传文件的任务 请在文件来源填写file:{{文件名}};',
        workspace: '工作目录请填写{{BASE}}/'
      },
      pagination: {
        page: 1,
        count: 0
      },
      detailSearch: false,
      group_options: [],
      hosts: [],
      group_args: [
      ],
      dialogMetaVisible: false,
      dialogAssetVisible: false,
      dialogQRCodeVisible: false,
      dialogFileVisible: false,
      commit_obj: {},
      search_obj: {},
      activeNames: ["1"]
    };
  },
  components: {
    Xterm,
    editor
  },
  created() {
    this.init();
    this.init_group();
  },
  filters: {
    needFile(value) {
      if (value) {
        return "需要";
      } else {
        return "不需要";
      }
    }
  },
  methods: {
    init() {
      this.listLoading = true;
      fetch_MetaListByPage(this.pagination, this.search_obj).then(response => {
        this.pagination.count = response.data.count;
        this.list = response.data.results;
        this.listLoading = false;
      });
    },
    init_host_args(value) {
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
      fetch_VariableList(value).then(response => {
        this.group_args = response.data;
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
    },
    searchMeta() {
      this.init()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.init()
    },
    reset_commit() {
      this.commit_obj = {_tasks:''}
      this.hosts = []
    },
    reset_search() {
      this.search_obj = {}
    },
    resetSearch() {
      this.reset_search()
      this.init()
      this.init_group()
    },
    changeGroup() {
      this.pagination = {
        page: 1,
        count: 0
      }
      this.init()
    },
    clearGroup() {
      this.pagination = {
        page: 1,
        count: 0
      }
      this.init_group()
    },
    handleCreate() {
      this.reset_commit()
      this.dialogMetaVisible = true
      this.$nextTick(() => {
        this.$refs["metaForm"].clearValidate()
      })
    },
    handleUpdate(row) {
      this.commit_obj = Object.assign({}, row) // copy obj
      this.dialogMetaVisible = true
      this.init_host_args(this.commit_obj.group)
      this.$nextTick(() => {
        this.$refs["metaForm"].clearValidate()
      })
    },
    handleDelete(row) {
      this.commit_obj = Object.assign({}, row)
      this.btnStatus = false
      this.dialogQRCodeVisible = true
    },
    deleteMeta() {
      this.deleteConfirm()
    },
    deleteConfirm() {
      this.$confirm("此操作将删除元操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delete_Meta(this.commit_obj).then(response => {
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          })
          this.dialogQRCodeVisible = false
          this.init()
        });
      });
    },
    handleAsset() {
      this.init_group()
      this.dialogMetaVisible = false
      this.dialogAssetVisible = true
    },
    handleAssetBack() {
      this.dialogAssetVisible = false
      this.dialogMetaVisible = true
    },
    handleQRCode() {
      this.dialogAssetVisible = false
      this.dialogQRCodeVisible = true
    },
    handleQRCodeBack() {
      this.dialogAssetVisible = true
      this.dialogQRCodeVisible = false
    },
    editorInit(editor) {
      require("brace/ext/language_tools")
      require("brace/theme/github")
      require("brace/mode/yaml")
      editor.setFontSize(17)
      editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        wrap: "free"
      })
    },
    createMeta() {
      this.$refs["metaForm"].validate(valid => {
        if (valid) {
          this.btnStatus = true
          console.log(this.commit_obj)
          create_Meta(this.commit_obj)
            .then(() => {
              this.init()
              this.dialogQRCodeVisible = false
              this.$message({
                showClose: true,
                message: "创建元操作成功",
                type: "success"
              })
              this.btnStatus = false
            })
            .catch(error => {
              this.btnStatus = false
              this.dialogQRCodeVisible = false
              console.log(error)
            });
        }
      });
    },
    updateMeta() {
      this.$refs["metaForm"].validate(valid => {
        if (valid) {
          this.btnStatus = true;
          update_Meta(this.commit_obj)
            .then(() => {
              this.init();
              this.dialogQRCodeVisible = false;
              this.$message({
                showClose: true,
                message: "更新元操作成功",
                type: "success"
              });
              this.btnStatus = false;
            })
            .catch(error => {
              this.btnStatus = false;
              this.dialogQRCodeVisible = false;
              console.log(error);
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
</style>
