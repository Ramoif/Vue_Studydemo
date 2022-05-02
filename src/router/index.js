import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

// 解决重复导航错误
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/Login')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/Login/Register')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/404')
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 重置路由方法
export const resetRouter = () => {
  router.matcher = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
  })
}

// 注意：刷新页面会导致页面路由重置
export const setRoutes = () => {
  const storeMenus = localStorage.getItem('permissions')
  if (storeMenus) {
    // 获取当前的路由对象名称数组，每次调用方法判断是否包含动态路由
    const currentRouteNames = router.getRoutes().map(v => v.name)
    if (!currentRouteNames.includes('Layout')) {
      // 拼装动态路由
      const manageRoute = {
        path: '/',
        name: 'Layout',
        component: () => import('../components/Layout.vue'),
        redirect: '/home',
        children: [
          {
            path: '/personal',
            name: '个人信息',
            component: () => import('../views/Home/Personal.vue')
          }
        ]
      }
      const menus = JSON.parse(storeMenus)
      // 对获取到的permission表信息，动态组成
      menus.forEach(item => {
        // 当且仅当path不为空的时候才去设置路由
        if (item.path) {
          // 将路径中的/取代掉
          const itemMenu = {
            path: item.path.replace('/', ''),
            name: item.name,
            component: () => import('../views/' + item.pagePath + '.vue')
          }
          manageRoute.children.push(itemMenu)
        } else if (item.children.length) {
          item.children.forEach(item => {
            if (item.path) {
              const itemMenu = {
                path: item.path.replace('/', ''),
                name: item.name,
                component: () => import('../views/' + item.pagePath + '.vue')
              }
              manageRoute.children.push(itemMenu)
            }
          })
        }
      })
      // 动态添加到现在的路由对象中去
      router.addRoute(manageRoute)
    }
  }
}

// 重置再set一次路由
setRoutes()

router.beforeEach((to, from, next) => {
  // 设置当前的路由名称
  localStorage.setItem('currentPathName', to.name)
  store.commit('setPath')
  // 未找到路由的情况
  if (!to.matched.length) {
    const storeMenus = localStorage.getItem('permissions')
    // 查询权限表，查看是否有权限，若没有则跳转到404页面
    if (storeMenus) {
      next('/404')
    } else {
      // 跳回登录页面
      next('/login')
    }
  }
  // 其他的情况都放行
  next()
})

export default router
