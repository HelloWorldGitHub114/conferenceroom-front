<template>
  <div>
    <el-container>
      <!-- width的宽度跟collapse一样动态控制 -->
      <el-aside width="collapse">
        <el-menu :default-active="activeIndex"
                 :collapse="isCollapse"
                 class="el-menu-vertical"
                 background-color="#393e42"
                 text-color="#fff"
                 active-text-color="rgb(64, 158, 255)"
                 :router="true">
          <el-menu-item @click="isClossTabFun">
            <i class="el-header"></i>
            <span slot="title">会议室管理系统</span>
          </el-menu-item>
          <el-submenu index="1">
            <template slot="title">
              <i class="iconfont iconshenqing"></i>
              <span slot="title">会议室申请</span>
            </template>
            <el-menu-item index="/applyConference" >申请会议室</el-menu-item>
            <el-menu-item index="/conferenceRecordByDep">查看记录</el-menu-item>
          </el-submenu>

          <el-menu-item index="/conference_room" :disabled="!isAdmin">
            <i class="iconfont iconhuiyishi"></i>
            <span slot="title">会议室管理</span>

          </el-menu-item>

          <el-submenu index="4" :disabled="!isAdmin">
            <template slot="title">
              <i class="iconfont iconmenu-s"></i>
              <span slot="title">申请管理</span>
            </template>
            <el-menu-item index="/conferenceRecordByAdmin">查看申请</el-menu-item>
            <el-menu-item index="/applyConferenceByAdmin">审批预约</el-menu-item>

          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header class="main-header" >
          <div style="margin-top: 20px">
            <el-dropdown @command="dropdown">
              <i class="el-icon-s-tools" style="margin-right: 10px;"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="isEmployee" command="员工信息">员工信息</el-dropdown-item>
                <el-dropdown-item command="退出">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span style="margin-right: 20px;">{{this.username}}</span>
          </div>
        </el-header>

        <el-main>
          <el-breadcrumb separator="/" class="crumbs">
            <el-breadcrumb-item v-for="(item)  in levelList" :key="item.path" v-if="item.meta.title">
              <router-link :to="item.redirect||item.path">{{item.meta.title}}</router-link>
            </el-breadcrumb-item>
          </el-breadcrumb>
          <div>
            <router-view></router-view>
          </div>
        </el-main>

        <el-footer class="main-footer" height="50px">
          <p>@2023 11组 会议室预约系统</p>
        </el-footer>

      </el-container>
    </el-container>
  </div>
</template>


<script>
    import Cookies from 'js-cookie'
    export default {
        data() {
            return {
                isCollapse: false,
                tabWidth: 200,
                test1: 1,
                levelList: null,
                isAdmin:true,
                username:'admin',
                activeIndex:'',
                isEmployee:false,
                isDep:false,

            };
        },
        methods: {

            //data会返回下拉菜单中绑定的额值
            dropdown(data){
                if(data==='退出')
                    this.logout()
                else if(data ==='信息'){
                    this.$router.push("/departmentInfo")
                }else{
                    this.$router.push("/employeeInfo")
                }
            },

            //退出
            logout(){
                const _this = this;
                this.axios.get("/logout",{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.$message.success("登出成功");
                    _this.$store.commit("REMOVE_INFO");
                    _this.username='';
                    _this.$router.push("/login")
                })
            },

            /**
             * 生成面包屑的方法
             */
            getBreadcrumb() {
                let matched = this.$route.matched.filter(item => item.name)

                const first = matched[0];

                if (first && first.name !== 'index') {
                    matched = [{path: '/index', meta: {title: '首页'}}].concat(matched)
                }
                this.levelList = matched;
                if(matched.length>1){
                    this.activeIndex = matched[1].path;
                }else
                    this.activeIndex = matched[0].path;
            },

            handleOpen(key, keyPath) {
                //console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
               // console.log(key, keyPath);
            },

            isClossTabFun() {
                this.isCollapse = !this.isCollapse;
            }
        },
        created() {
            //获取面包屑
            this.getBreadcrumb();

           let userInfo = JSON.parse(Cookies.get("userInfo"));
            //获取角色 侧边栏权限
            if(userInfo.role === 'admin'){
                this.isAdmin = true;
            }else{
                if(userInfo.depId !== undefined){
                    this.isEmployee = true;
                    this.isAdmin = false;
                    this.isDep = false;
                }else{
                    this.isEmployee = false;
                    this.isAdmin = false;
                    this.isDep = true;
                }
            }
            if(userInfo.username){
                this.username = userInfo.username;
            }
        },
        watch: {
            $route(to, from) {
                this.getBreadcrumb();
            }
        }
    }
</script>

<style>
    *{
        padding: 0;
        margin: 0;
    }

</style>
<style scoped>
    .main {
        height: 100vh;
        min-width: 800px;
        min-height: 600px;
        overflow: hidden;
    }

    aside {
        overflow: visible;
        height: 100%;
        background-color: #545c64;
        color: rgb(255, 255, 255);
    }

    .isClossTab{
                width: 100%;
                height: 60px;
                cursor: pointer;
                font-size: 16px;
                text-align: center;
                line-height: 60px;
                font-weight: bold;
                border-right: 1px solid #807c7c;
                box-sizing: border-box;
    }

    .main-header {
        background-color:oldlace;
        color: #FFF;
        text-align: right;
        font-size: 16px;
        color: olivedrab;
    }



    .crumbs {
        margin-bottom: 20px;
    }

    .main-footer{
            text-align: center;
            font-size: 13px;
            line-height: 50px;
        }

    .el-header {
      background: #b3c0d1;
      color: #333;
      padding: 0 !important;
    }

    .el-aside {
      background: #393e42;
      color: #333;
      height: 100vh;
    }
    .el-menu {
      border-right-width: 0;
    }
    .el-main {
      color: #333;
    }
    .el-menu-vertical:not(.el-menu--collapse) {
      width: 200px;
    }
    .box_bgd {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .box_bgd i {
      font-size: 20px;
    }
    .box_bgd:hover {
      background: rgb(203, 215, 230);
    }

</style>