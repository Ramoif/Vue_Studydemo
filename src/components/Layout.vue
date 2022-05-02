<template>
  <el-container style="height: 100%">
    <!-- 伸缩侧边栏 -->
    <el-aside width="auto" style="height: 100%;">
      <common-aside></common-aside>
    </el-aside>
    <el-container>
      <el-header>
        <common-header></common-header>
      </el-header>
      <!-- 面包屑
      <common-tag></common-tag>
      -->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import CommonAside from '@/components/common/CommonAside.vue'
import CommonHeader from '@/components/common/CommonHeader.vue'
import CommonTag from '@/components/common/CommonTag.vue'

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
  margin-bottom: 20px;
}

.el-main {
  padding-top: 0;
}
</style>
