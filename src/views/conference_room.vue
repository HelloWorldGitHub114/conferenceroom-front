<template>
        <div id="app">

            <div class="maddButton">
                <el-button type="success" round size="medium" @click="dialog = true" >添加会议室</el-button>
            </div>
            <el-drawer
                    title="添加/修改会议室"
                    direction="rtl"
                    :visible.sync="dialog"
                    custom-class="demo-drawer"
                    :with-header="false"
                    ref="drawer"
                    @close="closeDrawer"
            >
                <div class="demo-drawer__content" style="margin-top: 20px;width: 400px">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="房号" prop="roomNo">
                            <el-input v-model="ruleForm.roomNo" ></el-input>
                        </el-form-item>
                        <el-form-item label="名字" prop="roomName">
                            <el-input  v-model="ruleForm.roomName"></el-input>
                        </el-form-item>
                        <el-form-item label="楼层" prop="roomFloor">
                          <el-input v-model.number="ruleForm.roomFloor"></el-input>
                        </el-form-item>
                        <el-form-item label="可容纳人数" prop="roomSize">
                            <el-input v-model.number="ruleForm.roomSize"></el-input>
                        </el-form-item>
                        <el-form-item label="面积" prop="roomArea">
                          <el-input v-model.number="ruleForm.roomArea"></el-input>
                        </el-form-item>
                        <el-form-item label="描述" prop="roomDescription">
                          <el-input v-model="ruleForm.roomDescription" type="textarea"></el-input>
                        </el-form-item>
                        <el-form-item label="图片" style="height: 148px">
                          <el-upload :file-list="uploadImages"
                                     action=""
                                     :show-file-list="true"
                                     :on-change="handleUploadChange"
                                     :on-remove="handleUploadRemove"
                                     :auto-upload="false"
                                     list-type="picture-card"
                                     :class="{disabled:uploadDisabled}">
                            <i class="el-icon-plus"></i>
                          </el-upload>
                        </el-form-item>

                        <el-form-item>
                            <el-button v-if="update" style="background-color: oldlace"  round @click="updateForm('ruleForm')">更 新</el-button>
                            <el-button v-if="!update" style="background-color: oldlace" round @click="submitForm('ruleForm')">立即添加</el-button>
                            <el-button @click="resetForm('ruleForm')" round>重 置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-drawer>

<!--            按照条件搜索-->
            <div class="mConditions">
                <el-select  v-model="roomFloor" clearable placeholder="楼层" @change="change">
                    <el-option
                            v-for="item in floors"
                            :key="item.roomFloor"
                            :label="item.roomFloor"
                            :value="item.roomFloor">
                    </el-option>
                </el-select>

                <el-select class="mselect" v-model="roomSize" clearable placeholder="可容纳人数" @change="change">
                    <el-option
                            v-for="item in sizes"
                            :key="item.roomSize"
                            :label="item.roomSize"
                            :value="item.roomSize">
                    </el-option>
                </el-select>

                <el-select class="mselect" v-model="roomState" clearable placeholder="状态" @change="change">
                  <el-option label="可用" value="1"></el-option>
                  <el-option label="不可用" value="0"></el-option>
                </el-select>

            </div>


            <el-table :data="conferenceRooms.filter(data => !this.search || data.roomNo.toLowerCase().includes(this.search.toLowerCase())||
                data.roomFloor.toLowerCase().includes(this.search.toLowerCase()) || data.roomName.toLowerCase().includes(this.search.toLowerCase()))"
                      style="width: 100%;text-align: center;margin-top: 10px"
                      max-height="470px"
                    :row-class-name="this.tableRowClassName">
                <el-table-column
                        prop="roomNo"
                        label="房号"
                        width="120"
                        align="center"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="roomFloor"
                        label="楼层"
                        width="120"
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
                        width="120"
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
                <el-table-column label="可用状态" width="150"  align="center">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.roomState"
                                :active-value="1"
                                :inactive-value="0"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                @change="getState(scope.row)"/>
                    </template>

                </el-table-column>

                <el-table-column label="详细信息" width="150" align="center">
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
                                placeholder="输入房号、名字、人数等搜索"/>
                    </template>



                    <template slot-scope="scope">
                        <el-button
                                size="medium"
                                @click="handleaddDevice(scope.row)"
                                icon="el-icon-plus"
                                circle
                                type="success"
                        ></el-button>


                        <el-button
                                size="medium"
                                @click="handleEdit(scope.$index, scope.row)"
                                icon="el-icon-edit"
                                circle
                                type="warning"
                                style="margin-right: 10px"
                        ></el-button>

                        <template>
                            <el-popconfirm
                                    title="确定删除该会议室吗？"
                                    @onConfirm="handleDelete(scope.$index, scope.row)"
                            >
                                <el-button
                                        slot="reference"
                                        size="medium"
                                        type="danger"
                                        circle
                                        icon="el-icon-delete"
                                ></el-button>
                            </el-popconfirm>
                        </template>
                    </template>
                </el-table-column>
            </el-table>


<!--            查看设备的表格-->
            <el-dialog title="详细信息" :visible.sync="dialogTableVisible" width="70%">
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
                        align="center"
                        :row-class-name="tableRowClassName"
                    >
                      <el-table-column
                          prop="dname"
                          label="设备名称" >
                      </el-table-column>
                      <el-table-column
                          label="数量" align="center">
                        <template slot-scope="scope">
                          <el-input-number v-model="scope.row.dnumber" @change="handleChange(scope.row.did,scope.row.dnumber)" :min="1"  label="设备数量"></el-input-number>
                        </template>
                      </el-table-column>

                      <el-table-column  label="操作" align="center" >
                        <template slot-scope="scope">
                          <el-button
                              size="medium"
                              @click="handleEditDevice(scope.row)"
                              icon="el-icon-edit"
                              circle
                              type="warning"
                              style="margin-right: 10px"
                          ></el-button>

                          <template>
                            <el-popconfirm
                                title="确定删除该设备吗？"
                                @onConfirm="handleDeleteDevice(scope.row)"
                            >
                              <el-button
                                  slot="reference"
                                  size="medium"
                                  type="danger"
                                  circle
                                  icon="el-icon-delete"
                              ></el-button>
                            </el-popconfirm>
                          </template>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-form>
            </el-dialog>

<!--            添加设备或者修改的表单-->
            <el-dialog  :title="isUpdateDevice" :visible.sync="dialogFormVisible">

            <el-form :model="deviceForm" :rules="deviceFormRules" ref="deviceFormRules">
                <el-form-item label="设备名称"  label-width="150px" prop="dname" >
                    <el-input v-model="deviceForm.dname" autocomplete="off" placeholder="请输入设备名称" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="设备数量"  label-width="150px">
                    <el-input-number v-model="deviceForm.dnumber"  :min="1"  label="设备数量"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button round @click="dialogFormVisible = false">取 消</el-button>
                <el-button  round type="success" @click="addDevice">确 定</el-button>
            </div>
        </el-dialog>

        </div>
</template>

<script>

    export default {
        name: "conference_room",
        data(){
            return{
                isUpdateDevice:'添加设备',

                devices:[
                    {   "did":'',
                       "dname":'',
                       "dnumber":'',
                        "roomID":'',
                    }
                ],


                deviceForm:{
                    "roomID":'',
                    "dname":'',
                    "dnumber":undefined,
                },

                dialogFormVisible:false,

                dialogTableVisible:false,

                selectedRow:null,

                //查出没有重复的条件 进行筛选 后台数据用list嵌套map传到前端
                floors:[{
                    roomFloor:'1'
                }],
                sizes:[{
                    roomSize:100
                }],

                //与下拉选框双向绑定
                roomFloor:'',
                roomSize:'',
                roomState:'',

                update:false,
                search:'',
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
                dialog: false,

                //如果是添加 id 状态是没有数据的 所以在后台中会判断成添加会议室 并且状态设置为1表示可用
                //如果是编辑 那么会调用handleEdit方法 把该行的数据给ruleForm 回显在表单中 此时的ruleForm是有Id的
                ruleForm: {
                    roomID:'',
                    roomNo: '',
                    roomName:'',
                    roomFloor: '',
                    roomSize: '',
                    roomArea: '',
                    roomState: '',
                    roomPhoto:'',
                    roomDescription: ''
                },
                uploadImages:[],
                uploadDisabled:false,




                rules: {
                    roomNo: [
                        { required: true, message: '请输入房号', trigger: 'blur'},
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    roomFloor: [
                        { required: true, message: '请输入楼层', trigger: 'blur'},
                        { type: 'number', message: '必须为数字', trigger: 'blur' }
                    ],
                    roomName: [
                        { required: true, message: '请输入会议室名称', trigger: 'blur'},
                        { min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur'}
                    ],
                    roomSize: [
                        { required: true, message: '请输入可容纳人数', trigger: 'blur' },
                        { type: 'number', message: '必须为数字', trigger: 'blur' }
                    ],
                    roomArea: [
                        { required: true, message: '请输入面积', trigger: 'blur'},
                        { type: 'number', message: '必须为数字', trigger: 'blur' }
                    ],
                    roomDescription: [
                    ],
                },

                deviceFormRules:{
                    dname: [
                        {required: true, message: '请输入设备名称', trigger: 'blur'},
                        {min: 2, max:25, message: '长度在 2 到 25 个字符', trigger: 'blur'}
                    ],
                }
            }
        },

        methods: {
            handleChange(did,number){
                let _this = this;
                _this.axios.put("/device/changenumber",{
                    "did":did,
                    "number":number,
                },{
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                }).then(res=>{

                })
         },

            handleEditDevice(row){
                this.isUpdateDevice = '修改设备信息';
              let temp = JSON.stringify(row);
              this.deviceForm = JSON.parse(temp);
              this.dialogFormVisible = true;
             },

            handleDeleteDevice(row){
                let _this = this;
                _this.axios.delete("/device/delete/"+row.did,{
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.$message.success("删除成功");
                    //刷新表格
                    _this.axios.get("/device/listby/"+row.roomID,{
                        headers:{
                            "Authorization":localStorage.getItem("token")
                        }
                    }).then(res=>{
                        _this.devices = res.data.data;
                    })
                })
            },

            handleUploadRemove(file, fileList) {
              if (fileList.length === 0) {
                this.uploadDisabled = false;
              }
              this.uploadImages = fileList;
            },

            handleUploadChange(file, fileList) {
              //先判断上传的图片格式是否正确
              if(!this.beforeAvatarUpload(file)){
                //不正确直接删除
                fileList.splice(0,1);
              }else if (fileList.length > 0) {
                this.uploadDisabled = true;
                this.uploadImages = fileList;
              }
            },

          beforeAvatarUpload(file) {
              // 设置限定格式
            const img_mimetype = ['image/jpeg','image/jpg','image/png'];
            const isImg =  img_mimetype.includes(file.raw.type);
            const isFitSize = file.size / 1024 / 1024 < 10;
            if (!isImg) {
              this.$message.error('上传图片只能是图片格式!');
              return false;
            }
            if (!isFitSize) {
              this.$message.error('上传图片大小不能超过 10MB!');
              return false;
            }
            return isImg && isFitSize;
            },

          addDevice() {
            this.$refs['deviceFormRules'].validate((valid) => {
              if (valid) {
                let flag = this.deviceForm.did;
                let _this = this;
                _this.axios.post("/device/add", _this.deviceForm, {
                  headers: {
                    "Authorization": localStorage.getItem("token")
                  }
                }).then(res => {
                  if(flag === null || flag === '' ) {
                    _this.$message.success("添加成功")

                    _this.deviceForm = {
                      "did":'',
                      "roomID": '',
                      "dname": '',
                      "dnumber": '',
                    };

                    _this.dialogFormVisible = false;
                  }
                  else {
                    _this.$message.success("修改成功")
                    //刷新表格
                    _this.axios.get("/device/listby/"+_this.deviceForm.roomID,{
                      headers:{
                        "Authorization":localStorage.getItem("token")
                      }
                    }).then(res=>{
                      _this.devices = res.data.data;
                    });
                    _this.deviceForm = {
                      "did":'',
                      "roomID": '',
                      "dname": '',
                      "dnumber": '',
                    };

                    _this.dialogFormVisible = false;
                  }

                })


              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },

          //这里应该展示全面的信息而不是设备，以后改
            lookDevice(row){
                this.dialogTableVisible = true;
                this.selectedRow = row;
                let roomID = row.roomID;
                let _this = this;
                _this.axios.get("/device/listby/"+roomID,{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.devices = res.data.data;
                })

            },


            handleaddDevice(row){
                this.isUpdateDevice = '添加设备';
                this.deviceForm.roomID = row.roomID;
                this.dialogFormVisible = true;

            },

            change(){
                //这样才能避免为空的时候也能传递数据  因为后台restFul风格下传递的参数不能不传 如果直接写this.xxx
                //当属性为空时  传递不了
                const jsonParams = {
                  roomFloor: this.roomFloor,
                  roomSize: this.roomSize,
                  roomState: this.roomState
                };

              let queryString = Object.keys(jsonParams)
                  .filter(key => jsonParams[key] !== null && jsonParams[key] !== undefined && jsonParams[key] !== '')
                  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(jsonParams[key])}`)
                  .join('&');
              queryString = queryString=='' ? '' : '?'+queryString;
              let url = "/conference-room/listby"+queryString;

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
                this.axios.get("/conference-room/getconditions",{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.floors = res.data.data.floors;
                    _this.types = res.data.data.types;
                    _this.sizes = res.data.data.sizes;
                })
            },

            closeDrawer(){

                this.update=false;
                this.uploadImages=[];
                this.uploadDisabled=false;
                //关闭抽屉时  把数据清空
                this.ruleForm = {
                    roomID:'',
                    roomNo: '',
                    roomFloor: '',
                    roomName:'',
                    roomState: '',
                    roomSize: '',
                };
            },

            updateForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const params = new FormData()
                        // 将上传文件数组依次添加到参数paramsData中
                        this.uploadImages.forEach((x) => {
                          params.append('photo', x.raw);
                        });
                        // 将输入表单数据添加到params表单中，这里使用json格式化传递，后端再把json转成对象
                        params.append('jsonData', JSON.stringify(this.ruleForm));
                        let _this = this;
                        _this.axios.post("/conference-room/add",params,{
                            headers:{
                                "Authorization":localStorage.getItem("token"),
                                'Content-Type' : 'multipart/form-data'
                            }
                        }).then(res=>{
                            _this.$message.success("修改成功");
                            _this.dialog=false;
                            _this.update=false;
                            _this.ruleForm = {
                                roomID:'',
                                roomNo: '',
                                roomFloor: '',
                                roomName:'',
                                roomState: '',
                                roomSize: '',
                            };
                            this.uploadDisabled=false;
                            this.uploadImages=[];
                            _this.getConditions();
                            _this.getAllConferenceRoom();

                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },

            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                      const params = new FormData()
                      // 将上传文件数组依次添加到参数paramsData中
                      this.uploadImages.forEach((x) => {
                        params.append('photo', x.raw);
                      });
                      // 将输入表单数据添加到params表单中，这里使用json格式化传递，后端再把json转成对象
                      params.append('jsonData', JSON.stringify(this.ruleForm));
                        let _this = this;
                        _this.axios.post("/conference-room/add",params,{
                            headers:{
                                "Authorization":localStorage.getItem("token"),
                                'Content-Type' : 'multipart/form-data'
                            }
                        }).then(res=>{
                            _this.$message.success("添加成功");
                            _this.dialog=false;
                            this.ruleForm = {
                                roomID:'',
                                roomNo: '',
                                roomFloor: '',
                                roomName:'',
                                roomState: '',
                                roomSize: '',
                                roomDescription: '',
                            };
                            this.uploadDisabled=false;
                            this.uploadImages=[];
                            _this.getConditions();
                            _this.getAllConferenceRoom();

                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.ruleForm={
                    roomID:'',
                    roomNo: '',
                    roomName:'',
                    roomFloor: '',
                    roomSize: '',
                    roomArea: '',
                    roomState: '',
                    roomDescription: ''
                };
                this.uploadDisabled=false;
                this.uploadImages = [];
            },

            getAllConferenceRoom(){
                let _this = this;
                _this.axios.get("/conference-room/listall",{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.conferenceRooms = res.data.data;
                })
            },

            getState(row){
                this.axios.put("/conference-room/changestate",row,{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                })
            },
            handleEdit(index, row) {
                this.update = true;
                //避免引用传递 当修改时 表单验证没通过 但是改了别的东西 列表显示也会跟着改  不希望出现这样的
                let JsonData = JSON.stringify(row);
                let rowData = JSON.parse(JsonData);

                //判断图片不为空，回显
                if(row.roomPhoto !== null || row.roomPhoto !== ""){
                  this.uploadDisabled = true;
                  this.uploadImages = [{name: row.roomPhoto,  url: row.roomPhoto}];
                }

                //将这个设置为true则打开抽屉
                this.ruleForm=rowData;
                this.dialog=true;
            },
            handleDelete(index, row) {
                let _this = this
                _this.axios.delete("/conference-room/delete/"+row.roomID,{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.$message.success("删除成功")

                    this.getConditions();
                    this.getAllConferenceRoom();
                })
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

<style>
 .mConditions{
     margin-top: 15px;
 }

 .mselect{
      margin-left: 15px;
 }

 /*去除upload组件过渡效果*/
 .el-upload-list__item {
   transition: none !important;
 }

 /* 图片在方框内显示长边 */
 .el-upload-list__item-thumbnail {
   object-fit: scale-down !important;
 }

 /* 有图片不显示上传按钮 */
 .disabled .el-upload--picture-card {
   display: none!important;
 }

</style>