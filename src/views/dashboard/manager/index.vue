<template>
<div>
    <template v-if="params.mp_id">
        <h2 class="u-title">账号整体情况</h2>
            <el-row>
                <el-col :span="6">
                    <div class="m-border-box" @click="openUserPage">
                    <div class="circle-1">
                        <span class="ypt-icon ypt-icon-account"></span>
                    </div>
                    <div class="number">123</div>
                    <span class="text-gray">微信粉丝总数</span>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="m-border-box" @click="openUserPage">
                    <div class="circle-2">
                        <span class="ypt-icon ypt-icon-thumbsup"></span>
                    </div>
                    <div class="number">456</div>
                    <span class="text-gray">昨日关注数</span>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="m-border-box" @click="openUserPage">
                    <div class="circle-3">
                        <span class="ypt-icon ypt-icon-thumbsup"></span>
                    </div>
                    <div class="number">789</div>
                    <span class="text-gray">昨日取消关注数</span>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="m-border-box u-cursor" @click="openMessagePage">
                    <div class="circle-4">
                        <span class="ypt-icon ypt-icon-emailbox"></span>
                    </div>
                    <div class="number">10112</div>
                    <span class="text-gray">新消息</span>
                    </div>
                </el-col>
            </el-row>
            <el-row class="u-padding-top-sm">
                <el-col :span="12">
                   
                    <div class="m-border-box">
                        <h2 class="u-title">活动详情</h2>
                        <el-row>
                            <el-col :span="8" class="u-text-center">
                                <u-pie :theme="'#efce05'" :percent="accountInfo.instance_living_percent" :text="accountInfo.instance_living"></u-pie>
                                <p class="text-gray">正在进行中的活动数</p>
                                <el-button type="text" @click="openActivityPage">
                                    <span class="ypt-icon ypt-icon-right1"></span>
                                </el-button>
                            </el-col>
                            <el-col :span="8" class="u-text-center">
                                <u-pie :theme="'#11b590'" :percent="accountInfo.instance_end_percent" :text="accountInfo.instance_end"></u-pie>
                                <p class="text-gray">已结束活动数</p>
                                <el-button type="text" @click="openActivityPage">
                                    <span class="ypt-icon ypt-icon-right1"></span>
                                </el-button>
                            </el-col>
                            <el-col :span="8" class="u-text-center">
                                <u-pie :theme="'#ea5358'" :percent="accountInfo.instance_not_start_percent" :text="accountInfo.instance_not_start"></u-pie>
                                <p class="text-gray">待开始活动数</p>
                                <el-button type="text" @click="openActivityPage">
                                    <span class="ypt-icon ypt-icon-right1"></span>
                                </el-button>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="m-border-box">
                        <h2 class="u-title">用户分析</h2>
                        <div class="line-chart">
                            <IEcharts :option="chartOptions"></IEcharts>
                        </div>
                    </div>
                </el-col>
            </el-row>
    </template>
    <template v-else>
        <div class="u-text-center u-padding-top-lg">
            <h2 class="u-margin-bottom-md no-bind">
                <img src="" alt=""><br>
                你当前还未绑定应用账号，请先绑定应用账号。
            </h2>
            <el-button class="u-btn" type="primary" @click="openCreatePage(1)">绑定APP</el-button>
            <el-button class="u-btn" type="primary" @click="openCreatePage(2)">绑定微信公众号</el-button>
        </div>
    </template>
</div>
</template>
<script>
import IEcharts from 'vue-echarts-v3/src/lite.js';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
export default{
    data(){
        return {
            params:{
                mp_id:1
            },
            accountInfo:{},
            chartOptions:{
                toolbox: {
                    show: false
                },
                tooltip: {
                    show: true,
                    formatter: '{b}<br/> {a}  &nbsp;&nbsp;    {c}',
                    padding:10
                },
                color:['#58ad1f','#36ade5','#104aba'],
                legend: {
                    x:'center',
                    y:'bottom',
                    icon: 'rect',
                    data:['新增用户', '取消关注用户','总用户数']
                },
                grid : {
                    top : 10, 
                    left:60,
                    bottom: 50
                },
                title: {
                    show:false,
                    text: '',
                    x: 'center'
                }
            }
        }
    },
    props: ['viewData'],
    watch: { //更新全局公众号id
        viewData: function(n, o) {
        if (n) {
               this.params.mp_id = n;
               this.init();
            }
        }
    },
    created(){
    //    this.getCurMpID();
    //    if(this.params.mp_id>0){
    //        this.init();
    //    }
    },
    components:{
        IEcharts
    },
    methods:{
        init(){
            this.requestAccountInfo();
            this.requestChartData();
        },
        /** 账号整体情况 */
        requestAccountInfo(){
            let vm = this;
            this.ajaxGet({
              url:'/api.php',
              data:{
                  m:'weixin',
                  subm:'homepage',
                  mp_id:this.params.mp_id
              },
              success(res){
                  let {instance_living,instance_end,instance_not_start} = res.data,total = instance_living+instance_end+instance_not_start;
                  vm.accountInfo=res.data;
                  if(total>0){
                      vm.accountInfo.instance_living_percent=instance_living*100/total;
                      vm.accountInfo.instance_end_percent=instance_end*100/total;
                      vm.accountInfo.instance_not_start_percent=instance_not_start*100/total;
                  }else{
                      vm.accountInfo.instance_living_percent=0;
                      vm.accountInfo.instance_end_percent=0;
                      vm.accountInfo.instance_not_start_percent=0;
                  }
              }
          })
        },
        /** 用户分析 */
        requestChartData(){
            let vm = this;
            this.ajaxGet({
              url:'/api.php',
              data:{
                  m:'weixin',
                  subm:'homepagestatistics',
                  mp_id:this.params.mp_id
              },
              success(res){
                    let chartData=res.data.list,xAxis=[],
                    series=[
                        {name:'新增用户',type:'line', data:[],symbol:'circle',symbolSize:4},
                        {name:'取消关注用户',type:'line',data:[],symbol:'circle',symbolSize:4},
                        {name:'总用户数',type:'line',data:[],symbol:'circle',symbolSize:4}];
                    for(let i=0,len=chartData.length;i<len;i++){
                        let item=chartData[i];
                        xAxis.push(item.pdate);
                        series[0].data.push(item.new_user);
                        series[1].data.push(item.cancel_user);
                        series[2].data.push(item.total_user);
                    }
                    vm.$set(vm.chartOptions,'xAxis',{data:xAxis,type:'category',name:'',axisLabel:{
                    interval:0,
                    formatter:function(value,index){
                        let len = xAxis.length;
                        return index%(Math.floor(len/3))==0? value:''
                    }
                }});
                    vm.$set(vm.chartOptions,'yAxis',{type:'value',name:'',minInterval: 1});
                    vm.$set(vm.chartOptions,'series',series||[]);
              }
          })
        },
        /** [getCurMpID description]获取当前的mpid */
        getCurMpID() {
            this.params.mp_id = store.state.mpid;
        },
        openCreatePage(type){
            let vm = this;
            this.$emit('viewIn',function(){
                vm.$router.replace({
                   name:type==1?'createApp':'createAccount'
                });
            });
            
       },
       /** 打开消息中心 */
       openMessagePage(){
           this.$router.push({
               name:'Message'
           })
       },
       /** 打开用户页面 */
       openUserPage(){
           this.$router.push({
               name:'Wechat'
           });
       },
       /** 打开活动页面 */
       openActivityPage(){
           this.$router.push({
               name:'createActivity'
           })
       }
    }
}
</script>
<style scoped>
    .u-btn{
        width: 166px;
        margin:0 15px;
    }
    .no-bind{
        text-align: center;
        color: #595959;
    }
    .u-title{
        padding-left:6px;
        color: #000;
        margin-top: 0px;
        margin-bottom: 10px;
    }
    .m-border-box{
        border:1px solid #efefef;
        min-height: 58px;
        margin: 10px;
        padding: 20px;
        border-radius: 3px;
        color: #aaa;
    }
    .m-border-box .label{
        font-size: 14px;
    }
    .m-border-box .number{
        margin-bottom: 6px;
        font-size: 20px;
        margin-top: 10px;
    }
    .m-border-box .ypt-icon-right1{
        color: #505050 !important;
    }
    .circle-1,.circle-2,.circle-3,.circle-4{
        float: left;
        width: 60px;
        height: 60px;
        margin-right: 15px;
        line-height: 60px;
        text-align: center;
    }
    .circle-1{
        background: #4987ff;
    }
    .circle-2{
        background: #67c6a6;
    }
    .circle-3{
        transform: rotate(180deg);
        background: #ffb321;
    }
    .circle-4{
        background: #f8656b;
    }
    .ypt-icon{
        font-size: 40px;
        color: #fff;
    }
    .line-chart{
        width: 100%;
        height: 198px;
    }
    .el-button .ypt-icon{
        color: #4786ff;
    }
</style>
