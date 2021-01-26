<template>
    <div class="app-container">
        <div class="filter-container" style="margin:0 0 5px 0" >
            <el-input v-if="is_admin" v-model="listQuery.id" placeholder="课程表id" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-input v-if="is_admin" v-model="listQuery.user_id" placeholder="用户id" style="margin-left: 10px;width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-select v-if="is_admin" v-model="listQuery.cate_id" placeholder="分类" clearable class="filter-item" style="margin-left: 10px;width: 130px" @change="selectCateId">
                <el-option v-for="item in selectCate" :key="item.id+'_'+item.id" :label="item.name" :value="item.id" />
            </el-select>
            <el-select v-if="is_admin" v-model="listQuery.class_id" placeholder="班级" clearable class="filter-item" style="margin-left: 10px;width: 130px">
                <el-option v-for="item in selectClass" :key="item.id+'_'+item.id" :label="item.name" :value="item.id" />
            </el-select>
             <el-select v-else v-model="listQuery.class_id" placeholder="班级" clearable class="filter-item" style="margin-left: 10px;width: 130px">
                <el-option v-for="item in selectUserClass" :key="item.class_id+'_'+item.class_id" :label="item.class_name" :value="item.class_id" />
            </el-select>
            <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
                搜索
            </el-button>
            <el-button v-if="is_admin" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
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
            <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width" >
                <template slot-scope="{row,$index}">
                    <el-button v-if="is_admin" type="primary" size="mini" @click="handleUpdate(row)">
                        编辑
                    </el-button>
                    <el-button v-if="is_admin" size="mini" type="danger" @click="handleDelete(row,$index)">
                        删除
                    </el-button>
                    <el-button type="primary" size="mini" @click="handleDetail(row)">
                        详情
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
                <el-form-item label="分类" prop="cate_id">
                    <el-select v-model="temp.cate_id" placeholder="分类" @change="selectCateId">
                    <el-option v-for="items in selectCate" :key="items.id" :label="items.name" :value="items.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="班级" prop="class_id">
                    <el-select v-model="temp.class_id" placeholder="选择关联班级">
                    <el-option v-for="items in selectClass" :key="items.id" :label="items.name" :value="items.id" />
                    </el-select>
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

        <el-dialog title="详情" :visible.sync="dialogDetailVisible">
            <!-- <p v-for="items in selectCourse" :key="'detail'+items.id">{{ items.id }}、{{ items.title }} {{ items.teacher_name }}</p> -->
            <el-table
                :key="tableKey1"
                :data="selectCourse"
                border
                fit
                highlight-current-row
                style="width: 100%;"
            >
            <el-table-column label="封面" min-width="30px">
                <template slot-scope="{row}">
                    <img :src="row.cover" style="height:40px">
                </template>
            </el-table-column>
            <el-table-column label="课程" min-width="100px">
                <template slot-scope="{row}">
                    <span class="link-type">{{ row.title }}</span>
                </template>
            </el-table-column>
            <el-table-column label="老师" min-width="50px">
                <template slot-scope="{row}">
                    <span class="link-type">{{ row.teacher_name }}</span>
                </template>
            </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogDetailVisible = false">
                    退出
                </el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import { getClass, addClass, updateClass, deleteClass } from '@/api/class'
    import { getTimeTable, addTimeTable, updateTimeTable, deleteTimeTable, getUserClass } from '@/api/timetable'
    import { getCate } from '@/api/cate'
    import { getCourse } from '@/api/course'
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
                tableKey1: 1,
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
                dialogDetailVisible: false,
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
                downloadLoading: false,
                selectCate: {},
                selectClass: {},
                selectCourse: {},
                selectUserClass: {}
            }
        },
        computed:{
            is_admin:function () {
                return this.$store.getters.userinfo.type == 1 ? true : false;
            }
        },
        created() {
            this.getTimeTableList();
            this.getSelectCate();
            this.getUserSelectClass(this.$store.getters.userinfo.type);
        },
        methods: {
            getTimeTableList() {
                this.listLoading = true
                if(this.$store.getters.userinfo.type != 1){
                    this.listQuery.user_id = this.$store.getters.userinfo.id
                }
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
                        this.temp.admin_id = this.$store.getters.id;
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
                this.getSelectClass(row.cate_id);
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
                            this.list.splice(index, 1, response.data)
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
            handleDetail(row) {
                getCourse({
                    limit: 100,
                    class_id: row.class_id
                }).then(response => {
                    //console.log(response)
                    this.selectCourse = response.data.items
                    this.dialogDetailVisible = true
                })
            },
            getSelectCate: function(){
                getCate({
                    limit: 100
                }).then(response => {
                    this.selectCate = response.data.items
                })
            },
            selectCateId: function(val){
                //console.log(val)
                if(Number(val)){
                    this.getSelectClass(val);
                }else{
                    this.selectClass = {}
                }
            },
            getSelectClass: function(cate_id){
                getClass({
                    cate_id: cate_id,
                    limit: 100
                }).then(response => {
                    this.selectClass = response.data.items
                })
            },
            getUserSelectClass: function(type){
                if(type != 1){
                    getUserClass({
                        user_id: this.$store.getters.userinfo.id,
                        limit: 100
                    }).then(response => {
                        this.selectUserClass = response.data.items
                    })
                }
            },
            getSortClass: function(key) {
                const sort = this.listQuery.sort
                return sort == 0 ? 'ascending' : 'descending'
            }
        }
    }
</script>