<template>
    <div class="app-wrapper">
      <left-sidebar class="sidebar-container"></left-sidebar>
      <div class="main-container">
        <top-sidebar></top-sidebar>
        <app></app>
      </div>
  </div>
</template>

<script>
  import LeftSidebar from '@/views/deveops/sidebar/left/index'
  import TopSidebar from '@/views/deveops/sidebar/top/index'
  import App from '@/views/deveops/app/index'
  export default {
    name: "layout",
    components: {
      TopSidebar,LeftSidebar, App
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
