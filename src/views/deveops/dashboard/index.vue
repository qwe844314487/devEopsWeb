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
              <div class="p-name">早安，{{ name }}，祝你身体健康，再见！(Demo)</div>
              <div class="p-who">{{ info }}</div>
            </el-col>
            <el-col :span="10" class="col-level">
              <el-row>
                <el-col :span="5" class="p-level">
                  <p class="p-level-title">主机数</p>
                  <p class="p-level-number">{{ count.HOST_COUNT }}</p>
                </el-col>
                <el-col :span="5" class="p-level">
                  <p class="p-level-title">项目数</p>
                  <p class="p-level-number">{{ count.GROUP_COUNT }}</p>
                </el-col>
                <el-col :span="5" class="p-level">
                  <p class="p-level-title">虚拟化平台</p>
                  <p class="p-level-number">3</p>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="row-system" :gutter="30">
      <el-col :span="16">
        <el-row>
            <el-card>
              <el-row :gutter="20">
                <el-col :span="6">
                  <el-card class="number-card">
                    <el-row>
                      <el-col :span="12">
                        <awesome :awesclass="'codepen'"></awesome>
                      </el-col>
                    <el-col :span="12">
                      <p class="p-level-title">接管域名</p>
                      <p class="p-level-number">{{ count.DNS_COUNT }}</p>
                    </el-col>
                    </el-row>
                  </el-card>
                </el-col>
                <el-col :span="6">
                  <el-card class="number-card">
                  <el-row>
                      <el-col :span="12">
                        <awesome :awesclass="'database'"></awesome>
                      </el-col>
                    <el-col :span="12">
                      <p class="p-level-title">数据库实例</p>
                      <p class="p-level-number">{{ count.DBINSTANCE_COUNT }}</p>
                    </el-col>
                    </el-row>
                  </el-card>
                </el-col>
                <el-col :span="6">
                  <el-card class="number-card">
                  <el-row>
                      <el-col :span="12">
                        <awesome :awesclass="'file-code-o'"></awesome>
                      </el-col>
                    <el-col :span="12">
                      <p class="p-level-title">分发文件</p>
                      <p class="p-level-number">{{ count.FILE_COUNT }}</p>
                    </el-col>
                    </el-row>
                  </el-card>
                </el-col>
                <el-col :span="6">
                  <el-card class="number-card">
                  <el-row>
                      <el-col :span="12">
                        <awesome :awesclass="'street-view'"></awesome>
                      </el-col>
                    <el-col :span="12">
                      <p class="p-level-title">用户</p>
                      <p class="p-level-number">{{ count.USER_COUNT }}</p>
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
              <span>平台事件</span>
            </div>
            <template v-for="timeline in timelines">
              <div :key="timeline.id" class="row-work-list">
                <el-row>
                  <el-col :span="1">
                    <img class="p-logo" :src="logo" alt="logo">
                  </el-col>
                  <el-col :span="23">
                    <div class="p-name" v-html="timelineFilter(timeline.msg)"></div>
                    <!-- <div class="p-name">汪子哲 在 <span>[预发布]浙江新闻</span> 发起工单 <span>[预发布]更新浙江新闻Task</span> 并执行成功</div> -->
                    <!-- <div class="p-time">2018-8-24 17:09</div> -->
                    <div class="p-time">{{ timeline.time | timeFilter}}</div>
                  </el-col>
                </el-row>
              </div>
            </template>
              <!-- <el-pagination
                layout="prev,next"
                @current-change="handleCurrentChange" 
                :total="pagination.count"
                :page-sizes="pagination.page_size"
                >
              </el-pagination> -->
              <el-pagination background layout="total, prev, pager, next, jumper" 
              @current-change="handleCurrentChange" 
              :page-size="6"
              :total="pagination.count">
              </el-pagination>
          </el-card>
        </el-row>
      </el-col>
    
      <el-col :span="8">
        <el-row>
          <el-card>
             <div class="systype">
            <IEcharts
              :option="week_obj"
              :loading="loading"
            />
          </div>
        </el-card>
        </el-row>
        <el-row style="padding-top: 30px;">
          <el-card>
              <div class="test">
              <IEcharts
                :option="group_obj"
                :loading="loading"
              />
            </div>
          </el-card>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import echarts from 'echarts';
// import Echarts from '@/components/Echarts/index';
import IEcharts from "vue-echarts-v3/src/lite.js";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import "echarts/lib/component/title";
import { fetch_TimelineByPage } from "@/api/timeline";
import { fetch_Count, fetch_Work, fetch_Group } from "@/api/dashboard";
import logo from "@/assets/wzz.jpg";
import Awesome from "@/components/Awesome/index";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      loading: false,
      timelines: [],
      logo,
      count: {},
      pagination: {
        page: 1,
        count: 0,
        page_size: 5
      },
      week_obj: {},
      group_obj: {},
      week_option: {
        title: {
          text: ""
        },
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
          dimensions: ["time", "执行次数"],
          source: [
            { time: "周一", 执行次数: 43.3 },
            { time: "周二", 执行次数: 83.1 },
            { time: "周四", 执行次数: 86.4 },
            { time: "周五", 执行次数: 72.4 }
          ]
        },
        xAxis: { type: "category" },
        yAxis: [{ scale: true }],
        series: [
          {
            type: "bar",
            smooth: true,
            seriesLayoutBy: "row"
          }
        ]
      },
      group_option: {
        title: {
          text: ""
        },
        tooltip: {
          trigger: 'item'
        },
        dataset: {
          source: [
            ['product', '2012',],
            ['Matcha Latte', 41.1,],
            ['Milk Tea', 86.5,],
            ['Cheese Cocoa', 24.1, ],
            ['Walnut Brownie', 55.2,]
          ]
        },
        series: [
          {
            type: "pie"
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["name","info"])
  },
  components: {
    IEcharts,
    Awesome
  },
  created() {
    this.init_timelines()
    this.init_work()
    this.init_count()
    this.init_group()
  },
  filters: {
    timeFilter(timeformat) {
      if (timeformat) {
        const date = timeformat.split("T")
        const time = date[1].split(".")
        return date[0] + " " + time[0]
      } else {
        return ""
      }
    }
  },
  methods: {
    init_timelines() {
      fetch_TimelineByPage(this.pagination).then(response => {
        this.pagination.count = response.data.count
        this.timelines = response.data.results
      })
    },
    init_group(){
      fetch_Group().then(response => {
        this.group_obj = JSON.parse(JSON.stringify(this.group_option))
        this.group_obj.dataset.source = response.data.dataset
        this.group_obj.title.text = response.data.title
      })
    },
    init_work() {
      fetch_Work().then(response => {
        this.week_obj = JSON.parse(JSON.stringify(this.week_option))
        this.week_obj.dataset.source = response.data.dataset
        this.week_obj.title.text = response.data.title
      })
    },
    init_count() {
      fetch_Count().then(response => {
        this.count = response.data
      })
    },
    timelineFilter(timeline) {
      return timeline
        .replace(/%1/g, '<span class="blue">')
        .replace(/%2/g, "</span>")
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.init_timelines()
    }
  }
};
</script>
<style>
.row-work-list .blue {
  color: #409eff;
  font-size: 17px;
}
</style>

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
}
.row-work {
  padding-top: 30px;
  .p-logo {
    height: 30px;
    width: 30px;
    border-radius: 50%;
    margin-top: 5px;
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
    margin-top: 5px;
  }
  .row-work-list {
    border-bottom: 1px solid #e8e8e8;
    padding-left: 20px;
    padding-top: 10px;
  }
}
.dashboard-editor-container {
  padding: 15px;
  background-color: rgb(240, 242, 245);
}

.systype {
  // width: 600px;
  height: 400px;
}
.test {
  height: 180px;
}
</style>
