<template>
    <div class="app-container">
        <div class="filter-container" style="margin:0 0 5px 0">
            <el-input v-model="listQuery.id" placeholder="视频id" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-input v-model="listQuery.class_id" placeholder="班级id" style="margin-left: 10px;width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-input v-model="listQuery.course_id" placeholder="课程id" style="margin-left: 10px;width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
            <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortCourse('id')">
                <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="视频" >
                <template slot-scope="{row}">
                    <video :src="row.path" controls style="width:270px;max-height:150px"></video>
                </template>
            </el-table-column>
            <el-table-column label="所属班级" width="170px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.class_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="所属课程" width="280px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.course_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="上传时间" width="170px" align="center">
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
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getVideoList" />

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 800px; margin-left:50px;">
                <el-form-item label="视频" prop="path">
                        <div class="image-preview">
                            <div class="image-preview-wrapper">
                                <video :src="temp.path" controls style="width:270px;max-height:180px"></video>
                            </div>
                        </div>
                        <el-upload
                        multiple
                        :show-file-list="false"
                        :auto-upload="false"
                        :on-change="(file) => {videoUploadAction(file)}"
                        class="image-uploader"
                        drag
                        >
                        <i class="el-icon-upload" />
                        <div class="el-upload__text">
                            将视频拖到此处，或<em>点击上传</em>
                        </div>
                        </el-upload>
                        <el-progress type="line" :percentage="percentage" :status="proStatus" :class="typePro"></el-progress>
                </el-form-item>
                
                <el-form-item label="所属班级" prop="class_id">
                    <el-select v-model="temp.class_id" placeholder="选择关联班级" @change="classIdChange(temp.class_id)">
                    <el-option v-for="items in selectClass" :key="items.id" :label="items.name" :value="items.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="所属课程" prop="course_id">
                    <el-select v-model="temp.course_id" placeholder="选择关联课程">
                    <el-option v-for="items in selectCourse" :key="items.id" :label="items.title" :value="items.id" />
                    </el-select>
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
    import { getCourse} from '@/api/course'
    import { getClass } from '@/api/class'
    import { getUser } from '@/api/user'
    import { getVideo, addVideo, deleteVideo } from '@/api/video'
    import waves from '@/directive/waves' // waves directive
    import { parseTime } from '@/utils'
    import Pagination from '@/components/Pagination' // secondary package based on el-pagination
    import ImageCropper from '@/components/ImageCropper'
import { setTimeout } from 'timers';

    export default {
        name: 'videoList',
        components: { Pagination, ImageCropper },
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
                    sort: 1
                },
                showReviewer: false,
                temp: {
                    path: '',
                    class_id: '',
                    course_id: ''
                },
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: '编辑',
                    create: '添加'
                },
                dialogPvVisible: false,
                rules: {
                    patch: [{ required: true, message: 'title is required', trigger: 'blur' }],
                    class_id: [{ required: true, message: 'class_id is required', trigger: 'blur' }],
                    course_id: [{ required: true, message: 'course_id is required', trigger: 'blur' }]
                },
                selectClass: {},
                selectCourse: {},
                selectTeacher: {},

                fileObject: null,
                fileName: 'file',//input标签name属性名称
                fileIdName: '', //input标签id属性名称
                saveFileName: '',//服务端保存文件名
                saveFileExtention: '',//服务端保存文件后缀名
                saveFileType: '',//服务端保存文件类型
                uploadFileObj: null, //获取文件对象
                chunkSize: 1*1024*1024, //分片文件大小 1M
                uploadChunkNum: 0, //计算需要上传多少次，方便显示进度
                uploadTimes: 0, //用于进度显示，当前属于哪一次
                httpRequestUrl: 'http://localhost/api/public/index.php/admin/Upload/execActionBlod',// 服务端api
                fileStart: 0, // 分片进度
                percentage: 0, //进度
                proStatus: 'warning',
                typeProCode: 0
            }
        },
        created() {
            this.getVideoList();
        },
        computed:{
            typePro: function(){
                return this.typeProCode ? 'showPro' : 'hidePro';
            }
        },
        methods: {
            getVideoList() {
                this.listLoading = true
                getVideo(this.listQuery).then(response => {
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
                this.getVideoList()
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
                    path: '',
                    class_id: '',
                    course_id: ''
                }
            },
            handleCreate() {
                this.resetTemp()
                if(JSON.stringify(this.selectClass) == '{}'){
                    this.getSelectClass();
                }
                this.selectCourse = {}
                this.dialogStatus = 'create'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            createData() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        this.temp.admin_id = this.$store.getters.id;//admin_id
                        addVideo(this.temp).then((response) => {
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
                if(JSON.stringify(this.selectClass) == '{}'){
                    this.getSelectClass();
                }
                this.temp = Object.assign({}, row) // copy obj
                this.dialogStatus = 'update'
                this.dialogFormVisible = true
                this.getSelectCourse(this.temp.class_id);
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            updateData() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        const tempData = Object.assign({}, this.temp)
                        updateCourse(tempData).then((response) => {
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
                deleteVideo({id: row.id}).then((response) => {
                    this.$notify({
                        title: 'Success',
                        message: 'Delete Successfully',
                        type: 'success',
                        duration: 2000
                    })
                    this.list.splice(index, 1)
                })
            },
            classIdChange: function(res){
                this.getSelectCourse(res);
            },
            getSelectClass: function(){
                getClass({
                    limit: 100
                }).then(response => {
                    this.selectClass = response.data.items
                })
            },
            getSelectCourse: function(class_id){
                getCourse({
                    class_id: class_id,
                    limit: 100
                }).then(response => {
                    this.selectCourse = response.data.items
                })
            },
            getSortCourse: function(key) {
                const sort = this.listQuery.sort
                return sort == 0 ? 'ascending' : 'descending';
            },
            videoUploadAction(file){
                //获取到选中的文件
                this.fileObject = file.raw;
                //多次在同一个input上选择文件，当取消时，会出现file为undefined
                if(typeof(this.fileObject) == 'undefined') return ;
                
                this.uploadChunkNum = Math.ceil(this.fileObject.size/this.chunkSize);
                var index = this.fileObject.name.lastIndexOf('.');
                this.saveFileExtention = this.fileObject.name.substring(index + 1);//获取文件后缀
                this.saveFileType = this.fileObject.type;//获取文件类型
                //通报.开始上传
                this.uploadStart({
                    'fileName' : this.fileObject.name,
                    'fileSize' : this.fileObject.size,
                    'fileType' : this.fileObject.type
                });
                this.typeProCode = 1;
                //进行文件上传
                this.execUpload();
            },
            init(){
                this.uploadTimes = 0;
                this.fileStart = 0;
                this.saveFileName = '';
                this.saveFileExtention = '';
                this.saveFileType = '';
	        },
            execUpload(){
                var that = this;
                //先声明一个异步请求对象
                var xmlHttpReg = null;
                if (window.ActiveXObject) {
                    xmlHttpReg = new ActiveXObject("Microsoft.XMLHTTP");
                } else if (window.XMLHttpRequest) {
                    xmlHttpReg = new XMLHttpRequest(); 
                }
                if(this.fileStart < this.fileObject.size){
                    //切片
                    var blob = this.fileObject.slice(this.fileStart, this.fileStart + this.chunkSize);
                    this.fileStart = this.fileStart + blob.size;
                    //创建formdata对象
                    var formData = new FormData();
                    formData.append(this.fileName,blob);//文件包
                    formData.append('get_file_name',this.fileName);//file的name属性名
                    formData.append('save_file_name',this.saveFileName);//服务端保存文件名
                    formData.append('save_file_extention',this.saveFileExtention);//扩展名
                    formData.append('save_file_type',this.saveFileType);//文件类型
                    if(this.fileStart >= this.fileObject.size){
                        //最后一次片包，通知服务端
                        formData.append('save_file_chunk_last',1);//文件类型
                    }

                    //如果实例化成功,就调用open()方法,就开始准备向服务器发送请求
                    if (xmlHttpReg != null) {
                        xmlHttpReg.open('post', this.httpRequestUrl, true);
                        //xmlHttpReg.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                        xmlHttpReg.send(formData);//传参
                        xmlHttpReg.onreadystatechange =  function () {
                            if (xmlHttpReg.readyState == 4 && xmlHttpReg.status == 200) { 
                                    var data = JSON.parse(xmlHttpReg.response);//对返回数据做对象转换
                                    if(data.status == 1){
                                        //通报.上传进度
                                        that.progress({
                                            'size' : that.fileObject.size,
                                            'needUploadNum' : that.uploadChunkNum,
                                            'thisTurn' : ++that.uploadTimes,
                                            'havefinished' : (that.fileStart/that.fileObject.size) * 100
                                        });
                                        
                                        that.saveFileName = data.data.saveFileName;
                                        if(that.fileStart >= that.fileObject.size){
                                            //通报.上传完成
                                            that.uploadSuccess(data.data);
                                        }
                                        //递归，持续上传
                                        that.execUpload();
                                    }
                            }
                        }
                    }
                }else{
                    this.init();
                }
            },
            uploadStart(data){
                //console.log(data)
            },
            progress(data){
                //console.log(data)
                this.percentage = data.havefinished;
            },
            uploadSuccess(data){
                //console.log(data)
                var that = this;
                this.proStatus = 'success';
                this.temp.path = 'http://localhost/api/' + data.saveFilePath + data.saveFileName;
                setTimeout(function(){
                    that.typeProCode = 0;
                }, 1000);
            },
            rmVideo(){
                this.temp.path = '';
            }
        }
    }
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.image-uploader {
width: 35%;
float: left;
}
.image-preview {
    max-width:350px;
    min-width:200px;
    height: 180px;
    position: relative;
    border: 1px dashed #d9d9d9;
    float: left;
    .image-preview-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .image-preview-action {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        cursor: default;
        text-align: center;
        color: #fff;
        opacity: 0;
        font-size: 20px;
        background-color: rgba(0, 0, 0, .5);
        transition: opacity .3s;
        cursor: pointer;
        text-align: center;
        line-height: 200px;
        .el-icon-delete {
            font-size: 36px;
        }
    }
    &:hover {
        .image-preview-action {
            opacity: 1;
        }
    }
}
.showPro{
    display:block;
}
.hidePro{
    display:none
}
</style>
