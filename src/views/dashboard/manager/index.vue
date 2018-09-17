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
              <div class="p-name">信息安全与运维中心 开发自运维平台 监控中心</div>
              <div class="p-who">本页面基于资产信息整合、任务执行以及巡检结果</div>
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
            <template v-for="e in event">
              <div class="row-work-list" :key="e.uuid">
              <el-row>
                <el-col :span="1">
                  <img class="p-logo" :src="logo" alt="logo">
                </el-col>
                <el-col :span="23">
                  <div class="p-name" v-if="e.type===1">{{ e.user }} 修改了 <span>{{ e.host }}</span> 资产信息</div>
                  <div class="p-name" v-else-if="e.type===2">{{ e.user }} 在 <span>{{ e.group }}</span> 发起工单 <span>{{ e.work }}</span></div>
                  <div class="p-name" v-else-if="e.type===3">{{ e.user }} 巡检发现 <span>{{ e.group }}</span> 的主机 <span>{{ e.host }}</span> 出现问题</div>
                  <div class="p-time">{{ e.time }}</div>
                </el-col>
              </el-row>
            </div>
            </template>
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
import IEcharts from 'vue-echarts-v3/src/lite.js'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import { fetch_SystemStatus } from '@/api/dashboard'
import logo from '@/assets/show.png'
import Awesome from "@/components/Awesome/index"
export default {
  data () {
    return {
      loading: false,
      systype: {
      },
      event:[
        {
          type: 1, //信息修改类
          uuid: '4064a7e3ff99410a951d575aac8d7e10',
          user: '徐晨亮',
          host: 'act3.xmtCloudProd.com',
          info: '修改了资产信息',
          time: '2018-8-24 17:09'
        },{
          type: 2, //工单类
          uuid: 'e45799a0aa444c288fe516e42b0fe402',
          user: '汪子哲',
          group: '[预发布]浙江新闻',
          info: '发起了工单',
          work: '[预发布]更新浙江新闻Task',
          time: '2018-8-24 17:09'
        },{
          type: 3,
          uuid: "93f0f0deb7014f1fab796a44f5eda648",
          user: 'devEops平台',
          host: 'act3.xmtCloudProd.com',
          time: '2018-8-24 17:09'
        },{
          type: 3,
          uuid: "93f0f0deb7014f1fab796a44f5eda648",
          user: 'devEops平台',
          host: 'act3.xmtCloudProd.com',
          time: '2018-8-24 17:09'
        },{
          type: 3,
          uuid: "93f0f0deb7014f1fab796a44f5eda648",
          user: 'devEops平台',
          host: 'act3.xmtCloudProd.com',
          time: '2018-8-24 17:09'
        },{
          type: 3,
          uuid: "93f0f0deb7014f1fab796a44f5eda648",
          user: 'devEops平台',
          host: 'act3.xmtCloudProd.com',
          time: '2018-8-24 17:09'
        },{
          type: 3,
          uuid: "93f0f0deb7014f1fab796a44f5eda648",
          user: 'devEops平台',
          host: 'act3.xmtCloudProd.com',
          time: '2018-8-24 17:09'
        },{
          type: 3,
          uuid: "93f0f0deb7014f1fab796a44f5eda648",
          user: 'devEops平台',
          host: 'act3.xmtCloudProd.com',
          time: '2018-8-24 17:09'
        }
      ],
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
