<template>
    <div class="app-wrapper">
        <app></app>
  </div>
</template>

<script>
  import App from '@/views/dashboard/app/index'
  export default {
    name: "dashboardlayout",
    components: {
      App
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
