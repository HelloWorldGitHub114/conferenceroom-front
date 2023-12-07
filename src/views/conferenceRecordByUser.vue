<template>
    <div>
        <el-tabs v-model="auditState" @tab-click="handleClick">


            <el-tab-pane key="user1" name="1">
                <span slot="label"><i class="iconfont icontongguo"></i> 已批准</span>
                <el-table
                        :data="formData.filter(data => !search || data.theme.toLowerCase().includes(search.toLowerCase())||
                data.roomNo.toLowerCase().includes(search.toLowerCase()) ||  data.roomFloor.toLowerCase().includes(search.toLowerCase()))"
                        style="width: 100%"
                        :row-class-name="tableRowClassName">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="会议室楼层">
                                    <span>{{ props.row.roomFloor }}</span>
                                </el-form-item>
                                <el-form-item label="会议概要">
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
                        prop="applyId">
                    </el-table-column>
                    <el-table-column
                        label="会议主题"
                        prop="theme">
                    </el-table-column>
                    <el-table-column
                        label="会议室房号"
                        prop="roomNo">
                    </el-table-column>
                  <el-table-column
                      label="会议室名称"
                      prop="roomName"
                      align="center">
                  </el-table-column>
                    <el-table-column align="right" >
                        <template slot="header" slot-scope="scope">
                            <el-input
                                    v-model="search"
                                    size="mid"
                                    placeholder="输入预约号、主题、房号等"/>
                        </template>
                        <template slot-scope="scope" v-if="!isEmployee">
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


            <el-tab-pane  key="user0" name="0">
                <span slot="label"><i class="iconfont icontongguo"></i> 未审核</span>
                <el-table
                        :data="formData.filter(data => !search || data.theme.toLowerCase().includes(search.toLowerCase())||
                data.roomNo.toLowerCase().includes(search.toLowerCase()) ||  data.roomFloor.toLowerCase().includes(search.toLowerCase()))"
                        style="width: 100%"
                        :row-class-name="tableRowClassName">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="会议室楼层">
                                    <span>{{ props.row.roomFloor }}</span>
                                </el-form-item>
                                <el-form-item label="会议概要">
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
                      prop="applyId">
                  </el-table-column>
                  <el-table-column
                      label="会议主题"
                      prop="theme">
                  </el-table-column>
                  <el-table-column
                      label="会议室房号"
                      prop="roomNo">
                  </el-table-column>
                  <el-table-column
                      label="会议室名称"
                      prop="roomName">
                  </el-table-column>
                    <el-table-column align="right" >
                        <template slot="header" slot-scope="scope">
                            <el-input
                                    v-model="search"
                                    size="mid"
                                    placeholder="输入预约号、主题、房号等"/>
                        </template>
                        <template slot-scope="scope">
                            <el-button
                                    size="small"
                                    @click="handleEdit(scope.$index, scope.row)"
                                    round
                                    type="danger"
                                    style="margin-right: 10px">撤 回</el-button>
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



            <el-tab-pane key="user2"  name="2">
                <span slot="label"><i class="iconfont icontongguo"></i> 已驳回</span>
                <el-table
                        :data="formData.filter(data => !search || data.theme.toLowerCase().includes(search.toLowerCase())||
                data.roomNo.toLowerCase().includes(search.toLowerCase()) ||  data.roomFloor.toLowerCase().includes(search.toLowerCase()))"
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
                                <el-form-item label="驳回理由">
                                    <span>{{ props.row.rejectReason }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="预约编号"
                        prop="applyId">
                    </el-table-column>
                    <el-table-column
                        label="会议主题"
                        prop="theme">
                    </el-table-column>
                    <el-table-column
                        label="会议室房号"
                        prop="roomNo">
                    </el-table-column>
                  <el-table-column
                      label="会议室名称"
                      prop="roomName"
                      align="center">
                  </el-table-column>


                    <el-table-column align="right" >
                        <template slot="header" slot-scope="scope">
                            <el-input
                                    v-model="search"
                                    size="mid"
                                    placeholder="输入预约号、主题、房号等"/>
                        </template>
                        <template slot-scope="scope"  v-if="!isEmployee">
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
    import Cookies from 'js-cookie';
    import Id from "element-ui/src/locale/lang/id";
    export default {
        name: "ConferenceRecordByUser",
        data(){
            return{
                isEmployee:false,
                auditState: '1',
                formData:[
                    {
                    "applyId": 1,
                    "auditStatus": null,
                    "applyTime": "2023-12-5 10:52:11",
                    "auditTime": "2023-12-5 11:45:14",
                    "rejectReason": 'no',
                    "startTime": "2023-12-24 02:54:59",
                    "endTime": "2023-12-24 03:55:02",
                    "theme": "会议室主题",
                    "personCount": 12,
                    "digest": "asdasd",
                    "roomID": null,
                    "roomNo": "302",
                    "roomFloor": "14",
                    "roomName": "小多媒体会议室"
                 },
                ],
                search:'',
                currentPage:1,
                total:1,
                pageSize:7,
                id:''
            }
        },
        methods: {

            handleDelete(row){
               let _this = this;
               _this.axios.delete("/record/delete/"+row.applyId,{
                   headers:{
                       "Authorization":localStorage.getItem("token")
                   }
               }).then(res=>{
                   _this.getRecords(this.depName, this.auditState, this.currentPage);
                   _this.getTotal();
                   _this.$message({
                       message: '删除记录成功',
                       type: 'success',
                       center: true
                   });
               })
            },

            handleEdit(index, row) {
                let _this = this;
                this.axios.put("/record/recallapply", {"applyId": row.applyId}, {
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                }).then(res => {

                    //加分页了 这里这个1要更改
                    _this.getRecords(this.depName, this.auditState, this.currentPage);

                    _this.$message({
                        message: '撤销申请成功',
                        type: 'success',
                        center: true
                    });
                })
            },

            getTotal(){
                let _this = this;
                console.log(_this.id);
                this.axios.get("/record/gettotalbyuser/" + _this.id + "/" + _this.auditState, {
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                }).then(res => {
                    _this.total = res.data.data;
                });
            },

            getRecords(auditState, currentPage)
            {
                let _this = this;
                this.axios.get("/record/getbyuser/" + _this.id + "/" + _this.auditState + "/" + _this.currentPage, {
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                }).then(res => {
                    _this.formData = res.data.data;
                    _this.currentPage  = currentPage;
                });

            },

            handleClick() {
                this.getRecords(this.depName, this.auditState, 1)
                this.getTotal();
                this.currentPage = 1;
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
                this.getRecords(this.auditState, currentPage);
            },
        },
            created() {
                let _this = this;
                this.id = JSON.parse(Cookies.get("userInfo")).userID;
                console.log(this.id);
                _this.getTotal();
                _this.getRecords(_this.auditState,1);

            }
    }
</script>

<style>
    .demo-table-expand {
        font-size: 0;

    }
    .demo-table-expand label{
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

    .center{
        text-align: center;
    }

</style>