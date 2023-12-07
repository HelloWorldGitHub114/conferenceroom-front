<template>
    <div>
        <el-tabs v-model="auditState" @tab-click="handleClick">
            <el-tab-pane key="admin0" name="0">
                <span slot="label"><i class="iconfont icontongguo"></i> 未审核</span>


                <div class="mConditions" style="margin-left: 20px;margin-bottom: 10px">
                  <el-date-picker
                      class="mselect"
                      v-model="searchDate"
                      type="date"
                      placeholder="选择预约日期"
                      :picker-options="pickerOptions"
                      default-time="10:00:00"
                      value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </div>

                <el-table
                        :data="formData.filter(data => !search || data.theme.toLowerCase().includes(search.toLowerCase())||
                data.roomNo.toLowerCase().includes(search.toLowerCase()) ||  data.roomFloor.toLowerCase().includes(search.toLowerCase())
                || data.depName.toLowerCase().includes(search.toLowerCase()))"
                        style="width: 100%"
                        :row-class-name="tableRowClassName">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="会议室名字">
                                    <span>{{ props.row.roomName }}</span>
                                </el-form-item>
                                <el-form-item label="会议摘要">
                                    <span>{{ props.row.digest }}</span>
                                </el-form-item>
                                <el-form-item label="会议人数">
                                    <span>{{ props.row.personCount }}</span>
                                </el-form-item>
                                <el-form-item label="会议时间">
                                    <span>{{ props.row.startTime}} -- {{props.row.endTime}}</span>
                                </el-form-item>
                                <el-form-item label="申请时间">
                                    <span>{{ props.row.applyTime }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="预约编号"
                            prop="applyId"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            label="会议主题"
                            prop="theme"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            label="会议室房号"
                            prop="roomNo"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            label="会议室名字"
                            prop="roomName"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            label="申请用户ID"
                            prop="UserID"
                            align="center">
                    </el-table-column>

                    <el-table-column align="right" >
                        <template slot="header" slot-scope="scope">
                            <el-input
                                    v-model="search"
                                    size="mid"
                                    placeholder="输入主题、房号、申请人ID"/>

                        </template>
                        <template slot-scope="scope">
                            <el-button
                                    size="small"
                                    @click="access(scope.row)"
                                    round
                                    type="success"
                                    style="margin-right: 10px"
                            >通 过</el-button>
                            <el-button
                                    size="small"
                                    type="danger"
                                    round
                                    @click="reject(scope.row)"
                            >驳 回</el-button>
                        </template>

                    </el-table-column>

                </el-table>
                <div style="text-align: center;position:relative;margin-top: 20px">
                    <el-pagination
                            layout="total,prev,pager,next,jumper"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :total="total"
                            :page-size=pageSize
                    >
                    </el-pagination>
                </div>
            </el-tab-pane>

            <el-tab-pane key="admin1" name="1">
                <span slot="label"><i class="iconfont icontongguo"></i> 已批准</span>

                <el-table :data="formData.filter(data => !search || data.theme.toLowerCase().includes(search.toLowerCase())||
                data.roomNo.toLowerCase().includes(search.toLowerCase()) ||  data.UserID.toLowerCase().includes(search.toLowerCase()))"
                        style="width: 100%"
                        :row-class-name="tableRowClassName">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="会议室楼层">
                                    <span>{{ props.row.roomFloor }}</span>
                                </el-form-item>
                                <el-form-item label="会议摘要">
                                    <span>{{ props.row.digest }}</span>
                                </el-form-item>
                                <el-form-item label="会议人数">
                                    <span>{{ props.row.personCount }}</span>
                                </el-form-item>
                                <el-form-item label="会议时间">
                                    <span>{{ props.row.startTime}} -- {{props.row.endTime}}</span>
                                </el-form-item>
                                <el-form-item label="申请时间">
                                    <span>{{ props.row.applyTime }}</span>
                                </el-form-item>
                                <el-form-item label="审核时间">
                                    <span>{{ props.row.auditTime }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="预约编号"
                            prop="applyId"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            label="会议主题"
                            prop="theme"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            label="会议室房号"
                            prop="roomNo"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            label="会议室名称"
                            prop="roomName"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            label="申请用户ID"
                            prop="UserID"
                            align="center">
                    </el-table-column>
                    <el-table-column align="right" >
                        <template slot="header" slot-scope="scope">
                            <el-input
                                    v-model="search"
                                    size="mid"
                                    placeholder="输入主题、房号、申请人ID"/>
                        </template>
                        <template slot-scope="scope">
                            <el-popconfirm
                                    title="确定删除该申请记录吗？"
                                    @onConfirm="handleDelete(scope.row)"
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
                    </el-table-column>
                </el-table>
                <div style="text-align: center;position:relative;margin-top: 20px">
                    <el-pagination
                            layout="total,prev, pager, next,jumper"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :total="total"
                            :page-size=pageSize
                    >
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane key="admin2" name="2">
                <span slot="label"><i class="iconfont icontongguo"></i> 已驳回</span>
                <el-table :data="formData.filter(data => !search || data.theme.toLowerCase().includes(search.toLowerCase())||
                data.roomNo.toLowerCase().includes(search.toLowerCase()) ||  data.UserID.toLowerCase().includes(search.toLowerCase()))"
                        style="width: 100%"
                        :row-class-name="tableRowClassName">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">

                                <el-form-item label="会议摘要">
                                    <span>{{ props.row.digest }}</span>
                                </el-form-item>
                                <el-form-item label="会议人数">
                                    <span>{{ props.row.personCount }}</span>
                                </el-form-item>
                                <el-form-item label="会议时间">
                                    <span>{{ props.row.startTime}} -- {{props.row.endTime}}</span>
                                </el-form-item>
                                <el-form-item label="申请时间">
                                    <span>{{ props.row.applyTime }}</span>
                                </el-form-item>
                                <el-form-item label="审核时间">
                                    <span>{{ props.row.auditTime }}</span>
                                </el-form-item>
                                <el-form-item label="驳回理由">
                                    <span>{{ props.row.rejectReason }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="预约编号"
                            prop="applyId"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            label="会议主题"
                            prop="theme"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            label="会议室房号"
                            prop="roomNo"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            label="会议室名称"
                            prop="roomName"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            label="申请用户ID"
                            prop="UserID"
                            align="center">
                    </el-table-column>
                    <el-table-column align="right" >
                        <template slot="header" slot-scope="scope">
                            <el-input
                                    v-model="search"
                                    size="mid"
                                    placeholder="输入主题、房号、申请人ID"/>
                        </template>
                        <template slot-scope="scope">
                            <el-popconfirm
                                    title="确定删除该申请记录吗？"
                                    @onConfirm="handleDelete(scope.row)"
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
                    </el-table-column>
                </el-table>
                <div style="text-align: center;position:relative;margin-top: 20px">
                    <el-pagination
                            layout="total,prev, pager, next,jumper"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :total="total"
                            :page-size=pageSize
                    >
                    </el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        name: "conferenceRecordByAdmin",
        data(){
            return {
                auditState: '0',
                search: '',
                currentPage: 1,
                total: 1,
                pageSize: 7,

                formData: [
                    {
                        "applyId": 5,
                        "auditStatus": null,
                        "applyTime": "2020-06-24 10:52:11",
                        "auditTime": null,
                        "rejectReason": null,
                        "startTime": "2020-06-24 02:54:59",
                        "endTime": "2020-06-24 03:55:02",
                        "theme": "asdas",
                        "personCount": 12,
                        "digest": "asdasd",
                        "depName":'qww',
                        "depNo": "007",
                        "depEmail":"6191220122@qq.com",
                        "userName":'1',
                        "roomID": null,
                        "roomNo": "302",
                        "roomFloor": "14",
                        "roomName": "小多媒体会议室",
                    },

                ],

              searchDate:'',
            }
        },

        methods:{
            handleDelete(row){
                let _this = this;
                _this.axios.delete("/record/deleteby/"+row.applyId,{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.getTotal(this.auditState);
                    _this.getRecords(this.auditState, this.currentPage);
                    _this.$message({
                        message: '删除记录成功',
                        type: 'success',
                        center: true
                    });
                })
            },

            reject(row){
                this.$prompt('请输入驳回理由', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({ value }) => {
                        let map = {
                            "applyId":row.applyId,
                            "roomID":row.roomID,
                            "startTime":row.startTime,
                            "endTime":row.endTime,
                            "auditState":2,//驳回：状态默认改为2
                            "rejectReason":value,
                            "roomFloor":row.roomFloor,
                            "roomNo":row.roomNo,
                            "theme":row.theme,
                            "applyTime":row.applyTime,
                            "result":'申请被驳回'
                        };

                        let _this = this;
                        _this.axios.put("/record/changeauditstate",map,{
                            headers:{
                                "Authorization":localStorage.getItem("token")
                            }
                        }).then(res=>{
                            _this.getTotal(this.auditState);
                            _this.getRecords(this.auditState, this.currentPage);
                            _this.$message({
                                message: '驳回申请成功',
                                type: 'success',
                                center: true
                            });
                        })
                })
            },

           access(row) {
                let map = {
                    "applyId":row.applyId,
                    "roomID":row.roomID,
                    "startTime":row.startTime,
                    "endTime":row.endTime,
                    "auditState":1,//通过：状态默认改为1
                    "roomFloor":row.roomFloor,
                    "roomNo":row.roomNo,
                    "theme":row.theme,
                    "applyTime":row.applyTime,
                    "result":'申请通过'
                };

                let _this = this;
                _this.axios.put("/record/changeauditstate",map,{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.$message({
                        message: '通过申请成功',
                        type: 'success',
                        center: true
                    });
                    _this.getTotal(this.auditState);
                    _this.getRecords(this.auditState, this.currentPage);
                })
            },
            change(){
                this.currentPage=1;
                this.getTotal(this.auditState);
                this.getRecords(this.auditState, 1);
            },

          tableRowClassName({row, rowIndex}) {
            if (rowIndex === 1) {
              return 'warning-row';
            } else if (rowIndex === 3) {
              return 'success-row';
            } else if (rowIndex === 5) {
              return 'warning-row';
            }
            return '';
          },

            handleCurrentChange(currentPage) {
                this.getTotal(this.auditState);
                this.getRecords(this.auditState, currentPage);
            },

            getRecords(auditState, currentPage)
            {
                //查看所有记录
                let deleted = 2;//表示查询所有的记录（不论删除、未删除）
                deleted = JSON.stringify(deleted);
                //删除是对于用户来说的 用户删除记录后改变deleted为1，指用户无法再看见，但数据库中依然存在该条记录，且管理员可见。
                let _this = this;
                _this.axios.get("/record/listbyconditions/" + auditState + "/" + currentPage + "/" + deleted, {
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                }).then(res => {
                    _this.formData = res.data.data;
                    // console.log(_this.formData);
                    this.ruleForm = {
                        applyId:"",
                        auditStatus: "",
                        applyTime: "",
                        auditTime: "",
                        rejectReason: "",
                        startTime: "",
                        endTime: "",
                        theme: "",
                        personCount:"",
                        digest: "",
                        roomID: "",
                        roomNo: "",
                        roomFloor: "",
                        roomName: "",
                };
                    if(_this.formData.length===0)
                    {
                        let newCurrentPage;
                        if(currentPage!==1) newCurrentPage = currentPage - 1;
                        else newCurrentPage = currentPage;
                        //在审核当前页面最后一个申请时，审核完 刷新数据 但是还是提交的当前页面的页码 查出来肯定是没有数据的。所以页码要减一来查
                        _this.axios.get("/record/listbyconditions/" + auditState + "/" + newCurrentPage + "/" + deleted, {
                            headers: {
                                "Authorization": localStorage.getItem("token")
                            }
                        }).then(res => {
                            _this.formData = res.data.data;
                            _this.currentPage  = newCurrentPage;

                        })
                    }else {

                        //不是这种情况的话就还是等于当前页面
                        _this.currentPage = currentPage;
                    }
                });
            },

            handleClick() {
                this.getTotal(this.auditState);
                this.getRecords(this.auditState, 1);
                this.currentPage = 1;
            },

            getTotal(auditState)
            {
                let deleted = 2;
                this.axios.get("/record/gettotal/" + auditState +  "/" + deleted, {
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                }).then(res => {
                    this.total = res.data.data;
                    console.log("Total Records:", this.total);
                });
            }
        },

        created()
        {
            this.getTotal(this.auditState);
            this.getRecords(this.auditState, 1);
        }
    }
</script>

<style scoped>

</style>