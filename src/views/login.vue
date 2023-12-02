<template>

    <div id="body">

        <vue-particles
            class="login-bg"
            color="#409EFF"
            :particleOpacity="0.7"
            :particlesNumber="60"
            shapeType="circle"
            :particleSize="6"
            linesColor="#409EFF"
            :linesWidth="1"
            :lineLinked="true"
            :lineOpacity="0.4"
            :linesDistance="150"
            :moveSpeed="3"
            :hoverEffect="true"
            hoverMode="grab"
            :clickEffect="true"
            clickMode="push">
        </vue-particles>


      <el-row style="margin-top: 200px">

<!--            登录表单-->
            <el-col :span="7" :offset="5" class="mborder">
                <h3 style="text-align: center;position: relative;margin-top: 10px"><i class="iconfont iconhuiyishi"/>会议室管理系统</h3>

                <el-form :model="ruleForm"  status-icon :rules="rules"   ref="ruleForm"  class="demo-ruleForm"
                         @keyup.enter.native="submitForm('ruleForm')">
                   <el-form-item    prop="username">
                       <el-input prefix-icon="iconfont iconxiaoren" v-model="ruleForm.username"></el-input>
                    </el-form-item>

                    <el-form-item  prop="password">
                        <el-input prefix-icon="iconfont iconmima " type="password" v-model="ruleForm.password"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-col>

<!--            登录提醒-->
            <el-col :span="6" :offset="1" class="mborder mwarn" >
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <el-alert
                                title="登录提示"
                                type="warning"
                                :closable="false">
                        </el-alert>
                    </div>
                    <el-alert
                            title="账号为学号，初始密码为123456，可登录后自行修改"
                            type="info"
                            show-icon
                    :closable="false">
                    </el-alert>
                    <el-alert
                            title="联系管理员：xxxxxxxxx@qq.com"
                            type="info"
                            show-icon
                            :closable="false">
                    </el-alert>
                </el-card>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    import Cookies from 'js-cookie'
    export default {
        name: "login",
        data() {
            return {
                ruleForm: {
                    username: '',
                    password:'',
                },
                rules: {
                    username: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                        { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                       let _this = this;
                      this.axios.post("/login",_this.ruleForm).then((res)=> {
                        const jwt = res.headers['Authorization'];
                        const userInfo = res.data.data;
                        _this.$store.commit('SET_TOKEN',jwt);
                        _this.$store.commit('SET_USERINFO',userInfo);

                        /*const jwt = "admin_token";
                      const userInfo = { username: "admin", role:"admin" };
                      _this.$store.commit("SET_TOKEN", jwt);
                      _this.$store.commit("SET_USERINFO", userInfo);*/


                        _this.$message({
                          message: '恭喜你登录成功!!!!',
                          type: 'success'
                        });

                        _this.$router.push("/index");
                      });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        },
        created() {

            //如果访问网站或者通过地址访问login  有Cookies则直接到index
            //退出按钮时会清除localstorage session cookie

            if(Cookies.get("userInfo")){
                //更新store session
                this.$store.commit('SET_USERINFO',JSON.parse(Cookies.get("userInfo")));
                sessionStorage.setItem("userInfo",Cookies.get("userInfo"));
                this.$router.push("/index");
            }
        }
    }
</script>

<style scoped>
    #body {
        position: fixed;
        width: 100%;
        height: 100%;
        background-image: url('../assets/images/会议室图片.jpg');
        background-position: center center;
        background-size: cover;
    }

    .login-bg{
      height: 100%;
      width: 100%;
      background-size: cover;
      background-repeat: no-repeat;
      opacity:0.9;
      position:fixed;
    }

    .mborder{
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.25);
        backdrop-filter: blur(5px); /* Adjust the blur value as needed */
        background: rgba(255, 255, 255, 0.1); /* Adjust the background color and opacity as needed */
        border-radius: 15px; /* Optional: Add border-radius for rounded corners */
        padding: 20px; /* Optional: Add padding for better visibility */
    }

    .mwarn{
        margin-top: 10px;
    }

    .demo-ruleForm{
        margin: 10px 30px;
    }





    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }

    .box-card {
        //width: 300px;
        background-color: rgba(255, 255, 255, 0.4);
    }

</style>