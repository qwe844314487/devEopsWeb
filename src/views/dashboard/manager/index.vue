<template>
    <div class="login-container">
        <el-row>
            <el-col :span="5">
                <div class="m-border-box">
                    <div class="circle-1">
                            <icon class="ypt-icon" name="server" style="font-size: 200px;"></icon>
                    </div>
                    <div class="number">7</div>
                    <span class="text-gray">接管应用组总数</span>
                </div>
            </el-col>
            <el-col :offset="1" :span="5">
                <div class="m-border-box">
                    <div class="circle-1">
                            <icon class="ypt-icon" name="laptop" style="font-size: 200px;"></icon>
                    </div>
                    <div class="number">1036</div>
                    <span class="text-gray">接管主机总数</span>
                </div>
            </el-col>
            <el-col :offset="1" :span="5">
                <div class="m-border-box">
                    <div class="circle-1">
                            <icon class="ypt-icon" name="crosshairs" style="font-size: 200px;"></icon>
                    </div>
                    <div class="number">78</div>
                    <span class="text-gray">工单总数</span>
                </div>
            </el-col>
            <el-col :offset="1" :span="5">
                <div class="m-border-box">
                    <div class="circle-1">
                            <icon class="ypt-icon" name="internet-explorer" style="font-size: 200px;"></icon>
                    </div>
                    <div class="number">34</div>
                    <span class="text-gray">接管域名</span>
                </div>
            </el-col>
        </el-row>
        <el-row>
        <el-col :span="12">
          <div class="cpu m-border-box">
            <IEcharts
              :option="monitor_obj.CPU"
              :loading="monitorLoading"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="cpu m-border-box">
            <IEcharts
              :option="monitor_obj.CPU"
              :loading="monitorLoading"
            />
          </div>
        </el-col>
        </el-row>
    </div>
</template>

<script>
  import IEcharts from 'vue-echarts-v3/src/lite.js';
    import 'echarts/lib/chart/bar';
    import 'echarts/lib/chart/line';
    import 'echarts/lib/component/title';
    import { fetch_MonitorHostAliyunCPU,fetch_MonitorHostAliyunMemory,fetch_MonitorHostAliyunDiskRead,fetch_MonitorHostAliyunInternetIn } from '@/api/monitor';
    export default {
      name: "login",
      components: {
        IEcharts
      },
        data (){
          return {
            monitorLoading: true,
            monitor_obj:{
            }
          }
        },
        created(){
            fetch_MonitorHostAliyunCPU('a60e72e7-1c87-4fcc-8d84-d165a977c5c0', 1).then((response)=>{
                console.log(response.data)
                this.monitor_obj.CPU = response.data
                this.monitorLoading = false
            })
        },
        methods: {
        },
    }
</script>
<style scoped>
    .fa-icon{
        width: auto;
        height: 1em; 
        max-width: 100%;
        max-height: 100%;
    }
    .m-border-box{
        border:2px solid #0099CC;
        min-height: 58px;
        margin: 10px;
        padding: 20px;
        border-radius: 3px;
        color: #CCFFFF;
    }
    .m-border-box .label{
        font-size: 14px;
    }
    .m-border-box .number{
        margin-bottom: 6px;
        font-size: 20px;
        margin-top: 10px;
    }
    .circle-1{
        float: left;
        width: 60px;
        height: 60px;
        margin-right: 15px;
        line-height: 60px;
        text-align: center;
        background-color:transparent;
    }
    .ypt-icon{
        font-size: 40px;
        color: #fff;
    }
    .line-chart{
        width: 100%;
        height: 198px;
    }
    .cpu {
    width: 600px;
    height: 400px;
  }
</style>
<style rel="stylesheet/scss" lang="scss">
//   $bg:#2d3a4b;

  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    // background-color: $bg;
    background: url('~@/assets/dashboard.jpg') no-repeat;
    // background-size: 
    // background: 
    // -webkit-filter: blur(2px);
    // -moz-filter: blur(2px);
    // -ms-filter: blur(2px);
    // -o-filter: blur(2px);
    // filter: blur(2px);  
  }
</style>
