<template>
  <el-menu
  default-active="1"
  class="el-menu-demo"
  mode="horizontal"
  background-color="#545c64"
  text-color="#fff"
  active-text-color="#ffd04b">
    <el-menu-item index="1">
        <router-link tag="a" :to="{path:'dashboard',params:$route.params}">
        仪表盘
        </router-link>
    </el-menu-item>
    <el-menu-item index="2">
        <router-link tag="a" :to="{path:'monitor',params:$route.params}">
        监控
        </router-link>
    </el-menu-item>
    <el-menu-item index="3">
      <router-link :to="{path:'query',params:$route.params}">
         <!-- :to="{path:'sqlcheck',params:$route.params}"> -->
        SQL优化
      </router-link>
    </el-menu-item>
    <el-menu-item index="4">
      <router-link :to="{path:'query',params:$route.params}">
         <!-- :to="{path:'slowlog',params:$route.params}"> -->
        慢查询
      </router-link>
    </el-menu-item>
    <el-menu-item index="5">
      <router-link :to="{path:'query',params:$route.params}">
        <!-- :to="{path:'rollback',params:$route.params}"> -->
        数据回滚
      </router-link>
    </el-menu-item>
    <el-menu-item index="6">
      <router-link :to="{path:'query',params:$route.params}">
        自助查询
      </router-link>
    </el-menu-item>
    <el-menu-item>
      实例ID - {{$route.params.id}}
    </el-menu-item>
</el-menu>
</template>

<script>
  import { mapGetters } from 'vuex'
    export default {
      data() {
        return {
        }
      },
      computed: {
        ...mapGetters([
          'name', 'routers'
        ])
      },
      methods: {
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
