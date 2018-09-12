<template>
  <div class="dashboard-editor-container">
    <el-row>
      <el-col :span="24">
        <el-card class="box-card" shadow="always">
          <el-row style="margin-bottom:10px;">
            <el-col :offset="8" :span="3">
              <awesome :awesclass="'search'"></awesome>
            </el-col>
            <el-col :span="6">
              <h1 class="ip-title">IP信息检索</h1>
            </el-col>
            <el-col :span="6">
              <h5 class="ip-title-rule">检索范围包括 实例IP、出口IP、外网IP、负载均衡IP</h5>
            </el-col>
          </el-row>
          <el-row>
            <el-col :offset="6" :span="4">
              <el-form ref="searchForm" :model="search_obj" label-position="left" label-width="80px" style='width: 500px; margin-left:40px;'>
                <el-form-item label="检索IP" prop="ip">
                  <el-tooltip content="请输入需要检索的IP" placement="bottom" effect="light">
                    <el-input v-model="search_obj.ip"></el-input>
                  </el-tooltip>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :offset="5" :span="3">
              <el-button type="primary" @click="init()" :disabled="btnStatus" round>检索</el-button>
              <el-button @click="search_obj={};list=[]" :disabled="btnStatus" round>清空</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
                  <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                    style="width: 100%"
                    tooltip-effect="dark">
                    <el-table-column width="300px" align="center" label="IP地址">
                      <template slot-scope="search">
                        <span>{{ search.row.ip_address }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column width="250px" align="center" label="资源来源">
                      <template slot-scope="search">
                        <el-tag type="success">{{ optionTypeObj[search.row.type] }}</el-tag>
                      </template>
                    </el-table-column>

                    <el-table-column width="840px" align="center" label="相关再检索信息">
                      <template slot-scope="search">
                        <span>{{ search.row.info }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="pagination-container">
                    <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :total="pagination.count">
                    </el-pagination>
                  </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Awesome from "@/components/Awesome/index"
import { fetch_IPoolListByPage} from '@/api/ipool'
export default {
  data () {
    return {
      btnStatus:false,
      listLoading:false,
      search_obj: {},
      list:[],
      pagination: {
        page: 1,
        count: 0
      },
      optionTypeObj:{
        '1': '实例IP',
        '2': '负载均衡IP',
        '3': '阿里DNAT-IP',
        '4': '阿里SNAT-IP',
        '5': '阿里WAF-IP',
        '6': '阿里DDOS-IP'
      }
    }
  },
  components: {
    Awesome
  },
  created(){
  },
  methods:{
    init(){
        this.listLoading = true
        fetch_IPoolListByPage(this.pagination,this.search_obj).then(response =>{
          this.pagination.count = response.data.count
          this.list=response.data.results
          this.listLoading = false
        })
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.init()
    },                                                           
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
// .box-card {
  // height: 800px;
  // border: 5px solid #ebeef5;
// }
.fa-icon{
      color: #434e59;
      width: 10em;
      height: 10em;
}
.ip-title-rule{
  color: #434e59;
  margin-top: 70px;
  font-size: 15px
}
.ip-title{
  color: #434e59;
  margin-top: 50px;
  font-size: 50px;
}
  .dashboard-editor-container {
    padding: 15px;
    background-color: rgb(240, 242, 245);
  }
</style>
