<template>
<div class="y-background">
    <template>
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
    }
}
</script>
<style scoped>
    .y-background{
        height: 100%;
        width: 100%;
        background: url('~@/assets/dashboard.jpg')
    }
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
        border:1px solid #00FFFF;
        min-height: 58px;
        margin: 10px;
        padding: 20px;
        border-radius: 3px;
        color: #000000;
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
