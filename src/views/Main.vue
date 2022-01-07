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
      <common-tag></common-tag>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import CommonAside from '../components/CommonAside.vue'
import CommonHeader from '../components/CommonHeader.vue'
import CommonTag from '../components/CommonTag.vue'

export default {
  name: 'Main',
  components: {
    CommonAside,
    CommonHeader,
    CommonTag
  },
}
</script>

<!--添加样式-->
<style lang="scss">

.el-header {
  background-image: linear-gradient(#fff, #a7b8fa);
}

.el-main {
  padding-top: 0;
}
</style>
