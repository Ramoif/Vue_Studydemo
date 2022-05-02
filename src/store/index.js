import Vue from 'vue'
import Vuex from 'vuex'
import router, { resetRouter } from '@/router'

Vue.use(Vuex)

const store = new Vuex.Store({
  isCollapse: false,
  currentMenu: null,
  state: {
    currentPathName: '',
    tabsList: [
      {
        path: '/',
        name: 'home',
        label: '首页',
        icon: 'home'
      }
    ]
  },
  mutations: {
    collapseMenu (state) {
      store.isCollapse = !(store.isCollapse)
    },
    setPath (state) {
      state.currentPathName = localStorage.getItem('currentPathName')
    },
    logout () {
      // 清空缓存
      sessionStorage.removeItem('user')
      localStorage.removeItem('permissions')
      router.push('/login')
      // 重置路由
      resetRouter()
    },
    selectMenu (state, val) {
      val.name === 'home' ? (state.currentMenu = null) : state.currentMenu = val
      if (val.name === 'home') {
        state.currentMenu = null
      } else {
        state.currentMenu = val
        // 新增
        const result = state.tabsList.findIndex(item => item.name === val.name)
        // eslint-disable-next-line no-unused-expressions
        result === -1 ? state.tabsList.push(val) : ''
      }
    },
    closeTag (state, val) {
      const result = state.tabsList.findIndex(item => item.name === val.name)
      state.tabsList.splice(result, 1)
    }
  }
})

export default store
