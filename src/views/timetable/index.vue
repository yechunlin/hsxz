<template>
    <div class="app-container">
        <div class="filter-container" style="margin:0 0 5px 0">
            <el-input v-model="listQuery.id" placeholder="课程表id" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-input v-model="listQuery.user_id" placeholder="用户id" style="margin-left: 10px;width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-input v-model="listQuery.class_id" placeholder="班级id" style="margin-left: 10px;width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
                搜索
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
                添加
            </el-button>
        </div>

        <el-table
                :key="tableKey"
                v-loading="listLoading"
                :data="list"
                border
                fit
                highlight-current-row
                style="width: 100%;"
                @sort-change="sortChange"
        >
            <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
                <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="用户" min-width="50px">
                <template slot-scope="{row}">
                    <span class="link-type">{{ row.user_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="班级" min-width="100px">
                <template slot-scope="{row}">
                    <span class="link-type">{{ row.class_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="开始日期" width="170px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.start_dated }}</span>
                </template>
            </el-table-column>
            <el-table-column label="结束日期" width="170px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.end_dated }}</span>
                </template>
            </el-table-column>
            <el-table-column label="报名日期" width="170px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.dated }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}">
                    <el-button type="primary" size="mini" @click="handleUpdate(row)">
                        编辑
                    </el-button>
                    <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getTimeTableList" />

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
                <el-form-item label="用户ID" prop="user_id">
                    <el-input v-model="temp.user_id" />
                </el-form-item>
                <el-form-item label="班级ID" prop="class_id">
                    <el-input v-model="temp.class_id" />
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker v-model="temp.start_dated" type="date" placeholder="开始时间" value-format="yyyy-MM-dd" style="width: 100%;" />
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker v-model="temp.end_dated" type="date" placeholder="结束时间" value-format="yyyy-MM-dd" style="width: 100%;" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">
                    退出
                </el-button>
                <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
                    提交
                </el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import { getClass, addClass, updateClass, deleteClass } from '@/api/class'
    import { getTimeTable, addTimeTable, updateTimeTable, deleteTimeTable } from '@/api/timetable'
    import waves from '@/directive/waves' // waves directive
    import { parseTime } from '@/utils'
    import Pagination from '@/components/Pagination' // secondary package based on el-pagination


    export default {
        name: 'calssList',
        components: { Pagination },
        directives: { waves },

        data() {
            return {
                tableKey: 0,
                list: null,
                total: 0,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 20,
                    status: 1,
                    sort1: 1
                },
                showReviewer: false,
                temp: {
                    user_id: '',
                    class_id: '',
                    start_dated: '',
                    end_dated: ''
                },
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: '编辑',
                    create: '添加'
                },
                dialogPvVisible: false,
                rules: {
                    user_id: [{ required: true, message: 'user_id is required', trigger: 'blur' }],
                    class_id: [{ required: true, message: 'class_id is required', trigger: 'blur' }],
                    start_dated: [{ required: true, message: 'start_dated is required', trigger: 'blur' }],
                    end_dated: [{ required: true, message: 'end_dated is required', trigger: 'blur' }]
                },
                downloadLoading: false
            }
        },
        created() {
            this.getTimeTableList();
        },
        methods: {
            getTimeTableList() {
                this.listLoading = true
                getTimeTable(this.listQuery).then(response => {
                    //console.log(response.data);
                    this.list = response.data.items
                    this.total = response.data.total
                    // Just to simulate the time of the request
                    setTimeout(() => {
                        this.listLoading = false
                    }, 1000)
                })
            },
            handleFilter() {
                this.listQuery.page = 1
                this.getTimeTableList()
            },
            handleModifyStatus(row, status) {
                this.$message({
                    message: '操作Success',
                    type: 'success'
                })
                row.status = status
            },
            sortChange(data) {
                const { prop, order } = data
                if (prop === 'id') {
                    this.sortByID(order)
                }
            },
            sortByID(order) {
                if (order === 'ascending') {
                    this.listQuery.sort = 0
                } else {
                    this.listQuery.sort = 1
                }
                this.handleFilter()
            },
            resetTemp() {
                this.temp = {
                    user_id: '',
                    class_id: '',
                    start_dated: '',
                    end_dated: ''
                }
            },
            handleCreate() {
                this.resetTemp()
                this.dialogStatus = 'create'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            createData() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        this.temp.admin_id = 1;
                        addTimeTable(this.temp).then((response) => {
                            this.list.unshift(response.data)
                            this.dialogFormVisible = false
                            this.$notify({
                                title: 'Success',
                                message: 'Created Successfully',
                                type: 'success',
                                duration: 2000
                            })
                        })
                    }
                })
            },
            handleUpdate(row) {
                this.temp = Object.assign({}, row) // copy obj
                this.dialogStatus = 'update'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            updateData() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        const tempData = Object.assign({}, this.temp)
                        updateTimeTable(tempData).then((response) => {
                            const index = this.list.findIndex(v => v.id === this.temp.id)
                            this.list.splice(index, 1, this.temp)
                            this.dialogFormVisible = false
                            this.$notify({
                                title: 'Success',
                                message: 'Update Successfully',
                                type: 'success',
                                duration: 2000
                            })
                        })
                    }
                })
            },
            handleDelete(row, index) {
                deleteTimeTable({id: row.id}).then((response) => {
                    this.$notify({
                        title: 'Success',
                        message: 'Delete Successfully',
                        type: 'success',
                        duration: 2000
                    })
                    this.list.splice(index, 1)
                })
            },
            getSortClass: function(key) {
                const sort = this.listQuery.sort
                return sort == 0 ? 'ascending' : 'descending'
            }
        }
    }
</script>