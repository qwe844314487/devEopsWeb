<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="20">
      <el-col :span="8">
          <el-card>
          <div slot="header" class="clearfix">
            <span>CPU使用率</span>
          </div>
          <div class="cpu">
            <IEcharts
              group="123"
              :option="monitor_obj.CPU"
              :loading="monitorLoading"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
          <el-card>
          <div slot="header" class="clearfix">
            <span>QPS</span>
          </div>
          <div class="cpu">
            <IEcharts
              group="123"
              :option="monitor_obj.CPU"
              :loading="monitorLoading"
            />
          </div>
        </el-card>
      </el-col>
            <el-col :span="8">
          <el-card>
          <div slot="header" class="clearfix">
            <span>内存</span>
          </div>
          <div class="cpu">
            <IEcharts
              group="123"
              :option="monitor_obj.CPU"
              :loading="monitorLoading"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
        <el-row :gutter="20">
      <el-col :span="8">
          <el-card>
          <div slot="header" class="clearfix">
            <span>CPU使用率</span>
          </div>
          <div class="cpu">
            <IEcharts
              group="123"
              :option="monitor_obj.CPU"
              :loading="monitorLoading"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
          <el-card>
          <div slot="header" class="clearfix">
            <span>QPS</span>
          </div>
          <div class="cpu">
            <IEcharts
              group="123"
              :option="monitor_obj.CPU"
              :loading="monitorLoading"
            />
          </div>
        </el-card>
      </el-col>
            <el-col :span="8">
          <el-card>
          <div slot="header" class="clearfix">
            <span>内存</span>
          </div>
          <div class="cpu">
            <IEcharts
              group="123"
              :option="monitor_obj.CPU"
              :loading="monitorLoading"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
        <el-row :gutter="20">
      <el-col :span="8">
          <el-card>
          <div slot="header" class="clearfix">
            <span>CPU使用率</span>
          </div>
          <div class="cpu">
            <IEcharts
              group="123"
              :option="monitor_obj.CPU"
              :loading="monitorLoading"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
          <el-card>
          <div slot="header" class="clearfix">
            <span>QPS</span>
          </div>
          <div class="cpu">
            <IEcharts
              group="123"
              :option="monitor_obj.CPU"
              :loading="monitorLoading"
            />
          </div>
        </el-card>
      </el-col>
            <el-col :span="8">
          <el-card>
          <div slot="header" class="clearfix">
            <span>内存</span>
          </div>
          <div class="cpu">
            <IEcharts
              group="123"
              :option="monitor_obj.CPU"
              :loading="monitorLoading"
            />
          </div>
        </el-card>
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
import logo from "@/assets/zdb.png";
import echarts from "echarts";
import Awesome from "@/components/Awesome/index";
export default {
  data() {
    return {
      loading: false,
      data: [
        ["2000-06-05", 116],
        ["2000-06-06", 129],
        ["2000-06-07", 135],
        ["2000-06-08", 86],
        ["2000-06-09", 73],
        ["2000-06-10", 85],
        ["2000-06-11", 73],
        ["2000-06-12", 68],
        ["2000-06-13", 92],
        ["2000-06-14", 130],
        ["2000-06-15", 245],
        ["2000-06-16", 139],
        ["2000-06-17", 115],
        ["2000-06-18", 111],
        ["2000-06-19", 309],
        ["2000-06-20", 206],
        ["2000-06-21", 137],
        ["2000-06-22", 128],
        ["2000-06-23", 85],
        ["2000-06-24", 94],
        ["2000-06-25", 71],
        ["2000-06-26", 106],
        ["2000-06-27", 84],
        ["2000-06-28", 93],
        ["2000-06-29", 85],
        ["2000-06-30", 73],
        ["2000-07-01", 83],
        ["2000-07-02", 125],
        ["2000-07-03", 107],
        ["2000-07-04", 82],
        ["2000-07-05", 44],
        ["2000-07-06", 72],
        ["2000-07-07", 106],
        ["2000-07-08", 107],
        ["2000-07-09", 66],
        ["2000-07-10", 91],
        ["2000-07-11", 92],
        ["2000-07-12", 113],
        ["2000-07-13", 107],
        ["2000-07-14", 131],
        ["2000-07-15", 111],
        ["2000-07-16", 64],
        ["2000-07-17", 69],
        ["2000-07-18", 88],
        ["2000-07-19", 77],
        ["2000-07-20", 83],
        ["2000-07-21", 111],
        ["2000-07-22", 57],
        ["2000-07-23", 55],
        ["2000-07-24", 60]
      ],
      monitor_obj: {
        CPU: {
          tooltip: {
            trigger: "axis"
          },
          xAxis: {
            data: []
          },
          yAxis: {
            splitLine: { show: false }
          },
          series: {
            type: "line",
            showSymbol: false,
            data: []
          }
        }
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
    echarts.connect("123");
    this.init();
  },
  methods: {
    init() {
      this.monitorFlag = 0;
      this.monitorLoading = true;
      let dataList = this.data.map(function(item) {
        return item[1];
      });
      let valueList = this.data.map(function (item) {
          return item[1];
      });
      this.monitor_obj.CPU.series.data = valueList
      this.monitor_obj.CPU.xAxis.data = dataList
      this.monitorLoading = false;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 15px;
  height: 100%;
  background-color: rgb(240, 242, 245);
}
.el-row{
  margin-bottom: 20px;
}
.cpu {
  width: 540px;
  height: 400px;
}
</style>
