<template>
  <div class="manager-host-container">
    <div class="filter-container">
      <el-row style="margin-bottom:20px;">
        <el-select v-model="search_obj.type" placeholder="请选择" @change="changeType" @clear="clearType" filterable clearable style="width: 400px;">
          <el-option
            v-for="item in optionType"
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
        <el-button class="filter-item" @click="handleCreate()" style="float:right;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>
      </el-row>
      <el-row v-show="detailSearch" style="margin-bottom:20px;">
        <el-col :span="7" :offset="1">
          当前状态： 
          <el-select v-model="search_obj.status" placeholder="请选择" clearable>
            <el-option
              key="-1"
              label="错误"
              value="-1">
            </el-option>
            <el-option
              key="1"
              label="运行中"
              value="1">
            </el-option>
            <el-option
              key="2"
              label="成功"
              value="2">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="7">
          时间筛选：         <el-date-picker
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
        </el-col>
        <el-button class="filter-item" type="primary" icon="el-icon-search" style="float:right;" @click="searchDNS" :disabled="btnStatus">搜索</el-button>
      </el-row>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      ref="multipleTable"
      style="width: 100%"
      tooltip-effect="dark">
      <el-table-column width="260px" align="center" label="UUID">
        <template slot-scope="cdn">
          <span>{{ cdn.row.uuid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="500px" align="center" label="URL">
        <template slot-scope="cdn">
          <span>{{ cdn.row.url }}</span>
        </template>
      </el-table-column>

      <el-table-column width="115" align="center" label="类型" class-name="status-col" >
        <template slot-scope="cdn">
          <el-tag>{{optionTypeObj[cdn.row.type]}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="115" align="center" label="状态" class-name="status-col" >
        <template slot-scope="cdn">
          <el-tag :type="cdn.row.status | statusFilter">{{optionStateObj[cdn.row.status]}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="刷新时间">
        <template slot-scope="setup">
          <span>{{ setup.row.create_time | timeFilter }}</span>
        </template>
      </el-table-column>

    </el-table>

    <el-form ref="cdnForm" :model="commit_obj" label-position="left" label-width="100px">
      <el-dialog
        width="70%"
        :title="textMap[dialogStatus]"
        :visible.sync="dialogCDNVisible">
            <el-table :data="commit_obj.cdns" border fit highlight-current-row
                      style="width: 100%">
              <el-table-column width="700px" align="center" label="刷新路径">
                <template slot-scope="cdn">
                  <span>{{ cdn.row.url }}</span>
                </template>
              </el-table-column>

              <el-table-column width="200px" align="center" label="刷新类型">
                <template slot-scope="cdn">
                  <el-tag>{{ optionTypeObj[cdn.row.type] }}</el-tag>
                </template>
              </el-table-column>

              <el-table-column width="250px" align="center" label="工具">
                <template slot-scope="cdn">
                  <el-button type="primary" size="mini" @click="handleCDNDelete(cdn.row)" :disabled="btnStatus">刪除</el-button>
                </template>
              </el-table-column>
            </el-table>

        <div slot="footer" class="dialog-footer">
          <el-button type="warning" @click="handleCDNCreate" :disabled="btnStatus">新增CDN</el-button>
          <el-button type="primary" @click="createCDN" :disabled="btnStatus">提交</el-button>
          <el-button @click="dialogCDNVisible = false" :disabled="btnStatus">取消</el-button>
        </div>

        <el-dialog
          width="30%"
          title="新增刷新"
          :visible.sync="dialogAppendCDNVisible"
          append-to-body>
            <div :model="cdn">
                <el-input placeholder="https://stc-new.8531.cn/android/zjnews_huajishijie.apk" v-model="cdn.url">
                  <template slot="prepend">刷新路径:</template>
                </el-input>
                <el-select v-model="cdn.type" placeholder="请选择刷新的类型">
                  <el-option v-for="option in optionType" :key="option.label" :label="option.label" :value="option.value" :disabled="option.disabled"></el-option>
                </el-select>
            </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="createCDNRow" :disabled="btnStatus">提交</el-button>
            <el-button @click="dialogAppendCDNVisible = false" :disabled="btnStatus">取消</el-button>
          </div>
        </el-dialog>
      </el-dialog>

    </el-form>

    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { fetch_CDNListByPage, create_CDN } from "@/api/cdn";
export default {
  data() {
    return {
      list: null,
      listLoading: true,
      btnStatus: false,
      dialogCDNVisible: false,
      dialogAppendCDNVisible: false,
      pagination: {
        page: 1,
        count: 0
      },
      textMap: {
        create: "新建CDNs刷新"
      },
      dialogStatus: "",
      optionStateObj: {
        "-1": "失败",
        "1": "运行中",
        "2": "成功"
      },
      optionTypeObj: {
        "1": "七牛",
        "2": "网宿",
        "3": "阿里云"
      },
      search_obj: {},
      commit_obj: { cdns: [] },
      detailSearch: null,
      cdn: {},
      select_time: "",
      optionType: [
        {
          value: "1",
          label: "七牛",
          disabled: false
        },
        {
          value: "2",
          label: "网宿",
          disabled: false
        },
        {
          value: "3",
          label: "阿里云",
          disabled: false
        }
      ],
      rules: {}
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        "-1": "danger",
        "1": "warning",
        "2": "success"
      };
      return statusMap[status];
    },
    timeFilter(timeformat) {
      if (timeformat) {
        const date = timeformat.split("T");
        const time = date[1].split(".");
        return date[0] + " " + time[0];
      } else {
        return "";
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    handleChange(val) {
      if (val.length == 0) {
        this.reset_search();
        this.init();
      }
    },
    reset_search() {
      this.search_obj = {};
    },
    reset_commit() {
      this.commit_obj = { cdns: [] };
    },
    reset_cdn() {
      this.cdn = {};
    },
    init() {
      fetch_CDNListByPage(this.pagination, this.search_obj).then(response => {
        this.pagination.count = response.data.count;
        this.list = response.data.results;
        this.listLoading = false;
      });
      this.listLoading = false;
    },
    handleCurrentChange(val) {
      this.pagination.page = val;
    },
    searchDNS() {
      this.init();
    },
    resetSearch() {
      this.reset_search();
      this.init();
    },
    handleCreate() {
      this.reset_search();
      this.reset_commit();
      this.dialogStatus = "create";
      this.dialogCDNVisible = true;
    },
    createCDN() {
      this.$refs["cdnForm"].validate(valid => {
        if (valid) {
          this.btnStatus = true;
          create_CDN(this.commit_obj)
            .then(() => {
              this.reset_search();
              this.init();
              this.dialogCDNVisible = false;
              this.$message({
                showClose: true,
                message: "创建成功",
                type: "success"
              });
              this.btnStatus = false;
            })
            .catch(error => {
              this.btnStatus = false;
              this.dialogCDNVisible = false;
            });
        }
      });
    },
    selectTime() {
      this.search_obj.time = this.select_time[0] + "to" + this.select_time[1];
    },
    createCDNRow() {
      this.commit_obj.cdns.push(this.cdn);
      this.dialogAppendCDNVisible = false;
    },
    handleCDNDelete(row) {
      for (var i = 0; i < this.commit_obj.cdns.length; i++) {
        if (this.commit_obj.cdns[i].url == row.url) {
          this.commit_obj.cdns.splice(i, 1);
        }
      }
    },
    handleCDNCreate() {
      this.dialogAppendCDNVisible = true;
      this.reset_cdn();
    },
    changeType() {
      this.pagination = {
        page: 1,
        count: 0,
        page_size: 10
      };
      this.init();
    },
    clearType() {
      this.pagination = {
        page: 1,
        count: 0,
        page_size: 10
      };
      this.init();
    }
  }
};
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
