<template>
  <!-- 设置高度100% -->
  <el-container style="height: 100%">
    <!-- 伸缩侧边栏 -->
    <el-aside width="auto">
      <common-aside></common-aside>
    </el-aside>
    <el-container>
      <el-header>
        <common-header></common-header>
      </el-header>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>

import CommonAside from '../components/CommonAside.vue'
import CommonHeader from '../components/CommonHeader.vue'

export default {
  name: 'Main',
  components: {
    CommonAside,
    CommonHeader
  },
}
</script>

<!--添加样式-->
<style lang="scss" scoped>
.el-container{

}

.el-header {
  background: #333;
}

.el-main {
  padding-top: 0;
}
</style>
