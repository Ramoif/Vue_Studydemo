<template>
  <el-menu
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    background-color="#455483"
    text-color="#fff"
    active-text-color="ffd04b"
  >
    <h3 v-show="!isCollapse" style="font-size: 20px; font-weight: bold;">实习平台系统</h3>
    <h3 v-show="isCollapse">后台</h3>
    <!--  一级菜单  -->
    <el-menu-item :index="item.path"
                  v-for="item in hidePermissions"
                  :key="item.path"
                  @click="clickMenu(item)"
    >
      <i :class="item.icon"></i>
      <span slot="title">{{ item.name }}</span>
    </el-menu-item>
  </el-menu>
</template>

<!--isCollapse决定是否折叠展开左侧导航内容-->
<script>
export default {
  data () {
    return {
      permission: [],
      currentUser: {},
      menu: [
        {
          path: '/',
          name: 'home',
          label: '平台首页',
          icon: 's-home',
          url: 'Home/home'
        },
        {
          path: '/user',
          name: 'user',
          label: '用户管理(*)',
          icon: 'user',
          url: 'User/User'
        },
        {
          path: '/role',
          name: 'role',
          label: '权限管理',
          icon: 'lock',
          url: 'Role/Role'
        },
        {
          path: '/permission',
          name: 'permission',
          label: '权限路由管理',
          icon: 'lock',
          url: 'Role/Permission'
        },
        {
          path: '/contract',
          name: 'contract',
          label: '提交申请表(学生)',
          icon: 'edit',
          url: 'Student/Contract'
        },
        {
          path: '/contractVerify',
          name: 'contractVerify',
          label: '申请表审核(管理)',
          icon: 's-check',
          url: 'Verify/contractVerify'
        },
        {
          path: '/document',
          name: 'document',
          label: '附件上传(学生)',
          icon: 'circle-plus-outline',
          url: 'Student/Document'
        },
        {
          path: '/verify',
          name: 'verify',
          label: '附件审核(管理)',
          icon: 'document-checked',
          url: 'Verify/Verify'
        },
        {
          path: '/appraisal',
          name: 'appraisal',
          label: '实习鉴定(学生)',
          icon: 'data-analysis',
          url: 'Student/Appraisal'
        },
        {
          path: '/teacherAppraisal',
          name: 'teacherAppraisal',
          label: '鉴定表管理(教师)',
          icon: 'bell',
          url: 'Teacher/TeacherAppraisal'
        },
        {
          path: '/appraisalVerify',
          name: 'appraisalVerify',
          label: '实习生一览(管理)',
          icon: 'paperclip',
          url: 'Verify/AppraisalVerify'
        },
        {
          path: '/login',
          name: 'login',
          label: '登录测试',
          icon: 'position',
          url: 'Login/Login'
        },
        {
          path: '/register',
          name: 'register',
          label: '注册测试',
          icon: 'folder-add',
          url: 'Login/Register'
        },
      ]
    }
  },
  created () {
    const userStr = sessionStorage.getItem('user') || '{}'
    this.currentUser = JSON.parse(userStr)
    this.permission = this.currentUser.permissions
  },
  methods: {
    clickMenu (item) {
      this.$router.push({ name: item.name })
      this.$store.commit('selectMenu', item)
    }
  },
  computed: {
    hidePermissions () {
      return this.permission.filter((item) => item.description !== 'hide')
    },
    noChildren () {
      return this.permission.filter((item) => !item.children)
    },
    hasChildren () {
      return this.permission.filter((item) => item.children)
    },
    isCollapse () {
      return this.$store.state.isCollapse
    }
  }
}
</script>

<style lang="scss" scoped>
.el-menu {
  height: 100%;
  border: none;
  overflow-y: auto;

  h3 {
    color: #ffffff;
    text-align: center;
    line-height: 48px;
  }
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 170px;
  height: 100%;
  overflow-y: auto;
}
</style>
