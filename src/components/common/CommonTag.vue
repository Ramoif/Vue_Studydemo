<template>
  <div class="tabs">
    <!--要实现删除后的跳转需要在v-for中加上index参数-->
    <el-tag
      v-for="(tag,index) in tags"
      :key="tag.name"
      size="medium"
      :closable="tag.name !== 'home'"
      :effect="$route.name === tag.name ? 'dark' : 'plain'"
      @click="changeMenu(tag)" @close="handleClose(tag,index)"
    >
      {{ tag.label }}
    </el-tag>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState({
      tags: (state) => state.tab.tabsList,
    })
  },
  methods: {
    ...mapMutations({
      close: 'closeTag'
    }),
    changeMenu (item) {
      this.$router.push({ name: item.name })
      this.$store.commit('selectMenu', item)
    },
    // 删除tag标签
    handleClose (tag, index) {
      let length = this.tags.length - 1
      this.close(tag)
      // 判断是不是最后一个，最后一个不能删除

      if (tag.name !== this.$route.name) {
        return
      }
      if (index === length) {
        // 向左跳转
        this.$router.push({
          name: this.tags[index - 1].name,
        })
      } else {
        // 向右边跳转
        this.$router.push({ name: this.tags[index].name })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs {
  padding: 15px 20px 0 215px;
  position: fixed;

  .el-tag {
    margin-right: 15px;
    cursor: pointer;
  }
}
</style>
