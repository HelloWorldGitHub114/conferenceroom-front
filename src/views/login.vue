<template>

    <div id="body">

        <vue-particles
            class="login-bg"
            color="#ffffff"
            :particleOpacity="0.7"
            :particlesNumber="100"
            shapeType="circle"
            :particleSize="4"
            linesColor="#fff"
            :linesWidth="1"
            :lineLinked="true"
            :lineOpacity="0.4"
            :linesDistance="150"
            :moveSpeed="2"
            :hoverEffect="true"
            hoverMode="grab"
            :clickEffect="true"
            clickMode="push">
        </vue-particles>

<!--            登录表单-->
            <el-form class="login-form">
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
                        <el-button @click="resetForm('ruleForm')">注册</el-button>
                        <el-button type="text" class="el-icon-question" style="background: transparent;float: right;font-size: large;color: rgb(128,128,128);" @click="getTip()"></el-button>
                    </el-form-item>
                </el-form>
            </el-form>

        <el-dialog :visible.sync="dialogTipVisible" width="28%" :modal-append-to-body='false'>
          <!--            登录提醒-->
          <div slot="header" class="clearfix">
            <el-alert
                title="登录提示"
                type="warning"
                :closable="false">
            </el-alert>
          </div>
          <el-alert
              title="测试用账号：adminn 密码：adminn"
              type="info"
              show-icon
              :closable="false">
          </el-alert>
          <el-alert
              title="如有问题可联系管理员：xxxxxxxxx@qq.com"
              type="info"
              show-icon
              :closable="false">
          </el-alert>
        </el-dialog>



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
                },
                dialogTipVisible:false
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                       let _this = this;
                      this.axios.post("/login",_this.ruleForm).then((res)=> {
                        const jwt = res.headers['authorization'];
                        console.log(res.headers['authorization']);
                        const userInfo = res.data.data;
                        _this.$store.commit('SET_TOKEN',jwt);
                        _this.$store.commit('SET_USERINFO',userInfo);

                        _this.$message({
                          message: '登录成功!',
                          type: 'success'
                        });

                        _this.$router.push("/index");
                      });
                    } else {
                        console.log('提交信息有误');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            getTip(){
              this.dialogTipVisible = true;
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
        background-image: url('../assets/images/background.png');
        background-position: center center;
        background-size: cover;
    }

    .login-bg{
      height: 100%;
      width: 100%;
      background-size: cover;
      background: no-repeat;
      opacity:0.9;
      position:fixed;
    }

    .login-form{
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.25);
        backdrop-filter: blur(5px); /* Adjust the blur value as needed */
        background: rgba(255, 255, 255, 0.1); /* Adjust the background color and opacity as needed */
        border-radius: 15px; /* Optional: Add border-radius for rounded corners */
        padding: 20px; /* Optional: Add padding for better visibility */
        height: 30%;
        width: 26%;
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
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

    .el-input >>> .el-input__inner {
      background-color: rgba(255, 255, 255, 0.247);
    }

</style>