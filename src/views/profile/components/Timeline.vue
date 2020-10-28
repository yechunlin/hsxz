<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.timestamp" placement="top">
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeline: [
        {
          timestamp: '2020-10-28 20:46:22',
          title: '修改',
          content: '用户中心去掉角色描述'
        },
        {
          timestamp: '2020-10-27 17:21:47',
          title: '添加',
          content: '添加班级水彩笔绘画'
        },
        {
          timestamp: '2020-10-26 18:01:39',
          title: '删除',
          content: '删除上传的测试视频'
        }
      ]
    }
  }
}
</script>
