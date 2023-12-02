<template>
    <div>
        <el-row>
            <el-col :span="12">
                <div >
                    <el-calendar v-model="value" class="calender">
                    </el-calendar>
                </div>
            </el-col>
            <el-col :span="8" class="infoUser"  v-if="isUser">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <el-alert
                                title="网站使用事项"
                                type="warning"
                                :closable="false">
                        </el-alert>
                    </div>
                    <el-alert
                            title="本界面为会议室预约管理系统界面"
                            type="info"
                            show-icon
                            :closable="false">
                    </el-alert>
                    <el-alert
                            title="用户可通过在线申请会议室的使用，由管理员进行审核"
                            type="info"
                            show-icon
                            :closable="false">
                    </el-alert>
                    <el-alert
                        title="会议室的使用时间由8点至18点，只能按小时划分的时间段预约"
                        type="info"
                        show-icon
                        :closable="false">
                </el-alert>
                    <el-alert
                            title="申请的审核结果会在1个工作日内进行告知或提醒"
                            type="info"
                            show-icon
                            :closable="false">
                    </el-alert>
                    <el-alert
                            title="部门进行申请会议室时应尽量在会议开始前的1天前进行申请"
                            type="info"
                            show-icon
                            :closable="false">
                    </el-alert>
                    <el-alert
                            title="如若有突发情况需紧急使用会议室可通过联系管理员进行紧急申请"
                            type="info"
                            show-icon
                            :closable="false">
                    </el-alert>
                    <el-alert
                            title="管理员：xxxxxxx@qq.com"
                            type="info"
                            show-icon
                            :closable="false">
                    </el-alert>
                </el-card>
            </el-col>
            <el-col :span="8" class="infoAdmin"  v-if="!isUser">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <el-alert
                                title="网站使用事项"
                                type="warning"
                                :closable="false">
                        </el-alert>
                    </div>
                    <el-alert
                            title="本界面为会议室预约管理系统界面"
                            type="info"
                            show-icon
                            :closable="false">
                    </el-alert>
                    <el-alert
                            title="管理员可进行对会议室和及会议室申请进行管理"
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
    import Cookies from "js-cookie";

    export default {
        name: "home",
        data() {
            return {
                value: new Date(),
                isUser:true,
            }
        },
        created() {
            let userInfo = JSON.parse(Cookies.get("userInfo"));
           if(userInfo.role === 'user'){
               this.isUser = true;
           }else{
               this.isUser = false;
           }
        }
    }
</script>

<style scoped>

    .box-card {
        background-color: rgba(180, 180, 180, 0.1);
        width: 500px;
    }

    .infoUser{
       position: relative;
        margin-top: 70px;
        margin-left: 50px;

    }
    .infoAdmin{
        position: relative;
        margin-top: 150px;
        margin-left: 50px;

    }
    .calender{
        background-color: rgba(240, 249, 235, 0.3);
        position: relative;
        margin-left: 150px;

    }

</style>