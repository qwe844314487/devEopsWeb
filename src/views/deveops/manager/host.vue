<template>
  <div class="manager-host-container">
    <div class="filter-container">
      <el-row style="margin-bottom:20px;">
        <el-select v-model="search_obj.groups" placeholder="请选择" @change="changeGroup" @clear="clearGroup" filterable clearable style="width: 400px;">
          <el-option
            v-for="item in groups"
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
        <el-button class="filter-item" @click="handleMultipleGroup()" style="margin-left: 10px;" type="primary" icon="el-icon-goods" :disabled="btnStatus">归类</el-button>
        <el-button class="filter-item" @click="handleExpired()" style="margin-left: 10px;" type="primary" icon="el-icon-time" :disabled="btnStatus">过期资源</el-button>
        <el-button class="filter-item" @click="handleCreate()" style="float:right;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>
      </el-row>
      <el-row>
        <el-col>
          <el-tag size="mini" type="info">未归类</el-tag>
          <el-tag size="mini" type="success">可使用</el-tag>
          <el-tag size="mini" type="warning">存在问题</el-tag>
        </el-col>
      </el-row>
      <el-row v-show="detailSearch" style="margin-bottom:5px;">
        <el-col :span="7" :offset="1">
          连接地址： <el-input size="medium" style="width: 200px;" v-model="search_obj.connect_ip" class="filter-item" placeholder="根据私网IP搜索"></el-input>
        </el-col>
        <el-col :span="7">
          主机名称： <el-input size="medium" style="width: 200px;" v-model="search_obj.hostname" class="filter-item" placeholder="根据主机名模糊搜索"></el-input>
        </el-col>
        <el-col :span="7">
          详细信息： <el-input size="medium" style="width: 200px;" v-model="search_obj.info" class="filter-item" placeholder="根据主机用途模糊搜索"></el-input>
        </el-col>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchHost" style="float:right;" :disabled="btnStatus">搜索</el-button>
      </el-row>
      <el-row v-show="detailSearch" style="margin-bottom:20px;">
        <el-col :span="7" :offset="1">
          系统类型： <el-input size="medium" style="width: 200px;" v-model="search_obj.systype" class="filter-item" placeholder="根据操作系统类型模糊搜索"></el-input>
        </el-col>
        <el-col :span="7">
          位置类型： <el-input size="medium" style="width: 200px;" v-model="search_obj.position" class="filter-item" placeholder="根据位置类型模糊搜索"></el-input>
        </el-col>
      </el-row>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      ref="multipleTable"
      style="width: 100%"
      tooltip-effect="dark"
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange">
      <el-table-column
      type="selection"
      width="55px">
      </el-table-column>

      <el-table-column width="260px" align="center" label="Aliyun | VmWare">
        <template slot-scope="host">
          <span>{{ host.row| uuidFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="主机名">
        <template slot-scope="host">
          <span>{{ host.row.hostname }}</span>
        </template>
      </el-table-column>

      <el-table-column width="115" align="center" label="状态" class-name="status-col" >
        <template slot-scope="host">
          <el-tag :type="host.row._status | statusFilter">{{optionStateObj[host.row._status]}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="145px" align="center" label="连接IP">
        <template slot-scope="host">
          <span>{{ host.row.connect_ip }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="环境">
        <template slot-scope="host">
          <span>{{ host.row.position }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="操作系统">
        <template slot-scope="host">
          <span>{{ host.row.systemtype }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="450px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="host">
          <!-- <el-button type="primary" size="medium" @click="handleQRCode(host.row)" :disabled="btnStatus">密码</el-button> -->
          <el-button type="primary" size="medium" @click="handleDetail(host.row)" :disabled="btnStatus">详细</el-button>
          <el-button type="warning" size="medium" @click="handleGroup(host.row)" :disabled="btnStatus">应用组</el-button>
          <el-button type="warning" size="medium" @click="handleUpdate(host.row)" :disabled="btnStatus">编辑</el-button>
          <el-button type="danger" size="medium" @click="handleDelete(host.row)" :disabled="btnStatus">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange" 
      :total="pagination.count"
      :page-sizes="[10, 20, 30, 40, 50, 60]"
      >
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogSelectHostVisible" width="20%" top="20vh">
      <el-select v-model="commit_obj.groups" placeholder="请选择" filterable clearable>
        <el-option
          v-for="item in groups"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSelectHostVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button type="primary" @click="selectGroup" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogPasswdVisible" width="20%" top="20vh">
      <span>请确认您的权限是运维工程师并且已经拥有QR-Code</span>
      <el-input v-model="commit_obj.qrcode" placeholder="请输入您当前账户的QR-Code"></el-input>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="document" 
        @click="UpdateQRCode">校验QR-Code
      </el-button>
        <el-button v-show="temp_passwd" type="primary" icon="document" v-clipboard:copy='temp_passwd' v-clipboard:success='clipboardSuccess' @click="dialogPasswdVisible = false">粘贴密码</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDetailVisible" width="80%" top="2vh" :fullscreen="true">
      <el-row>
        <el-col :span="24">
      <el-select v-model="detail_time" placeholder="请选择" @change="init_detail_aliyun">
        <el-option
        :key="1"
        label="一小时"
        :value="1"
        ></el-option>
        <el-option
        :key="2"
        label="六小时"
        :value="2"
        ></el-option>
        <el-option
        :key="3"
        label="十二小时"
        :value="3"
        ></el-option>
        <el-option
        :key="4"
        label="一天"
        :value="4"
        ></el-option>
        <el-option
        :key="5"
        label="三天"
        :value="5"
        ></el-option>
        <el-option
        :key="6"
        label="七天"
        :value="6"
        ></el-option>
      </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="cpu">
            <IEcharts
              group="123"
              :option="monitor_obj.CPU"
              :loading="monitorLoading"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="memory">
            <IEcharts
              group="123"
              :option="monitor_obj.Memory"
              :loading="monitorLoading"
            />
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="disk">
            <IEcharts
              group="123"
              :option="monitor_obj.DiskRead"
              :loading="monitorLoading"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="internet">
            <IEcharts
              group="123"
              :option="monitor_obj.InternetIn"
              :loading="monitorLoading"
            />
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailVisible = false" :disabled="btnStatus">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogGroupVisible" width="60%" top="2vh">
      <el-form ref="groupForm" :model="commit_obj" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>
        <el-form-item label="所属权限组" prop="pmn_groups">
          <el-transfer v-model="commit_obj.groups" :data="groups" placeholder="请选择所属应用组" filterable>
          </el-transfer>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGroupVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button type="primary" @click="updateGroups" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="48%" top="7vh">
      <el-form :rules="rules" ref="dataForm" :model="commit_obj" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>

        <el-form-item label="主机信息" prop="info">
          <el-tooltip content="请输入该主机涉及的服务内容" placement="bottom" effect="light">
            <el-input type="textarea" v-model="commit_obj.info"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="连接IP" prop="connect_ip">
          <el-tooltip content="请输入管理该机器的IP地址" placement="bottom" effect="light">
            <el-input v-model="commit_obj.connect_ip"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="连接端口" prop="sshport">
          <el-tooltip content="请输入管理该机器通过的SSH端口" placement="bottom" effect="light">
            <el-input v-model="commit_obj.sshport"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="密码" prop="passwd">
          <el-tooltip content="请输入记录的密码" placement="bottom" effect="light">
            <el-input type="password" v-model="commit_obj.passwd"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="状态" prop="_status">
          <el-tooltip content="请输入该机器目前的状态" placement="top" effect="light">
            <el-select v-model="commit_obj._status" placeholder="请选择主机状态">
              <el-option v-for="option in optionState" :key="option.label" :label="option.label" :value="option.value" :disabled="option.disabled"></el-option>
            </el-select>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="阿里云ID" prop="aliyun_id">
          <el-tooltip content="请输入阿里云UUID" placement="bottom" effect="light">
            <el-input v-model="commit_obj.aliyun_id"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="VMwareID" prop="vmware_id">
          <el-tooltip content="请输入VMware-UUID" placement="bottom" effect="light">
            <el-input v-model="commit_obj.vmware_id"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="主机名" prop="hostname">
          <el-tooltip content="请输入该机器主机名" placement="top" effect="light">
            <el-input v-model="commit_obj.hostname"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="位置" prop="position">
          <el-tooltip content="请输入该主机目前在什么位置" placement="top" effect="light">
            <el-input v-model="commit_obj.position"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="系统类型" prop="systemtype">
          <el-tooltip content="请输入该主机的操作系统" placement="top" effect="light">
            <el-input v-model="commit_obj.systemtype"></el-input>
          </el-tooltip>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :disabled="btnStatus">提交</el-button>
        <el-button v-else type="primary" @click="updateData" :disabled="btnStatus">提交</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import IEcharts from "vue-echarts-v3/src/lite.js";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import "echarts/lib/component/title";
import echarts from "echarts";
import {
  fetch_HostListByPage,
  delete_Host,
  create_Host,
  update_Host,
  fetch_HostPasswd
} from "@/api/manager";
import {
  fetch_GroupList,
  selectHost_Group,
  selectGroup_Host
} from "@/api/manager";
import {
  fetch_MonitorHostAliyunCPU,
  fetch_MonitorHostAliyunMemory,
  fetch_MonitorHostAliyunDiskRead,
  fetch_MonitorHostAliyunInternetIn
} from "@/api/monitor";
export default {
  data() {
    return {
      list: null,
      listLoading: true,
      monitorLoading: true,
      btnStatus: false,
      dialogDetailVisible: false,
      dialogFormVisible: false,
      dialogPasswdVisible: false,
      dialogGroupVisible: false,
      dialogSelectHostVisible: false,
      detailSearch: false,
      systemtype: [],
      position: [],
      monitorFlag: null,
      temp_passwd: "",
      groups: [],
      detail_time: 1,
      multipleSelection: [],
      pagination: {
        page: 1,
        count: 0,
        page_size: 10
      },
      textMap: {
        detail: "主机详情",
        update: "编辑主机",
        create: "新建主机",
        passwd: "粘贴密码",
        group: "修改应用组",
        selecthost: "批量归类主机"
      },
      dialogStatus: "",
      monitor_obj: {},
      search_obj: {},
      commit_obj: {},
      echarts_options: {
        title: {
          text: ""
        },
        legend: {},
        tooltip: {
          textStyle: {
            fontSize: 14
          },
          borderColor: "#333",
          trigger: "axis",
          triggerOn: "mousemove|click",
          backgroundColor: "rgba(50,50,50,0.7)",
          borderWidth: 0,
          axisPointer: {
            type: "line"
          }
        },
        dataset: {
          dimensions: ["timestamp","Maximum","Minimum"],
          source: []
        },
        xAxis: { type: "category" },
        yAxis: [{ scale: true }],
        series: [
          {
            type: "line",
            smooth: true,
            seriesLayoutBy: "row",
            name: "最大值",
            lineStyle: {
              normal: {
                curveness: 0,
                type: "solid",
                width: 1,
                opacity: 1
              }
            },
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" }
              ]
            },
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          },
          {
            type: "line",
            smooth: true,
            name: "最小值",
            seriesLayoutBy: "row",
            lineStyle: {
              normal: {
                curveness: 0,
                type: "solid",
                width: 1,
                opacity: 1
              }
            },
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" }
              ]
            },
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          }
        ]
      },
      optionStateObj: {
        "-4": "连接拒绝",
        "-3": "未归类",
        "-2": "关机",
        "-1": "暂停",
        "1": "正常",
        "2": "根溢出",
        "3": "负载高",
        "4": "根点溢出"
      },
      optionState: [
        {
          value: "-4",
          label: "连接拒绝",
          disabled: true
        },
        {
          value: "-3",
          label: "未归类",
          disabled: true
        },
        {
          value: "-2",
          label: "关机",
          disabled: true
        },
        {
          value: "-1",
          label: "暂停"
        },
        {
          value: "1",
          label: "正常"
        },
        {
          value: "2",
          label: "根溢出",
          disabled: true
        },
        {
          value: "3",
          label: "负载高",
          disabled: true
        },
        {
          value: "4",
          label: "根点溢出",
          disabled: true
        }
      ],
      rules: {
        info: [
          { required: true, message: "主机信息是必须的", trigger: "change" }
        ],
        connect_ip: [
          {
            required: true,
            message: "连接IP是您管理主机的重要信息",
            trigger: "change"
          },
          {
            pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/,
            message: "您输入的IP地址有误",
            trigger: "blur"
          }
        ],
        sshport: [
          {
            required: true,
            message: "连接端口是您管理主机的重要信息",
            trigger: "change"
          }
        ],
        _status: [
          {
            required: true,
            message: "您未填写该主机目前的状态",
            trigger: "blur"
          }
        ],
        position: [
          {
            required: true,
            message: "请填写该主机目前所在的位置",
            trigger: "blur"
          }
        ],
        systemtype: [
          {
            required: true,
            message: "请填写该主机的操作系统类型",
            trigger: "blur"
          }
        ]
      }
    };
  },
  components: {
    IEcharts
  },
  created() {
    this.init();
  },
  filters: {
    statusFilter(_status) {
      const statusMap = {
        "-4": "danger",
        "-3": "warning",
        "-1": "warning",
        "-2": "danger",
        "1": "success",
        "2": "danger",
        "3": "danger",
        "4": "danger",
      };
      return statusMap[_status];
    },
    uuidFilter(host) {
      if (host.aliyun_id) {
        return host.aliyun_id;
      } else if (host.vmware_id) {
        return host.vmware_id;
      } else {
        return "None";
      }
    }
  },
  methods: {
    init() {
      this.list = null;
      this.listLoading = true;
      this.init_hosts();
      this.init_groups();
    },
    init_hosts() {
      fetch_HostListByPage(this.pagination, this.search_obj).then(response => {
        this.pagination.count = response.data.count;
        this.list = response.data.results;
        this.listLoading = false;
      });
    },
    init_groups() {
      fetch_GroupList().then(response => {
        this.groups = [];
        for (const group of response.data) {
          this.groups.push({
            value: group.id,
            key: group.id,
            label: group.name,
            disabled: false
          });
        }
      });
    },
    init_detail_aliyun() {
      this.monitorFlag = 0;
      this.monitorLoading = true;
      fetch_MonitorHostAliyunCPU(this.commit_obj.uuid, this.detail_time).then(
        response => {
          // this.monitor_obj.CPU = Object.assign({}, this.echarts_options); // copy obj
          // this.monitor_obj.CPU = Object.create(this.echarts_options)
          this.monitor_obj.CPU = JSON.parse(JSON.stringify(this.echarts_options))
          this.monitor_obj.CPU.dataset.source = response.data.dataset;
          this.monitor_obj.CPU.title.text = response.data.title;
          this.monitorFlag = this.monitorFlag + 1;
          if (this.monitorFlag >= 4) {
            this.dialogDetailVisible = true;
            this.monitorLoading = false;
            echarts.connect("123");
          }
        }
      );
      fetch_MonitorHostAliyunMemory(
        this.commit_obj.uuid,
        this.detail_time
      ).then(response => {
        // this.monitor_obj.Memory = Object.assign({}, this.echarts_options); // copy obj
        // this.monitor_obj.Memory = Object.create(this.echarts_options)
        this.monitor_obj.Memory = JSON.parse(JSON.stringify(this.echarts_options))
        this.monitor_obj.Memory.dataset.source = response.data.dataset;
        this.monitor_obj.Memory.title.text = response.data.title;
        this.monitorFlag = this.monitorFlag + 1;
        if (this.monitorFlag >= 4) {
          this.dialogDetailVisible = true;
          this.monitorLoading = false;
          echarts.connect("123");
        }
      });
      fetch_MonitorHostAliyunDiskRead(
        this.commit_obj.uuid,
        this.detail_time
      ).then(response => {
        // this.monitor_obj.DiskRead = Object.assign({}, this.echarts_options); // copy obj
        // this.monitor_obj.DiskRead = Object.create(this.echarts_options)
        this.monitor_obj.DiskRead = JSON.parse(JSON.stringify(this.echarts_options))
        this.monitor_obj.DiskRead.dataset.source = response.data.dataset;
        this.monitor_obj.DiskRead.title.text = response.data.title;
        this.monitorFlag = this.monitorFlag + 1;
        if (this.monitorFlag >= 4) {
          this.dialogDetailVisible = true;
          this.monitorLoading = false;
          echarts.connect("123");
        }
      });
      fetch_MonitorHostAliyunInternetIn(
        this.commit_obj.uuid,
        this.detail_time
      ).then(response => {
        this.monitor_obj.InternetIn = JSON.parse(JSON.stringify(this.echarts_options))
        // this.monitor_obj.InternetIn = Object.assign({}, this.echarts_options); // copy obj
        this.monitor_obj.InternetIn.dataset.source = response.data.dataset;
        this.monitor_obj.InternetIn.title.text = response.data.title;
        this.monitorFlag = this.monitorFlag + 1;
        if (this.monitorFlag >= 4) {
          this.dialogDetailVisible = true;
          this.monitorLoading = false;
          echarts.connect("123");
        }
      });
    },
    handleSizeChange(val) {
      this.pagination.page_size = val;
      this.init_hosts();
    },
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.init_hosts();
    },
    tableRowClassName({ row, rowIndex }) {
      if (row._status === -3) {
        return "";
      }
      if (row._status > 1 || row._status < 0) {
        return "warning-row";
      } else if (row._status === 1) {
        return "success-row";
      } else {
        return "";
      }
    },
    reset_commit() {
      this.commit_obj = {};
    },
    reset_search() {
      this.search_obj = {};
    },
    changeGroup() {
      this.pagination = {
        page: 1,
        count: 0,
        page_size: 10
      };
      this.init_hosts();
    },
    clearGroup() {
      this.pagination = {
        page: 1,
        count: 0,
        page_size: 10
      };
      this.init_hosts();
    },
    searchHost() {
      this.pagination = {
        page: 1,
        count: 0,
        page_size: 10
      };
      this.init_hosts();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteConfirm() {
      this.$confirm("此操作将删除主机, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delete_Host(this.commit_obj).then(response => {
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          this.init();
        });
      });
    },
    handleDetail(row) {
      this.commit_obj = Object.assign({}, row); // copy obj
      this.dialogStatus = "detail";
      this.monitorFlag = 0;
      this.detail_time = 1;
      this.init_detail_aliyun();
    },
    handleCreate(row) {
      this.reset_commit();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    resetSearch() {
      this.reset_search();
      this.init_hosts();
    },
    handleMultipleGroup() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "error",
          message: "您未选择任何归类主机"
        });
        return;
      }
      this.reset_commit();
      this.dialogSelectHostVisible = true;
      this.dialogStatus = "selecthost";
    },
    selectGroup() {
      let list = [];
      for (const select of this.multipleSelection) {
        list.push(select.id);
      }
      selectHost_Group(this.commit_obj, { hosts: list })
        .then(response => {
          this.$message({
            showClose: true,
            message: "归类成功",
            type: "success"
          });
          this.reset_commit();
          this.init();
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: "归类失败",
            type: "danger"
          });
        });
      this.dialogSelectHostVisible = false;
    },
    handleGroup(row) {
      this.commit_obj = Object.assign({}, row); // copy obj
      this.dialogStatus = "group";
      this.dialogGroupVisible = true;
      this.$nextTick(() => {
        this.$refs["groupForm"].clearValidate();
      });
    },
    handleUpdate(row) {
      this.commit_obj = Object.assign({}, row); // copy obj
      this.commit_obj._status = this.commit_obj._status + "";
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleQRCode(row) {
      this.dialogStatus = "passwd";
      this.dialogPasswdVisible = true;
      this.commit_obj.uuid = row.uuid;
    },
    UpdateQRCode() {
      fetch_HostPasswd(this.commit_obj).then(response => {
        this.$message({
          message: "校验成功",
          type: "success",
          duration: 1500
        });
        this.temp_passwd = response.data[0].passwd;
      });
    },
    clipboardSuccess() {
      this.reset_commit();
      this.temp_passwd = "";
      this.dialogPasswdVisible = false;
      this.$message({
        message: "复制成功",
        type: "success",
        duration: 1500
      });
    },
    handleDelete(row) {
      this.commit_obj = Object.assign({}, row);
      this.btnStatus = true;
      this.deleteConfirm();
      this.btnStatus = false;
    },
    updateGroups(row) {
      this.$refs["groupForm"].validate(valid => {
        if (valid) {
          this.btnStatus = true;
          selectGroup_Host(this.commit_obj)
            .then(() => {
              this.dialogGroupVisible = false;
              this.init();
              this.$message({
                showClose: true,
                message: "更新成功",
                type: "success"
              });
              this.btnStatus = false;
            })
            .catch(error => {
              this.dialogGroupVisible = false;
              this.btnStatus = false;
            });
        }
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.btnStatus = true;
          create_Host(this.commit_obj)
            .then(() => {
              this.init();
              this.dialogFormVisible = false;
              this.$message({
                showClose: true,
                message: "创建成功",
                type: "success"
              });
              this.btnStatus = false;
            })
            .catch(error => {
              this.btnStatus = false;
              this.dialogFormVisible = false;
            });
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.btnStatus = true;
          update_Host(this.commit_obj)
            .then(() => {
              this.init();
              this.dialogFormVisible = false;
              this.$message({
                showClose: true,
                message: "更新成功",
                type: "success"
              });
              this.btnStatus = false;
            })
            .catch(error => {
              this.btnStatus = false;
              this.dialogFormVisible = false;
            });
        }
      });
    },
    handleExpired() {
      this.$router.push({ path: "/manager/expired" });
    }

    // createSystypeFilter(queryString) {
    //   return (systemtype) => {
    //     return (systemtype.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
    //   };
    // },
    // createPositionFilter(queryString) {
    //   return (position) => {
    //     return (position.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
    //   };
    // },
    // queryPositionSearch(queryString,cb) {
    //   const restaurants = this.position
    //   const results = queryString ? restaurants.filter(this.createPositionFilter(queryString)) : restaurants
    //   cb(results)
    // },
    // querySystypeSearch(queryString, cb) {
    //   const restaurants = this.systemtype
    //   const results = queryString ? restaurants.filter(this.createSystypeFilter(queryString)) : restaurants
    //   cb(results)
    // }
  }
};
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}
.el-table .success-row {
  background: #f0f9eb;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.manager-host-container {
  padding: 32px;
  /*background-color: rgb(240, 242, 245);*/
}
.cpu {
  width: 600px;
  height: 400px;
}
.memory {
  width: 600px;
  height: 400px;
}
.disk {
  width: 600px;
  height: 400px;
}
.internet {
  width: 600px;
  height: 400px;
}
.el-tag {
  margin-left: 10px;
  margin-bottom: 5px;
  font-size: 15px;
}
</style>
