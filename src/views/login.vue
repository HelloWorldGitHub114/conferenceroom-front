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
                        <el-button @click="registerForm('ruleForm')">注册</el-button>
                        <el-button type="text" class="el-icon-question" style="background: transparent;float: right;font-size: large;color: rgb(128,128,128);" @click="getTip()"></el-button>
                    </el-form-item>
                </el-form>
            </el-form>

      <el-dialog :visible.sync="dialogRegisterVisible" title="注册" width="38%" :modal-append-to-body='false'>
        <!--            登录提醒-->
        <el-form label-position="left" label-width="80px" :model="registerInput"  :rules="rules" ref="registerInput" @keyup.enter.native="registerSubmitForm('registerInput')">
          <el-form-item label="用户名" prop="username">
            <el-input :placeholder="registerInput.username" v-model="registerInput.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input :placeholder="registerInput.password" v-model="registerInput.password"></el-input>
          </el-form-item>
          <el-form-item  label="确认密码" prop="repassword">
            <el-input :placeholder="registerInput.repassword" v-model="registerInput.repassword"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 80px;position: absolute;left:30%" @click="registerSubmitForm('registerInput')">注册</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

        <el-dialog :visible.sync="dialogTipVisible" width="28%" :modal-append-to-body='false'>
          <!--            登录提醒-->
          <el-alert
              title="登录提示"
              type="warning"
              :closable="false">
          </el-alert>
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
          let validatePass2 = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'))
            } else if (value !== this.registerInput.password) {
              callback(new Error('两次输入密码不一致!'))
            } else {
              callback()
            }
          };
          return {
                ruleForm: {
                    username: '',
                    password:'',
                },
                registerInput: {
                    username: '',
                    password:'',
                    repassword:'',
                },
                rules: {
                    username: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                        { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ],
                    repassword: [
                      { required: true, validator: validatePass2, trigger: 'blur' }
                    ]
                },
                dialogTipVisible:false,
                dialogRegisterVisible:false
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
            registerForm(formName) {
                this.$refs[formName].resetFields();
                this.dialogRegisterVisible = true;
            },
            registerSubmitForm(formName) {
              this.$refs[formName].validate((valid) => {
                if (valid) {
                  this.ruleForm.username = this.registerInput.username;
                  this.ruleForm.password = this.registerInput.password;
                  let _this = this;
                  this.axios.post("/register",_this.ruleForm).then((res)=> {
                    const jwt = res.headers['authorization'];
                    const userInfo = res.data.data;
                    _this.$store.commit('SET_TOKEN',jwt);
                    _this.$store.commit('SET_USERINFO',userInfo);

                    _this.$message({
                      message: '注册成功!',
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
        overflow:hidden;
    }

    .login-bg{
      height: 100%;
      width: 100%;
      background-size: cover;
      background: no-repeat;
      opacity:0.9;
      position:fixed;
      overflow:hidden;
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

    .el-dialog__wrapper {
      backdrop-filter: blur(5px);
      border-radius: 15px;
      padding: 20px;
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