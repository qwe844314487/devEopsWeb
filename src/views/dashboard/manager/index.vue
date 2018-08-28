<template>
    <div class="login-container">
        <el-row>
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
        </el-row>

        <!-- <el-row>

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
        </el-row> -->
    </div>
</template>

<script>
  import IEcharts from 'vue-echarts-v3/src/lite.js';
    import 'echarts/lib/chart/bar';
    import 'echarts/lib/chart/line';
    import 'echarts/lib/component/title';
    import Awesome from "@/components/Awesome/index";
    import { fetch_MonitorHostAliyunCPU,fetch_MonitorHostAliyunMemory,fetch_MonitorHostAliyunDiskRead,fetch_MonitorHostAliyunInternetIn } from '@/api/monitor';
    export default {
      name: "login",
        components: {
            IEcharts,Awesome
        },
        data (){
          return {
            monitorLoading: true,
            monitor_obj:{
            }
          }
        },
        created(){
            // fetch_MonitorHostAliyunCPU('a60e72e7-1c87-4fcc-8d84-d165a977c5c0', 1).then((response)=>{
            //     console.log(response.data)
            //     this.monitor_obj.CPU = response.data
            //     this.monitorLoading = false
            // })
        },
        methods: {
        },
    }
</script>
<style scoped>

</style>
<style rel="stylesheet/scss" lang="scss">
.number-card{
    .fa-icon{
      font-size: 50px;
      color:#409EFF;
      padding-top:15px;
    }
width: 800px;
	height: 400px;
	position: absolute;
	top: 50%;
	left: 50%;
	margin-top: -200px;
	margin-left: -400px;
	border-radius: 8px;
	box-shadow: 0 10px 20px rgba(0,0,0,0.5);
	overflow: hidden;
	z-index: 2;
	padding: 50px;
	box-sizing: border-box;
  }
  .number-card::before{
      content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	-webkit-filter: blur(5px);
	-moz-filter: blur(5px);
	-ms-filter: blur(5px);
	-o-filter: blur(5px);
	filter: blur(5px);
	z-index: -3;
	margin: -30px;
	background-image: url('~@/assets/dashboard.jpg');
	background-position: center top;
	background-size: cover;
	background-attachment: fixed;
  }
  .p-level-number{
    font-weight: bold;
    font-size: 20px;
  }

  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;	
    background-position: center top;
	background-size: cover;
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
