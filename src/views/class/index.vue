<template>
    <div class="app-container">
        <div class="filter-container" style="margin:0 0 5px 0">
            <el-input v-model="listQuery.id" placeholder="班级id" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-input v-model="listQuery.name" placeholder="班级名称" style="margin-left: 10px;width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-select v-model="listQuery.cate_id" placeholder="分类" clearable class="filter-item" style="margin-left: 10px;width: 130px">
                <el-option v-for="item in selectCate" :key="item.id+'_'+item.id" :label="item.name" :value="item.id" />
            </el-select>
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
            <el-table-column label="名称" min-width="50px">
                <template slot-scope="{row}">
                    <span class="link-type">{{ row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="分类" min-width="50px">
                <template slot-scope="{row}">
                    <span class="link-type">{{ row.cate_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="招生" min-width="50px">
                <template slot-scope="{row}">
                    <span class="link-type">{{ row.num }}</span>
                </template>
            </el-table-column>
            <el-table-column label="日期" width="170px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.dated }}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建者" width="110px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.admin_name }}</span>
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

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getClassList" />

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="temp.name" />
                </el-form-item>
                <el-form-item label="分类" prop="cate_id">
                    <el-select v-model="temp.cate_id" placeholder="选择所属分类" clearable>
                        <el-option v-for="items in selectCate" :key="items.id" :label="items.name" :value="items.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="招生" prop="num">
                    <el-input v-model="temp.num" />
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
    import { getCate } from '@/api/cate'
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
                    name: '',
                    cate_id: '',
                    num: ''
                },
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: '编辑',
                    create: '添加'
                },
                dialogPvVisible: false,
                rules: {
                    name: [{ required: true, message: 'name is required', trigger: 'blur' }],
                    cate_id: [{ required: true, message: 'cate_id is required', trigger: 'blur' }],
                    num: [{ required: true, message: 'nu is required', trigger: 'blur' }]
                },
                downloadLoading: false,
                selectCate: {}
            }
        },
        created() {
            this.getClassList();
            if(JSON.stringify(this.selectCate) == '{}'){
                this.getSelectCate();
            }
        },
        methods: {
            getClassList() {
                this.listLoading = true
                getClass(this.listQuery).then(response => {
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
                this.getClassList()
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
                    name: '',
                    cate_id: '',
                    num: ''
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
                        addClass(this.temp).then((response) => {
                            response.data.admin_name = this.$store.getters.username
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
                        updateClass(tempData).then((response) => {
                            const index = this.list.findIndex(v => v.id === this.temp.id)
                            this.temp.cate_name = response.data.cate_name
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
                deleteClass({id: row.id}).then((response) => {
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
            },
            getSelectCate: function(){
                getCate({
                    limit: 100
                }).then(response => {
                    this.selectCate = response.data.items
                })
            },
        }
    }
</script>
