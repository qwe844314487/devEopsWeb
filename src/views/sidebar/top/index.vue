<template>
  <el-menu class="navbar" mode="horizontal">
    <breadcrumb class="breadcrumb-container"></breadcrumb>
    <div class="right-menu">
      <el-tooltip effect="dark" content="全屏" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

      <el-dropdown class="right-menu-item" trigger="click">
      <span class="el-dropdown-link">
        <awesome awesclass="user" class="user-svg"></awesome>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span style="display:block;">{{ name }}</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span style="display:block;" @click="QRCode">QRCode</span>
          </el-dropdown-item>
          <router-link to="/dashboard">
          <el-dropdown-item>
              仪表盘
          </el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span style="display:block;" @click="Logout">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog
        width="30%"
        title="当前账户的QRCode"
        :visible.sync="dialogQRCode">
      <img :src="qrcodeimg" style="width:100%;height:100%;">
    </el-dialog>

  </el-menu>
</template>

<script>
  import { qrcode_User } from '@/api/auth'
  import Breadcrumb from '@/components/Breadcrumb'
  import Screenfull from '@/components/Screenfull'
  import Awesome from '@/components/Awesome'
  import { mapGetters } from 'vuex'
    export default {
      data() {
        return {
          dialogQRCode: false,
          qrcodeimg : "",
        }
      },
      components: {
        Breadcrumb,Screenfull,Awesome
      },
      computed: {
        ...mapGetters([
          'topsidebar','name'
        ])
      },
      methods: {
        Toggle() {
          this.$store.dispatch('ToggleSidebar')
        },
        Logout(){
          this.$store.dispatch('LogOut').then(()=>{
            this.$store.dispatch('FedLogOut').then(()=>{
              location.reload()
            })
          })
        },
        QRCode(){
          this.$confirm('您只有一次获取QRCode的机会 是否要获取QRCode？', '提示', {
              confirmButtonText: '马上获取',
              cancelButtonText: '暂时不获取',
              type: 'warning'
            }).then(()=>{
              qrcode_User().then((response)=>{
                this.dialogQRCode = true
                this.qrcodeimg = this.API_URL + response.data.url
              })
            })
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .breadcrumb-container{
      float: left;
    }
    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }
    .right-menu {
      float: right;
      height: 100%;
      margin-right: 10px;
      &:focus{
        outline: none;
      }
      .right-menu-item {
        display: inline-block;
        margin-right: 8px;
        margin-left: 8px;
        margin-bottom: 13px;
        margin-top: 12px;
      }
      .screenfull {
        height: 20px;
      }
      .international{
        vertical-align: top;
      }
      .user-svg{
          display: inline-block;
          cursor: pointer;
          fill: #5a5e66;;
          width: 20px;
          height: 20px;
          vertical-align: 10px;
      }
      .avatar-container {
        height: 50px;
        margin-right: 30px;
        .avatar-wrapper {
          cursor: pointer;
          margin-top: 5px;
          position: relative;
          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }
          .el-icon-caret-bottom {
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }


    }
  }
</style>
