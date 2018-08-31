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
              <div class="p-name">早安，汪子哲，祝你身体健康，再见！</div>
              <div class="p-who">运维工程师 | 浙报集团－信息安全与运维中心－系统运维－301－ops</div>
            </el-col>
            <el-col :span="10" class="col-level">
              <el-row>
                <el-col :span="5" class="p-level">
                  <p class="p-level-title">主机数</p>
                  <p class="p-level-number">257</p>
                </el-col>
                <el-col :span="5" class="p-level">
                  <p class="p-level-title">项目数</p>
                  <p class="p-level-number">17</p>
                </el-col>
                <el-col :span="5" class="p-level">
                  <p class="p-level-title">虚拟平台</p>
                  <p class="p-level-number">2</p>
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
                      <p class="p-level-number">39</p>
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
                      <p class="p-level-number">18</p>
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
                      <p class="p-level-number">182</p>
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
                      <p class="p-level-number">19</p>
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
            <div key="1" class="row-work-list">
              <el-row>
                <el-col :span="1">
                  <img class="p-logo" :src="logo" alt="logo">
                </el-col>
                <el-col :span="23">
                  <div class="p-name">汪子哲 在 <span>[预发布]浙江新闻</span> 发起工单 <span>[预发布]更新浙江新闻Task</span> 并执行成功</div>
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
                  <div class="p-name">徐晨亮 在 <span>[测试]新媒体云服务平台</span> 修改了资产信息</div>
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
                  <div class="p-name">devEops平台 巡检发现 <span>[生产]24小时APP</span> 的主机出现<span>磁盘溢出</span></div>
                  <div class="p-time">2018-8-24 17:09</div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-row>
      </el-col>
      
      <el-col :span="8">
        <el-card >
             <div class="systype" stype="width: 600px;height: 400px;">
            <IEcharts
              :option="systype"
              :loading="loading"
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
import IEcharts from 'vue-echarts-v3/src/lite.js';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/title';
import { fetch_SystemStatus } from '@/api/dashboard';
import logo from '@/assets/wzz.jpg'
import Awesome from "@/components/Awesome/index";
export default {
  data () {
    return {
      loading: false,
      systype: {
      },
      logo,
    }
  },
  components: {
    IEcharts,Awesome
  },
  created(){
    this.init_systype()
  },
  methods:{
    init_systype(){
      this.systype= {
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
    }]
}
    }                                                                       
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.col-logo{
  height: 100%;
  .p-logo{
  height: 150px;
    width: 150px;
    border-radius:50%;
  }
}
.col-title{
  height: 100%;
  position: relative;
  line-height: 100%;
  .p-name{
    font-family: "Helvetica Neue";
    font-size: 25px;
    padding-top: 50px;
    padding-bottom: 25px;
    display: block;
  }
  .p-who{
    font-family: "Helvetica Neue";
    font-variant: tabular-nums;
    background-color: #fff;
    color: rgba(0,0,0,.45);
    display: block;
  }
}
.col-level{
  height: 100%;
  .p-level{
    padding-top: 30px;
    float: right;
    .p-level-title{
          color: rgba(0,0,0,.45);
    }
    .p-level-number{
      font-weight: bold;
      font-size: 30px;
      
    }
    p{
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
.row-system{
  padding-top:20px;
  .number-card{
    .fa-icon{
      font-size: 50px;
      color:#409EFF;
      padding-top:15px;
    }
    // background: #409EFF;
  }
  .p-level-number{
    font-weight: bold;
    font-size: 20px;
  }
}
.row-work{
  padding-top: 30px;
  .p-logo{
    height: 30px;
    width: 30px;
    border-radius:50%;
  }
  .p-name{
    font-family: "Helvetica Neue";
    font-size: 15px;
    display: block;
  }
  .p-time{
    font-family: "Helvetica Neue";
    font-variant: tabular-nums;
    background-color: #fff;
    color: rgba(0,0,0,.45);
    display: block;
  }
  .row-work-list{
    border-bottom:1px solid #e8e8e8;
    padding-left:20px;
    padding-top:10px;
    span{
      color:#409EFF;
    }
  }
}
  .dashboard-editor-container {
    padding: 15px;
    background-color: rgb(240, 242, 245);
  }
</style>
