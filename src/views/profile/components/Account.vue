<template>
  <el-form>
    <el-form-item label="头像">
      <pan-thumb :image="user.avatar" />
      <el-button type="primary" icon="el-icon-upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imagecropperShow=true">
          更换头像
      </el-button>
      <image-cropper
        v-show="imagecropperShow"
        :key="imagecropperKey"
        :width="300"
        :height="300"
        field="file"
        url="http://localhost/api/public/index.php/admin/Upload/execAction"
        lang-type="zh"
        @close="close"
        @crop-upload-success="cropSuccess"
      />
    </el-form-item>
    <el-form-item label="昵称">
      <el-input v-model.trim="user.username" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUser } from '@/api/user'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
export default {
  name: 'userCenter',
  components: { ImageCropper, PanThumb },
  data() {
    return {
      imagecropperShow: false,
      imagecropperKey: 0
    }
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          id:'',
          name: '',
          avatar: ''
        }
      }
    }
  },
  methods: {
    submit() {
      updateUser(this.user).then(response => {
          if(response.status == 1){
            // Just to simulate the time of the request
            this.$message({
              message: 'User information has been updated successfully',
              type: 'success',
              duration: 2 * 1000
            })
          }
      })
    },
    cropSuccess(resData) {
      //console.log(resData)
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.user.avatar = 'http://localhost/api/' + resData.saveName
      this.$store.commit("user/SET_AVATAR", 'http://localhost/api/' + resData.saveName);
    },
    close() {
      this.imagecropperShow = false
    }
  }
}
</script>
