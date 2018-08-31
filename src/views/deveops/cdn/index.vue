<template>
  <div class="manager-host-container">
    <div class="filter-container">
      <el-row style="margin-bottom:20px;">
        <el-select v-model="search_obj.group" placeholder="请选择" @change="changeGroup" filterable clearable style="width: 400px;">
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
        <el-button class="filter-item" @click="handleCreate()" style="float:right;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>
      </el-row>
      <el-row v-show="detailSearch" style="margin-bottom:20px;">
        <el-col :span="7" :offset="1">
          外网解析： <el-input style="width: 200px;" v-model="search_obj.dig" class="filter-item" placeholder="精准搜索外网解析"></el-input>
        </el-col>
        <el-col :span="7">
          内网解析： <el-input style="width: 200px;" v-model="search_obj.inner_dig" class="filter-item" placeholder="精准搜索内网解析"></el-input>
        </el-col>
        <el-col :span="7">
          域名： <el-input style="width: 200px;" v-model="search_obj.url" class="filter-item" placeholder="模糊搜索域名"></el-input>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDNSVisible" width="60%" top="2vh">
      <el-form :rules="rules" ref="cdnForm" :model="commit_obj" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>

        <el-form-item label="域名" prop="url">
          <el-tooltip content="请输入该域名 如op.8531.cn" placement="top" effect="light">
            <el-input v-model="commit_obj.url"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="公网解析" prop="dig">
          <el-tooltip content="请输入该域名的公网解析" placement="top" effect="light">
            <el-input v-model="commit_obj.dig"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="私网解析" prop="inner_dig">
          <el-tooltip content="请输入该域名的私网解析" placement="top" effect="light">
            <el-input v-model="commit_obj.inner_dig"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="所属应用组" prop="group">
          <el-select v-model="commit_obj.group" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in groups"
              :key="item.label"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDNSVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createDNS" :disabled="btnStatus">创建</el-button>
        <el-button v-else type="primary" @click="updateDNS" :disabled="btnStatus">更新</el-button>
      </div>
    </el-dialog>

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
      dialogDNSVisible: false,
      pagination: {
        page: 1,
        count: 0
      },
      textMap: {
        create: "新建CDN刷新"
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
      commit_obj: {},
      detailSearch: null,
      rules: {
        name: [
          { required: true, message: "分域名名称是必须的", trigger: "blur" }
        ]
      }
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
      this.commit_obj = {};
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
      this.dialogDNSVisible = true;
    },
    createCDN() {
      this.$refs["dnsForm"].validate(valid => {
        if (valid) {
          this.btnStatus = true;
          create_DNS(this.commit_obj)
            .then(() => {
              this.reset_search();
              this.init();
              this.dialogDNSVisible = false;
              this.$message({
                showClose: true,
                message: "创建成功",
                type: "success"
              });
              this.btnStatus = false;
            })
            .catch(error => {
              this.btnStatus = false;
              this.dialogDNSVisible = false;
            });
        }
      });
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
