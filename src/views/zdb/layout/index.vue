<template>
    <div class="app-wrapper">
      <!-- <left-sidebar class="sidebar-container"></left-sidebar> -->
      <div>
      <!-- class="main-container"> -->
        <top-sidebar></top-sidebar>
        <app></app>
      </div>
  </div>
</template>

<script>
  // import LeftSidebar from '@/views/zdb/sidebar/left/index'
  import TopSidebar from '@/views/zdb/sidebar/top/index'
  import App from '@/views/zdb/app/index'
  export default {
    name: "dblayout",
    components: {
      TopSidebar, App
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .app-wrapper {
    &:after {
      content: "";
      display: table;
      clear: both;
    }
    position: relative;
    height: 100%;
    width: 100%;
  }
</style>
