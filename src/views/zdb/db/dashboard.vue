<template>
  <div class="dashboard-editor-container">
    <el-row class="row-person">
      <el-col :span="24">
        <el-card class="box-card" shadow="always">
          <el-row>
            <el-col :span="3" class="col-logo">
              <img class="p-logo" :src="logo" alt="logo">
            </el-col>
            <el-col :span="11" class="col-title">
              <!-- <span style="vertical-align: bottom;">123</span> -->
              <div class="p-name">实例名称 <span>新媒体云服务平台生产实例</span> </div>
              <div class="p-who">实例ID {{ $route.params.id }} | 信息安全运维中心 - ZDB数据库管理平台为您服务</div>
            </el-col>
            <el-col :span="10" class="col-level">
              <el-row>
                <el-col :span="5" class="p-level">
                  <p class="p-level-title">IOPS</p>
                  <p class="p-level-number">257</p>
                </el-col>
                <el-col :span="5" class="p-level">
                  <p class="p-level-title">CPU</p>
                  <p class="p-level-number">17%</p>
                </el-col>
                <el-col :span="5" class="p-level">
                  <p class="p-level-title">存储空间</p>
                  <p class="p-level-number">2%</p>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="row-system" :gutter="30">
      <el-col :span="14">
        <el-row>
            <el-card>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-card class="number-card">
                  <el-row>
                      <el-col :span="12">
                        <awesome :awesclass="'database'"></awesome>
                      </el-col>
                    <el-col :span="12">
                      <p class="p-level-title">数据库个数</p>
                      <p class="p-level-number">2</p>
                    </el-col>
                    </el-row>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card class="number-card">
                  <el-row>
                      <el-col :span="12">
                        <awesome :awesclass="'file-code-o'"></awesome>
                      </el-col>
                    <el-col :span="12">
                      <p class="p-level-title">已执行工单</p>
                      <p class="p-level-number">76</p>
                    </el-col>
                    </el-row>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card class="number-card">
                  <el-row>
                      <el-col :span="12">
                        <awesome :awesclass="'street-view'"></awesome>
                      </el-col>
                    <el-col :span="12">
                      <p class="p-level-title">实例角色</p>
                      <p class="p-level-number">2</p>
                    </el-col>
                    </el-row>
                  </el-card>
                </el-col>
              </el-row>
            </el-card>
        </el-row>
        <el-row class="row-work">
          <el-card>
            <div slot="header" class="clearfix">
              <span>ZDB事件</span>
            </div>
            <div key="4" class="row-work-list">
              <el-row>
                <el-col :span="1">
                  <img class="p-logo" :src="logo" alt="logo">
                </el-col>
                <el-col :span="23">
                  <div class="p-name">徐晨亮 审核通过 在 <span>[预发布]浙江新闻</span> 数据库 <span>工单</span> 执行失败 建议回滚</div>
                  <div class="p-time">2018-8-24 17:09</div>
                </el-col>
              </el-row>
            </div>
            <div key="1" class="row-work-list">
              <el-row>
                <el-col :span="1">
                  <img class="p-logo" :src="logo" alt="logo">
                </el-col>
                <el-col :span="23">
                  <div class="p-name">徐晨亮 审核通过 在 <span>[预发布]浙江新闻</span> 数据库 <span>工单</span> 并执行成功</div>
                  <div class="p-time">2018-8-24 17:09</div>
                </el-col>
              </el-row>
            </div>
            <div key="2" class="row-work-list">
              <el-row>
                <el-col :span="1">
                  <img class="p-logo" :src="logo" alt="logo">
                </el-col>
                <el-col :span="23">
                  <div class="p-name">汪子哲 在 <span>[预发布]浙江新闻</span> 提交SQL执行工单</div>
                  <div class="p-time">2018-8-24 17:09</div>   
                </el-col>
              </el-row>
            </div>
            <div key="3" class="row-work-list">
              <el-row>
                <el-col :span="1">
                  <img class="p-logo" :src="logo" alt="logo">
                </el-col>
                <el-col :span="23">
                  <div class="p-name">ZDB数据管理平台 巡检发现 <span>[预发布]浙江新闻</span> 数据库存在 <span>数据库吞吐量异常</span></div>
                  <div class="p-time">2018-8-24 17:09</div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-row>
      </el-col>
      
      <el-col :span="10">
        <el-card>
          <div slot="header" class="clearfix">
            <span>工单执行</span>
          </div>
          <div class="cpu">
            <IEcharts
              :option="monitor_obj.CPU"
              :loading="monitorLoading"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>



    <!-- <el-card class="box-card">
      <el-row>
        <el-col :span="5" :offset="1">
       
        </el-col>
      </el-row>
    </el-card> -->


    <!-- <el-row>
      <el-col :span="12" :offset="1">
        <el-card class="box-card">
        </el-card>
      </el-col>
        <el-col :span="6" :offset="1">
          <el-card class=box-card>
              <el-carousel height="300px">
                <el-carousel-item>
                  <h1>量化</h1>
                </el-carousel-item>
                <el-carousel-item>
                  <h1>可视化</h1>
                </el-carousel-item>
                <el-carousel-item>
                  <h1>自动化</h1>
                </el-carousel-item>
            </el-carousel>
          </el-card>
        </el-col>
    </el-row> -->
  </div>
</template>

<script>
// import echarts from 'echarts';
// import Echarts from '@/components/Echarts/index';
import IEcharts from "vue-echarts-v3/src/lite.js";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import "echarts/lib/component/title";
import { fetch_SystemStatus } from "@/api/dashboard";
import logo from "@/assets/zdb.png";
import Awesome from "@/components/Awesome/index";
import {
  fetch_MonitorHostAliyunCPU,
  fetch_MonitorHostAliyunMemory,
  fetch_MonitorHostAliyunDiskRead,
  fetch_MonitorHostAliyunInternetIn
} from "@/api/monitor";
export default {
  data() {
    return {
      loading: false,
      monitor_obj: {
        CPU: {}
      },
      monitorLoading: false,
      logo
    };
  },
  components: {
    IEcharts,
    Awesome
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.monitorFlag = 0;
      this.monitorLoading = true;
      this.monitor_obj.CPU = {
        legend: {},
        tooltip: {},
        dataset: {
          // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
          // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射，参见后文。
          dimensions: ["product", "2015", "2016", "2017"],
          source: [
            {
              product: "Matcha Latte",
              "2015": 43.3,
              "2016": 85.8,
              "2017": 93.7
            },
            { 
              product: "Milk Tea", 
              "2015": 83.1, 
              "2016": 73.4, 
              "2017": 55.1 
            },
            {
              product: "Cheese Cocoa",
              "2015": 86.4,
              "2016": 65.2,
              "2017": 82.5
            },
            {
              product: "Walnut Brownie",
              "2015": 72.4,
              "2016": 53.9,
              "2017": 39.1
            }
          ]
        },
        xAxis: { type: "category" },
        yAxis: {},
        series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }]
      }
      this.monitorLoading = false;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.col-logo {
  height: 100%;
  .p-logo {
    height: 150px;
    width: 150px;
    border-radius: 50%;
  }
}
.col-title {
  height: 100%;
  position: relative;
  line-height: 100%;
  .p-name {
    font-family: "Helvetica Neue";
    font-size: 25px;
    padding-top: 50px;
    padding-bottom: 25px;
    display: block;
    span {
      color: #409eff;
    }
  }
  .p-who {
    font-family: "Helvetica Neue";
    font-variant: tabular-nums;
    background-color: #fff;
    color: rgba(0, 0, 0, 0.45);
    display: block;
  }
}
.col-level {
  height: 100%;
  .p-level {
    padding-top: 30px;
    float: right;
    .p-level-title {
      color: rgba(0, 0, 0, 0.45);
    }
    .p-level-number {
      font-weight: bold;
      font-size: 30px;
    }
    p {
      text-align: center;
      margin-top: 0;
      margin-bottom: 1em;
    }
  }
}

.box-card {
  height: 180px;
  // border: 5px solid #ebeef5;
}

.row-system {
  padding-top: 20px;
  .number-card {
    .fa-icon {
      font-size: 50px;
      color: #409eff;
      padding-top: 15px;
    }
    // background: #409EFF;
  }
  .p-level-number {
    font-weight: bold;
    font-size: 20px;
  }
  .cpu {
    width: 600px;
    height: 400px;
  }
}

.row-work {
  padding-top: 30px;
  .p-logo {
    height: 30px;
    width: 30px;
    border-radius: 50%;
  }
  .p-name {
    font-family: "Helvetica Neue";
    font-size: 15px;
    display: block;
  }
  .p-time {
    font-family: "Helvetica Neue";
    font-variant: tabular-nums;
    background-color: #fff;
    color: rgba(0, 0, 0, 0.45);
    display: block;
  }
  .row-work-list {
    border-bottom: 1px solid #e8e8e8;
    padding-left: 20px;
    padding-top: 10px;
    span {
      color: #409eff;
    }
  }
}
.dashboard-editor-container {
  padding: 15px;
  height: 100%;
  background-color: rgb(240, 242, 245);
}
</style>
