<template>
  <header>
    <div class="l-content">
      <!--控制左侧侧边栏展开-->
      <el-button @click="handleMenu" icon="el-icon-s-fold" size="mini" round>
      </el-button>
      <el-breadcrumb>
        <el-breadcrumb-item :to="{path:'/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="current.path"
                            v-if="current">{{ current.label }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown trigger="click" size="mini">
        <span class="el-dropdown-link">
          <el-avatar v-if="currentUser.avatarUrl" :size="40" :src="currentUser.avatarUrl"/>
          <el-avatar v-if="!currentUser.avatarUrl" :size="40" :src="userImg"/>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <el-button type="text" size="mini" @click="pushToPersonal">
              {{ currentUser.username }}
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-button type="text" size="mini" @click="pushToLogin">退出平台</el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex'
import router from '@/router'

export default {
  data () {
    return {
      // 当前登录用户
      currentUser: {},
      userImg: require('../../assets/images/user.png'),
    }
  },
  created () {
    // 获得sessionStorage中的用户
    const userStr = sessionStorage.getItem('user') || '{}'
    this.currentUser = JSON.parse(userStr)
  },
  methods: {
    handleMenu () {
      this.$store.commit('collapseMenu')
    },
    pushToPersonal () {
      router.push('/personal')
    },
    pushToLogin () {
      sessionStorage.clear()
      this.$store.commit('logout')
      this.$message.success('退出登录成功')
    }
  },
  computed: {
    ...mapState({
      current: state => state.currentMenu,
    }),
  }
}
</script>

<style lang="scss" scoped>
header {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
}

.l-content {
  display: flex;
  align-items: center;

  .el-button {
    margin-right: 20px;
  }
}

.el-breadcrumb__item {
  .el-breadcrumb__inner {
    color: #666;
    font-weight: normal;
  }

  &:last-child {
    .el-breadcrumb__inner {
      color: white;
    }
  }
}

</style>
