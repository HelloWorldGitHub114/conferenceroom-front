<template>
    <div>


        <div class="warnning">
            <el-alert
                    title="提示"
                    type="error"
                    description="请尽量在会议开始前一天之前进行申请"
            style="border-radius: 30px"
            :closable="false">
            </el-alert>
        </div>

        <!--            按照条件搜索-->
        <div class="mConditions">
            <el-select  v-model="roomFloor" clearable placeholder="楼层" @change="changeSearch">
                <el-option
                        v-for="item in floors"
                        :key="item.roomFloor"
                        :label="item.roomFloor"
                        :value="item.roomFloor">
                </el-option>
            </el-select>

            <el-select
                    class="mselect"
                    v-model="roomSize"
                    clearable
                    placeholder="可容纳人数"
                    @change="changeSearch">
                <el-option
                        v-for="item in sizes"
                        :key="item.roomSize"
                        :label="item.roomSize"
                        :value="item.roomSize">
                </el-option>
            </el-select>

            <el-date-picker
                class="mselect"
                v-model="searchDate"
                type="date"
                placeholder="选择预约日期"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                @change="changeSearchTime"
            ></el-date-picker>

            <el-time-select
                class="mselect"
                v-model="searchStartTime"
                placeholder="选择开始时间"
                :picker-options="searchStartPickerOptions"
                @change="changeSearchTime"
            ></el-time-select>

            <el-time-select
                class="mselect"
                v-model="searchEndTime"
                placeholder="选择结束时间"
                :picker-options="searchEndPickerOptions"
                @change="changeSearchTime"
            ></el-time-select>

        </div>
        <el-table :data="conferenceRooms.filter(data => !this.search || data.roomNo.toLowerCase().includes(this.search.toLowerCase())||
                (''+data.roomFloor).toLowerCase().includes(this.search.toLowerCase()) || data.roomName.toLowerCase().includes(this.search.toLowerCase()))"
                  style="width: 100%;text-align: center"
                  max-height="440px"
                  :row-class-name="this.tableRowClassName">
            <el-table-column
                prop="roomNo"
                label="房号"
                width="150"
                align="center"
                sortable>
            </el-table-column>
            <el-table-column
                prop="roomFloor"
                label="楼层"
                width="150"
                align="center"
                sortable>
            </el-table-column>
            <el-table-column
                prop="roomName"
                label="名称"
                width="200"
                align="center">
            </el-table-column>
            <el-table-column
                prop="roomArea"
                label="面积"
                width="150"
                align="center"
                sortable>
            </el-table-column>
            <el-table-column
                prop="roomSize"
                label="可容纳人数"
                width="150"
                align="center"
                sortable>
            </el-table-column>

            <el-table-column label="详细信息" width="180" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="lookDevice(scope.row)">查看</el-button>
                </template>

            </el-table-column>


            <el-table-column
                    align="right" >
                <template slot="header" slot-scope="scope">
                    <el-input
                            v-model="search"
                            size="mid"
                            placeholder="输入楼层、会议室门牌号、会议室名字等进行搜索"/>
                </template>
                <template slot-scope="scope">
                    <el-button
                            size="medium"
                            @click="handleApply(scope.$index, scope.row)"

                            round
                            type="warning"
                            style="margin-right: 10px"
                    >申 请</el-button>

                </template>
            </el-table-column>
        </el-table>


<!--        申请会议室弹出框-->
        <el-dialog title="申请会议室" :visible.sync="dialogFormApply">
          <el-form :model="record" label-position="right" label-width="80px" status-icon :rules="rules" ref="applyForm">
            <el-row>
              <el-col :span="12">
                <!-- First Column -->
                <el-form-item label="会议主题" prop="theme">
                  <el-input v-model="record.theme" placeholder="请输入会议主题" style="width: 250px"></el-input>
                </el-form-item>

                <el-form-item label="预约理由" prop="digest">
                  <el-input type="textarea" autosize v-model="record.digest" placeholder="请输入预约理由" style="width: 250px"></el-input>
                </el-form-item>

                <el-form-item label="会议人数" prop="personCount">
                  <el-input @blur="examinePersonCount" v-model.number="record.personCount" placeholder="会议人数" style="width: 250px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <!-- Second Column -->
                <el-form-item label="预约日期" prop="selectDate" style="width: 250px">
                  <el-date-picker
                      v-model="record.selectDate"
                      type="date"
                      placeholder="选择预约日期"
                      :picker-options="pickerOptions"
                      @blur="searchTimeConflict"
                      value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>

                <el-form-item label="开始时间" prop="startTime" style="width: 250px">
                  <el-time-select
                      v-model="record.startTime"
                      placeholder="选择开始时间"
                      :picker-options="applyStartPickerOptions"
                      @blur="searchTimeConflict"
                  ></el-time-select>
                </el-form-item>

                <el-form-item label="结束时间" prop="endTime" style="width: 250px">
                  <el-time-select
                      v-model="record.endTime"
                      placeholder="选择结束时间"
                      :picker-options="applyEndPickerOptions"
                      @blur="searchTimeConflict"
                  ></el-time-select>
                </el-form-item>
                <!-- Add more form items for the second column as needed -->

              </el-col>
            </el-row>

            <el-form-item>
              <el-button style="background-color: oldlace" @click="submitForm('applyForm')">提交申请</el-button>
              <el-button @click="resetForm('applyForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

<!--        查看设备的表格-->
        <el-dialog title="设备" :visible.sync="dialogTableVisible" width="60%">
          <el-form v-if="selectedRow" label-position="top" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="会议室图片" style="font-weight: bold">
                <img :src=selectedRow.roomPhoto alt="这是图片" style="margin-top: 10px;max-width: 400px;max-height: 200px;" loading="lazy">
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <span slot="label" style="font-weight: bold;">会议室描述</span>
                <span>{{ selectedRow.roomDescription }}</span>
              </el-form-item>
            </el-col>
          </el-row>
            <el-form-item>
              <span slot="label" style="font-weight: bold;">会议室设备</span>
            <el-table
                    :data="devices"
                    style="text-align: center"
                    :row-class-name="tableRowClassName"
            >
                <el-table-column
                        prop="dname"
                        label="设备名称"
                       >
                </el-table-column>
                <el-table-column
                        prop="dnumber"
                        label="数量"
                >
                </el-table-column>
            </el-table>
            </el-form-item>
          </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    export default {
        name: "applyConference",
        data(){
            return{
                devices:[
                    {"did":'',
                        "dname":'',
                        "dnumber":'',
                        "roomID":'',

                    }
                ],

                dialogTableVisible:false,

                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    },
                },

                //申请弹出框
                dialogFormApply:false,

                //查出没有重复的条件 进行筛选 后台数据用list嵌套map传到前端
                floors:[{
                    roomFloor:'1'
                }],
                types:[{
                    roomName:'多媒体'
                }],
                sizes:[{
                    roomSize:100
                }],

                //与下拉选框双向绑定
                roomFloor:'',
                roomSize:'',
                searchDate:null,
                searchStartTime:null,
                searchEndTime:null,

                selectOptions: {
                  start: '08:00',step: '01:00',end: '18:00'
                },

                //搜索框
                search:'',

                //选择查看的列
                selectedRow: null,

                //表格绑定
                conferenceRooms: [{
                  roomID: 2,
                  roomNo: "003",
                  roomName: '会议室1',
                  roomFloor: 11,
                  roomSize: '300',
                  roomArea: 11,
                  roomState: 1,
                  roomPhoto:'https://album.biliimg.com/bfs/new_dyn/ffa6c350f8bc920c7b78d890915c5bb68002550.jpg@135h_1s_!web-comment-note.webp',
                  roomDescription: '这是一个会议室'
                }],

                record:{
                  "roomSize":'', //申请会议室时 会议人数要比较
                  "userID": '',
                  "roomID": '',
                  "selectDate": null,
                  "startTime": null,
                  "endTime": null,
                  "personCount":'',
                  "theme": "",
                  "digest": "",
                },

                rules: {
                    theme: [
                        {required: true, message: '请输入会议主题', trigger: 'blur'},
                        {min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur'}
                    ],
                    digest: [
                        {required: true, message: '请输入申请理由', trigger: 'blur'},
                        {min: 5, max: 50, message: '长度在 5 到 124 个字符', trigger: 'blur'}
                    ],
                    personCount: [
                        {required: true, message: '请输入参与会议人数', trigger: 'blur'},
                        { type: 'number', message: '必须为数字', trigger: 'blur' }
                    ],
                    startTime: [
                        {required: true, message: '请选择会议开始时间', trigger: 'blur'},
                    ],
                    endTime: [
                        {required: true, message: '请选择会议结束时间', trigger: 'blur'},
                    ],

                },
            }
        },

        computed: {
          searchStartPickerOptions() {
            let startEndTime = '18:00'; // Default start time if this.startTime is not set

            if (this.searchEndTime) {
              // If this.endTime is set, calculate one hour before it
              const startTimeDate = new Date(`2000-01-01 ${this.searchEndTime}`);
              startTimeDate.setHours(startTimeDate.getHours()-1);
              startEndTime = startTimeDate.toTimeString().slice(0, 5); // Format to HH:mm
            }

            return {
              start: '08:00',
              step: '01:00', // Adjust the step as needed
              end: startEndTime, // Adjust the end time as needed
            };
          },

          searchEndPickerOptions() {
            let endStartTime = '09:00'; // Default start time if this.startTime is not set

            if (this.searchStartTime) {
              // If this.startTime is set, calculate one hour after it
              const startTimeDate = new Date(`2000-01-01 ${this.searchStartTime}`);
              startTimeDate.setHours(startTimeDate.getHours() + 1);
              endStartTime = startTimeDate.toTimeString().slice(0, 5); // Format to HH:mm
            }

            return {
              start: endStartTime,
              step: '01:00', // Adjust the step as needed
              end: '18:00', // Adjust the end time as needed
            };
          },

          applyStartPickerOptions() {
            let startEndTime = '18:00'; // Default start time if this.startTime is not set

            if (this.record.endTime) {
              // If this.endTime is set, calculate one hour before it
              const startTimeDate = new Date(`2000-01-01 ${this.record.endTime}`);
              startTimeDate.setHours(startTimeDate.getHours()-1);
              startEndTime = startTimeDate.toTimeString().slice(0, 5); // Format to HH:mm
            }

            return {
              start: '08:00',
              step: '01:00', // Adjust the step as needed
              end: startEndTime, // Adjust the end time as needed
            };
          },

          applyEndPickerOptions() {
            let endStartTime = '09:00'; // Default start time if this.startTime is not set

            if (this.record.startTime) {
              // If this.startTime is set, calculate one hour after it
              const startTimeDate = new Date(`2000-01-01 ${this.record.startTime}`);
              startTimeDate.setHours(startTimeDate.getHours() + 1);
              endStartTime = startTimeDate.toTimeString().slice(0, 5); // Format to HH:mm
            }

            return {
              start: endStartTime,
              step: '01:00', // Adjust the step as needed
              end: '18:00', // Adjust the end time as needed
            };
          },
        },

        methods:{
            lookDevice(row){
                this.dialogTableVisible = true;
                this.selectedRow = row;
                let roomID = row.roomID;
                let _this = this;
                _this.axios.get("/device/listbyapply/"+roomID,{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.devices = res.data.data;
                })
            },

            //检查参与会议人数是否小于等于会议室可容纳人数 并且不能为0
            examinePersonCount(){
                    if(this.record.personCount!==null&&this.record.personCount!==0){
                        if(this.record.personCount>this.record.roomSize){
                            this.$message({
                                message: '人数超过会议室可容纳人数',
                                type:'error',
                                center: true
                            });

                            this.record.personCount = '';
                        }

                    }

                    if(this.record.personCount === 0){
                        this.$message({
                            message: '参与会议人数不能为0',
                            type:'error',
                            center: true
                        });
                        this.record.personCount = '';
                    }
            },

            //当选择时间的失去焦点时  去异步请求后台 是否时间允许 注意结束时间不能早于开始时间
            //这里判断使用！==null 那么最好一开始定义data时也用null  然后当不满足条件时 也是设置为null
            //时间的判断都在这里  只有时间的冲突是在后端
            //开始时间不能大于结束时间
            //开始时间不能早于当前时间
            //会议室的使用时间为10点23点
            searchTimeConflict(){
                if( this.record.selectDate!==null && this.record.startTime!==null  && this.record.endTime!==null) {
                  let roomID = this.record.roomID;

                  let startTime = this.record.selectDate + ' ' + this.record.startTime + ':00';
                  let endTime = this.record.selectDate + ' ' + this.record.endTime + ':00'
                  let _this = this;
                  _this.axios.get("/apply/searchtimeconflict/" + roomID + "/" + startTime
                      + "/" + endTime, {
                    headers: {
                      "Authorization": localStorage.getItem("token")
                    }
                  }).then(res => {
                    if (res.data.data !== '1') {
                      this.$message({
                        message: '时间冲突，请选择其他时间或者会议室',
                        type: 'error',
                        center: true
                      });
                      _this.record.startTime = null;
                      _this.record.endTime = null;
                    }
                  })
                }
            },

            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                      this.record.userID = JSON.parse(Cookies.get("userInfo")).userID;
                    let _this =this;
                        _this.axios.post("/apply/add",_this.record, {
                            headers: {
                                "Authorization": localStorage.getItem("token")
                            }
                        }).then(res=>{
                            this.$message({
                                message: '申请成功,等待管理员审核',
                                type:'success',
                                center: true
                            });
                            _this.dialogFormApply= false;
                            _this.record= {
                                "selectDate": null,
                                "startTime":null,
                                "endTime": null,
                                "personCount":'',
                                "theme": "",
                                "digest": "",
                            }
                        })

                    } else {
                    console.log('error submit!!');
                    return false;
                }
                })
            },


            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            changeSearch(){
                this.sendSearch(0);
            },

            changeSearchTime(){
              if(this.searchDate !== null && this.searchStartTime !== null && this.searchEndTime !== null){
                  this.sendSearch(1);
              }
            },

            sendSearch(flag){
              let searchStartTime = null;
              let searchEndTime = null;
              //用flag避免重复判断时间是否存在；changeSearchTime()已经判断过一次了，就直接通过条件
              if(flag || this.searchDate !== null && this.searchStartTime !== null && this.searchEndTime !== null){
                searchStartTime = this.searchDate + ' ' + this.searchStartTime + ':00';
                searchEndTime = this.searchDate + ' ' + this.searchEndTime + ':00';
              }
              const jsonParams = {
                roomFloor: this.roomFloor,
                roomSize: this.roomSize,
                searchStartTime : searchStartTime,
                searchEndTime : searchEndTime
              };

              let queryString = Object.keys(jsonParams)
                  .filter(key => jsonParams[key] !== null && jsonParams[key] !== undefined && jsonParams[key] !== '')
                  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(jsonParams[key])}`)
                  .join('&');
              queryString = queryString=='' ? '' : '?'+queryString;
              let url = "/conference-room/listbyonstate"+queryString;

              let _this = this;
              this.axios.get(url,{
                headers:{
                  "Authorization":localStorage.getItem("token")
                }
              }).then(res=>{
                _this.conferenceRooms = res.data.data;
              })
            },

            getConditions(){
                let _this = this;
                this.axios.get("/conference-room/getconditionsonstate",{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.floors = res.data.data.floors;
                    _this.sizes = res.data.data.sizes;
                })
            },
            getAllConferenceRoom(){
                let _this = this;
                _this.axios.get("/conference-room/listallonstate",{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.conferenceRooms = res.data.data;
                })
            },
            handleApply(index, row) {
                this.dialogFormApply = true;
                this.record.roomID = row.roomID;
                this.record.roomSize = row.roomSize;
            },

            tableRowClassName({row, rowIndex}) {
                if (rowIndex === 1) {
                    return 'warning-row';
                } else if (rowIndex === 3) {
                    return 'success-row';
                } else if (rowIndex == 5) {
                    return 'warning-row';
                } else if (rowIndex === 7) {
                    return 'success-row'
                }
                return '';
            }

        },
        created() {
            this.getConditions();
            this.getAllConferenceRoom();
        }
    }
</script>

<style scoped>

    .warnning{
        margin-top: 30px;
    }
</style>