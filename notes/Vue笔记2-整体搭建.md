# Vue笔记2-整体搭建

第一篇讲解了一些基本的用法和环境构建。

接下来开始为后台管理做前端准备。



##布局简单搭建

打开[Element-ui-Container布局容器](https://element.eleme.io/#/zh-CN/component/container)找到其中复合我们预期的布局。我们选择倒数第二个布局样式：

```vue
<el-container>
  <el-aside width="200px">Aside</el-aside>
  <el-container>
    <el-header>Header</el-header>
    <el-main>Main</el-main>
  </el-container>
</el-container>
```

我们想更换views目录下的Home.vue为Main.vue，更名操作需要改变的步骤如下：

1. 重命名`views目录`下的`Home.vue`为`Main.vue`

2. `views目录`下删除`Main.vue`中`template`内的内容，替换为上面的布局样式
3. `views目录`下更换`Main.vue`中`export default`中的`name`为`Main`，若components中有内容也删除
4. 修改`router目录`下`index.js`中`import`和`const routes`中关于`Home`的内容替换为`Main`



保存以后查看8080端口，是否变化。如果没有变化，则需要去修改按需引入中的内容，添加：

```js
import {Button, Select, Radio, Container, Aside, Header, Main} from 'element-ui';
```



然后先去App.vue删除原来的路由展示。（注意，不要删除`<router-view />`！）

然后简单改造一下Main.vue：（注释部分为修改或添加内容）

```vue
<template>
  <!-- 修改高度100% -->
  <el-container style="height: 100%">
    <!-- 修改伸缩侧边栏 -->
    <el-aside width="auto">Aside</el-aside>
    <el-container>
      <el-header>Header</el-header>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>

export default {
  name: 'Main',
  components: {}
}
</script>

<!--新建如下的内容来添加样式-->
<style lang="scss" scoped>
.el-header {
  background: #333;
}
.el-main{
  padding-top: 0;
}
</style>
```





## 左侧菜单栏

### 引入

首先在element-ui官网搜索NavMenu导航菜单。

可以看到有纵向和横向两种方式。我们选择纵向的来作为侧边栏。

我们需要编写组件，所以我们在components下创建一个新文件命名为CommonAside.vue

CommonAside.vue
```vue
<template>
  <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
           :collapse="isCollapse">
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span slot="title">导航一</span>
      </template>
      <el-menu-item-group>
        <span slot="title">分组一</span>
        <el-menu-item index="1-1">选项1</el-menu-item>
        <el-menu-item index="1-2">选项2</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="分组2">
        <el-menu-item index="1-3">选项3</el-menu-item>
      </el-menu-item-group>
      <el-submenu index="1-4">
        <span slot="title">选项4</span>
        <el-menu-item index="1-4-1">选项1</el-menu-item>
      </el-submenu>
    </el-submenu>
    <el-menu-item index="2">
      <i class="el-icon-menu"></i>
      <span slot="title">导航二</span>
    </el-menu-item>
    <el-menu-item index="3" disabled>
      <i class="el-icon-document"></i>
      <span slot="title">导航三</span>
    </el-menu-item>
    <el-menu-item index="4">
      <i class="el-icon-setting"></i>
      <span slot="title">导航四</span>
    </el-menu-item>
  </el-menu>
</template>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>

<script>
export default {
  data () {
    return {
      isCollapse: true
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

```
然后回到views目录下的Main.vue中添加如下内容：
```vue
<template>
  <el-container style="height: 100%">
    <el-aside width="auto">
      <!--在这里添加common-aside-->
      <common-aside></common-aside>
    </el-aside>
    <el-container>
      <el-header>Header</el-header>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>

/*在这里引入CommonAside.vue*/
import CommonAside from '../components/CommonAside.vue';
export default {
  name: 'Main',
  /*在这里添加组件*/
  components: { CommonAside },
}
</script>
```
我们稍微修改一下侧边栏显示状态，回到CommonAside.vue
```vue
<!--删除这里的第一行1-4-1（默认不全部展开）-->
<el-menu class="el-menu-vertical-demo"
         @open="handleOpen"
         @close="handleClose"
         :collapse="isCollapse">

<!--修改这里的ture为false。isCollapse决定是否折叠展开左侧导航内容-->
<script>
  export default {
    data () {
      return {
        isCollapse: false
```





### 一级菜单实现

在CommonAside.vue中默认暴露数据添加一个menu数组：

```vue
    menu: [
      {
        path: '/',
        name: 'home',
        label: '首页',
        icon: 's-home',
        url: 'Home/home'
      },
      {
        path: '/mall',
        name: 'mall',
        label: '商品管理',
        icon: 'video-play',
        url: 'MallManage/MallManage'
      },
      {
        path: '/user',
        name: 'user',
        label: '用户管理',
        icon: 'user',
        url: 'UserManage/UserManage'
      },
      {
        label: '其他',
        icon: 'location',
        children: [
          {
            path: '/',
            name: '/page1',
            label: '页面1',
            icon: 'setting',
            url: 'Other/PageOne'
          },
          {
            path: '/',
            name: '/page2',
            label: '页面2',
            icon: 'setting',
            url: 'Other/PageTwo'
          }
        ]
      }
    ]
```
然后我们修改一下导航，使用遍历循环读取数组的内容：
```vue
<h3>通用后台管理系统</h3>
<el-menu-item :index="item.path"
              v-for="item in noChildren"
              :key="item.path">
  <i :class="'el-icon-'+item.icon"  ></i>
  <span slot="title">{{item.label}}</span>
</el-menu-item>
```





### 二级菜单实现

```vue
<!--  一级菜单  -->
<el-menu-item :index="item.path"
              v-for="item in noChildren"
              :key="item.path">
  <i :class="'el-icon-'+item.icon"></i>
  <span slot="title">{{ item.label }}</span>
</el-menu-item>
<!--  二级菜单  -->
<el-submenu
  :index="item.label"
  v-for="item in hasChildren"
  :key="item.path"
>
  <template slot="title">
    <i :class="'el-icon-'+item.icon"></i>
    <span slot="title">{{ item.label }}</span>
  </template>
  <el-menu-item-group>
    <el-menu-item
      :index="subItem.path"
      v-for="(subItem,subIndex) in item.children"
      :key="subIndex"
    >
      <i :class="'el-icon-'+subItem.icon"></i>
      <span slot="title">{{ subItem.label }}</span>
    </el-menu-item>
  </el-menu-item-group>
</el-submenu>
```



### 修改菜单样式
菜单背景颜色：在el-menu中添加

background-color="#545c64"

text-color="#fff"

active-text-color="ffd04b"

然后给el-menu-item添加一个@click达成跳转
```vue
@click="clickMenu(item)"

<!--然后在methods中添加下面方法-->
clickMenu (item) {
  this.$router.push({ name: item.name })
}
```



##顶部菜单
### 引入

首先在组件目录下创建一个CommonHeader.vue

在Main中引入Header组件：

```vue
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
```

编写CommonHeader

```vue
<template>
  <header>
    <div class="l-content">
      <el-button plain icon="el-icon-menu" size="mini"></el-button>
      <h3 style="color: #fff">首页</h3>
    </div>
    <div class="r-content">
      <el-dropdown trigger="click" size="mini">
        <span class="el-dropdown-link">
          <img :src="userImg"
               class="user"
               style="width: 40px;
                height: 40px;
                border-radius: 50%;"/>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item>退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
export default {
  data () {
    return {
      userImg: require('../assets/images/user.png'),
    }
  },
}
</script>
```



### 添加样式

```vue
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

.r-context {

}
</style>
```



### 折叠左侧功能实现

折叠功能取决于CommonAside.vue默认方法的isCollapse值来控制的。但是我们现在想要在Header组件来控制Aside的这个内容，涉及到了跨组件。我们在store目录下创建一个新文件tab.js：

```js
export default {
  state: {
    isCollapse: false
  },
  mutations: {
    collapseMenu (state) {
      state.isCollapse = !state.isCollapse
    }
  }
}
```

mutations作用是对当前是否折叠的状态取反，来达到控制的效果。然后我们在同目录下的index.js中引入：

```js
import Vue from 'vue'
import Vuex from 'vuex'
import tab from './tab'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    tab
  }
})
```

然后回到CommonAside.vue中，删除默认的isCollapse data，在computed中新建一个：

```vue
isCollapse () {
      return this.$store.state.tab.isCollapse
}
```

最后回到CommonHeader添加方法：

```vue
<!--控制左侧侧边栏展开-->
<el-button plain icon="el-icon-menu"
           size="mini"
           @click="handleMenu">
</el-button>

<!--下面是方法-->
<script>
export default {
  data () {
    return {
      userImg: require('../assets/images/user.png'),
    }
  },
  methods: {
    handleMenu () {
      this.$store.commit('collapseMenu')
    }
  }
}
</script>
```

我们发现，折叠起来的时候，通用后台管理系统也给折叠压缩了，但是我们想要折叠的时候精简显示这个标题，更加美观。我们使用v-show来实现这个功能：

```vue
<h3 v-show="!isCollapse">通用后台管理系统</h3>
<h3 v-show="isCollapse">后台</h3>
```



## Home(首页)展示

想要实现点击侧边栏跳转到对应的功能组件，需要涉及到路由模块。

这里如果展示出现问题，回到Main.vue查看el-main中是否有预留展示的空间`<router-view />`

###用户小卡片

首先准备好scss样式提供给Home.vue：

```scss
.home {
  .user {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;

    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-right: 40px;
    }

    &info {
      .name {
        font-size: 32px;
        margin-bottom: 10px;
      }

      .access {
        color: #999999;
      }
    }
  }

  .login-info {
    p {
      line-height: 28px;
      font-size: 14px;
      color: #999999;

      span {
        color: #666666;
        margin-left: 60px;
      }
    }
  }

  .num {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .el-card {
      width: 32%;
      margin-bottom: 20px;
    }

    .icon {
      font-size: 30px;
      width: 80px;
      height: 80px;
      text-align: center;
      line-height: 80px;
      color: #fff;
    }

    .detail {
      margin-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .num {
        font-size: 30px;
        margin-bottom: 10px;
      }

      .txt {
        font-size: 14px;
        text-align: center;
        color: #999999;
      }
    }
  }

  .graph {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;

    .el-card {
      width: 48%;
    }
  ;
  }
}


```

然后在views目录下创建Home目录，在Home目录下创建Home.vue：

```vue
<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px">
      <el-card shadow="hover">
        <div class="user">
          <img :src="userImg"/>
          <div class="userInfo">
            <p class="name">Admin</p>
            <p class="access">超级管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p>上次登陆时间：<span>2021-1-5</span></p>
          <p>上次登陆地点：<span>XXXX</span></p>
        </div>
      </el-card>
    </el-col>
    <el-col :span="16">

    </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      userImg: require('../../assets/images/user.png'),
    }
  },
}
</script>

<!--导入样式-->
<style lang="scss" scoped>
@import "~@/assets/scss/home";
</style>
```



### 表格小卡片

样式：

```vue
<!--表格-->
<el-card style="height: 470px;margin-top: 20px">
  <el-table :data="tableData">
    <el-table-column
      show-overflow-tooltip
      v-for="(val,key) in tableLabel"
      :key="key"
      :prop="key"
      :label="val"
    >
    </el-table-column>
  </el-table>
</el-card>
```

数据：

```vue
tableData: [
  {
    name: 'oppo',
    todayBuy: 100,
    monthBuy: 300,
    totalBuy: 800150000.1,
  },
  {
    name: 'xiaomi',
    todayBuy: 200,
    monthBuy: 300,
    totalBuy: 800,
  },
  {
    name: 'huawei',
    todayBuy: 300,
    monthBuy: 300,
    totalBuy: 800,
  },
  {
    name: 'vivo',
    todayBuy: 400,
    monthBuy: 300,
    totalBuy: 800,
  },
  {
    name: 'ZTE',
    todayBuy: 500,
    monthBuy: 300,
    totalBuy: 800,
  },
],
tableLabel: {
  name: '名称',
  todayBuy: '今日购买',
  momthBuy: '本月购买',
  totalBuy: '总购买',
}
```



### 订单卡片

先准备好数据：
```vue
countData: [
  {
    name: '今日支付',
    value: 1234,
    icon: 'success',
    color: '#2ec7c9',
  },
  {
    name: '今日收藏',
    value: 210,
    icon: 'start-on',
    color: '#ffb980',
  },
  {
    name: '今日未支付',
    value: 1234,
    icon: 's-goods',
    color: '#5ab1ef',
  },
  {
    name: '本月支付',
    value: 1234,
    icon: 'success',
    color: '#2ec7c9',
  },
  {
    name: '本月收藏',
    value: 210,
    icon: 'start-on',
    color: '#ffb980',
  },
  {
    name: '本月未支付',
    value: 1234,
    icon: 's-goods',
    color: '#5ab1ef',
  },
],
tableLabel: {
  name: '名称',
  todayBuy: '今日购买',
  momthBuy: '本月购买',
  totalBuy: '总购买',
}
```
样式：
```vue
<!--右侧16分区-->
<el-col :span="16">
  <div class="num">
    <el-card shadow="hover"
             v-for="item in countData"
             :key="item.name"
             :body-style="{display:'flex',padding:0}"
    >
      <i class="icon"
         :class="`el-icon-${item.icon}`"
         :style="{background:item.color}">
      </i>
      <div class="detail">
        <p class="num">￥{{ item.value }}</p>
        <p class="txt">￥{{ item.name }}</p>
      </div>
    </el-card>
  </div>
</el-col>
```



## Axios.js

###介绍安装

引用自[Axios文档](https://www.axios-http.cn/docs/intro), Axios 是一个基于 *[promise](https://javascript.info/promise-basics)* 网络请求HTTP库，作用于[`node.js`](https://nodejs.org/) 和浏览器中。

首先我们需要安装一下：

```shell
cnpm i axios -S
```

安装完成后回到main.js添加下面内容：

```js
import http from 'axios'

Vue.prototype.$http = http
```

回到Home.vue中，在data()同级下创建一个mounted()，这里直接粘贴官方文档案例：

```vue
mounted () {
  this.$http.get('/user', {
    params: {
      ID: 12345
    }
  })
    .then(function (response) {
      console.log(response)
    })
    .catch(function (error) {
      console.log(error)
    })
}
```

刷新项目，我们按F12审查元素中的Network发现多出了一个报红的请求：

```text
XHR user?ID=12345
Cannot GET /user
```

这就是一个基本的使用。



### 二次封装

创建一个api目录，在下面创建axios.js：

```js
// 二次封装axios拦截器
import axios from 'axios'
import config from '../config/index'
// 设置配置 根据开发和生产环境不一样来变化
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

class HttpRequest {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
  }

  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      header: {}
    }
    return config
  }

  interceptors (instance) {
    instance.interceptors.request.use(function (config) {
      // 在发送请求之前做些什么
      console.log('拦截处理请求')
      return config
    }, function (error) {
      // 对请求错误做些什么
      return Promise.reject(error)
    })
    // 添加响应拦截器
    instance.interceptors.response.use(function (response) {
      console.log('处理响应')
      // 2xx 范围内的状态码都会触发该函数。
      // 对响应数据做点什么
      return response
    }, function (error) {
      console.log(error)
      // 超出 2xx 范围的状态码都会触发该函数。
      // 对响应错误做点什么
      return Promise.reject(error)
    })
  }

  request (options) {
    // 请求 /api/getList /api/getHome
    const instance = axios.create()
    // ?
    options = { ...(this.getInsideConfig), ...options }
    this.interceptors(instance)
    return instance(options)
  }
}

export default new HttpRequest(baseUrl)

```

设置配置方便调试，创建一个config目录，并创建一个index.js：

```js
export default {
  title: 'admin',
  baseUrl: {
    // 开发环境
    dev: '/api/',
    // 生产环境
    pro: ''
  }
}
```

### 二次封装用法

在api目录下创建一个data.js：

```js
import axios from './axios'

export const getMenu = () => {
  return axios.request({
    url: 'menu',
    method: 'get'
  })
}
```

回到Home.vue，修改mounted：

```vue
// 在script下导入
import { getMenu } from '../../api/data'

mounted () {
  getMenu().then((res) => {
    console.log(res)
  })
},
```

这时候刷新项目，我们可以看到网页的控制台打印出了拦截处理请求：

```text
拦截处理请求
xhr.js?b9e2:210 
       GET http://localhost:8080/menu 404 (Not Found)
拦截处理请求
xhr.js?b9e2:210 
       GET http://localhost:8080/menu 404 (Not Found)
......
```

这个功能就可以让我们需要在请求之前做什么的时候，在interceptors方法的备注前添加，同理请求之后也是如此。



## Mock.js

###安装

文档参考：[mock.js](http://mockjs.com/)，官方介绍： 生成随机数据，拦截 Ajax 请求 。

```shell
# 安装
npm install mockjs

# 个人使用
cnpm i mockjs -S
```

###使用

安装好了以后在api下新建一个mock.js文件：

```js
import Mock from 'mockjs'

import homeApi from './mockServerData/home'

Mock.mock('/api/home/getData', homeApi.getStatisticalData)
```

在api下创建一个mockServerData文件夹，在下面创建一个home.js放入准备模拟的数据：

```js
import Mock from 'mockjs'

let List = []
export default {
  getStatisticalData: () => {
    for (let i = 0; i < 7; i++) {
      List.push(
        Mock.mock({
          oppo: Mock.Random.float(100, 8000, 0, 0),
          xiaomi: Mock.Random.float(100, 8000, 0, 0),
          huawei: Mock.Random.float(100, 8000, 0, 0),
          vivo: Mock.Random.float(100, 8000, 0, 0),
          ZTE: Mock.Random.float(100, 8000, 0, 0)
        })
      )
    }
    return {
      code: 20000,
      data{
        // 饼图
        videoData: [
          {
            name: 'oppo',
            value: 2999
          },
          {
            name: 'xiaomi',
            value: 5999
          },
          {
            name: 'huawei',
            value: 1500
          },
          {
            name: 'vivo',
            value: 2000
          },
          {
            name: 'ZTE',
            value: 4000
          }
        ],
        // 饼图
        userData: [
          {
            date: '周一',
            new: 5,
            active: 200
          },
          {
            date: '周二',
            new: 11,
            active: 400
          },
          {
            date: '周三',
            new: 22,
            active: 330
          },
          {
            date: '周四',
            new: 69,
            active: 550
          },
          {
            date: '周五',
            new: 53,
            active: 200
          },
          {
            date: '周六',
            new: 65,
            active: 770
          },
          {
            date: '周日',
            new: 33,
            active: 170
          }
        ],
        // 折线图
        orderData:{
          date:['20211001','20211002','20211003','20211004','20211005','20211006','20211007'],
          data: List
        },
        tableData: [
          {
            name: 'oppo',
            todayBuy: 100,
            monthBuy: 3500,
            totalBuy: 22000,
          },
          {
            name: 'xiaomi',
            todayBuy: 300,
            monthBuy: 2200,
            totalBuy: 24000,
          },
          {
            name: 'huawei',
            todayBuy: 800,
            monthBuy: 4500,
            totalBuy: 65000,
          },
          {
            name: 'vivo',
            todayBuy: 300,
            monthBuy: 2200,
            totalBuy: 65000,
          },
          {
            name: 'ZTE',
            todayBuy: 300,
            monthBuy: 1200,
            totalBuy: 15000,
          },
        ],
      }
    }
  }
}

```

然后回到Home.vue，删除掉下面内容并修改：

```vue
// 删除：
import { getMenu } from '../../api/data'
// 修改为：
import { getHome } from '../../api/data'

// 删除原来TableData中的数据，然后添加方法，修改mounted：
methods: {
  getTableData () {
    getHome().then((res) => {
      console.log(res)
      this.tableData = res.data.data.tableData
    })
  },
},
mounted () {
  this.getTableData()
},
```

打开api目录下的data.js，添加下面内容：

```js
export const getHome = () => {
  return axios.request({
    url: '/api/home/getData',
    method: 'get'
  })
}
```

### 二次封装改进

```js
interceptors (instance) {
  instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    console.log('拦截处理请求')
    return config
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  })
  // 添加响应拦截器
  instance.interceptors.response.use(function (response) {
    console.log('处理响应')
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
      
    // ☆☆☆ 改进这一行，这里直接返回.data，这样回到Home.vue的时候就可以少一层调用。  
    return response.data
      
      
  }, function (error) {
    console.log(error)
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error)
  })
}


// ☆☆☆ 如果报错404，this.getInsideConfig后面添加上()。我这里没有报错所以没有添加。
request (options) {
  // 请求 /api/getList /api/getHome
  const instance = axios.create()
  // ?
  options = { ...(this.getInsideConfig), ...options }
  this.interceptors(instance)
  return instance(options)
}
```



##Echarts表格

### html引入

```js
<script src="https://cdn.staticfile.org/echarts/4.3.0/echarts.min.js"></script>
```

我这里使用了本地引入，使用的是5.2.2版本。

### html实例

这里引用自[菜鸟教程Echarts](https://www.runoob.com/echarts/echarts-tutorial.html)，第一个例子开始，在一个新文件夹新建一个测试类echartsTest.html：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Echarts</title>
    <!--  引入js  -->
    <script src="./echarts.min.js"></script>
</head>
<body>
<!-- 为ECharts准备一个具备大小（宽高）的Dom -->
<div id="main" style="width: 600px;height:400px;"></div>
<script type="text/javascript">
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById('main'))

  // 指定图表的配置项和数据
  var option = {
    title: {
      text: '第一个 ECharts 实例'
    },
    tooltip: {},
    legend: {
      data: ['销量']
    },
    xAxis: {
      data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [{
      name: '销量',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20]
    }]
  }

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
</script>
</body>
</html>
```

直接打开html文件，就可以看到柱状图了。



### Vue安装与引入

首先安装echarts：

```shell
cnpm i echarts -S
```

回到Home.vue中，在script下：

```vue
import * as echarts from 'echarts'
```

###引入展示数据

在data中添加：

```vue
data () {
  return {
    userImg: require('../../assets/images/user.png'),
    tableData: [],
    countData: [
      {
        name: '今日支付',
        value: 1234,
        icon: 'success',
        color: '#2ec7c9',
      },
      {
        name: '今日收藏',
        value: 210,
        icon: 'start-on',
        color: '#ffb980',
      },
      {
        name: '今日未支付',
        value: 1234,
        icon: 's-goods',
        color: '#5ab1ef',
      },
      {
        name: '本月支付',
        value: 1234,
        icon: 'success',
        color: '#2ec7c9',
      },
      {
        name: '本月收藏',
        value: 210,
        icon: 'start-on',
        color: '#ffb980',
      },
      {
        name: '本月未支付',
        value: 1234,
        icon: 's-goods',
        color: '#5ab1ef',
      },
    ],
    tableLabel: {
      name: '名称',
      todayBuy: '今日购买',
      monthBuy: '本月购买',
      totalBuy: '总购买',
    },
    echartsData: {
      order: {
        legend: {
          // 图例文字颜色
          textStyle: {
            color: '#333',
          },
        },
        grid: {
          left: '20%',
        },
        // 提示框
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category', // 类目轴
          data: [],
          axisLine: {
            lineStyle: {
              color: '#17b3a3',
            },
          },
          axisLabel: {
            interval: 0,
            color: '#333',
          },
        },
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#17b3a3',
              },
            },
          },
        ],
        color: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3'],
        series: [],
      },
      user: {
        legend: {
          // 图例文字颜色
          textStyle: {
            color: '#333',
          },
        },
        grid: {
          left: '20%',
        },
        // 提示框
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category', // 类目轴
          data: [],
          axisLine: {
            lineStyle: {
              color: '#17b3a3',
            },
          },
          axisLabel: {
            interval: 0,
            color: '#333',
          },
        },
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#17b3a3',
              },
            },
          },
        ],
        color: ['#2ec7c9', '#b6a2de'],
        series: [],
      },
      video: {
        tooltip: {
          trigger: 'item',
        },
        color: [
          '#0f78f4',
          '#dd536b',
          '#9462e5',
          '#a6a6a6',
          '#e1bb22',
          '#39c362',
          '#3ed1cf',
        ],
        series: [],
      },
    },
  }
},
```

###line/bar/pie图

然后在methods中添加：

```vue
methods: {
  getTableData () {
    getHome().then((res) => {
      console.log(res)
      this.tableData = res.data.tableData
      // 折线图展示
      const order = res.data.orderData
      console.log(order)
      this.echartsData.order.xAxis.data = order.date
      let keyArray = Object.keys(order.data[0])
      keyArray.forEach((key) => {
        this.echartsData.order.series.push({
          name: key,
          data: order.data.map((item) => item[key]),
          type: 'line'
        })
      })
      const myEchartsOrder = echarts.init(this.$refs.echart)
      myEchartsOrder.setOption(this.echartsData.order)
      // 用户图-柱状图
      this.echartsData.user.xAxis.data = res.data.userData.map((item) => item.date)
      this.echartsData.user.series.push({
        name: '新增用户',
        data: res.data.userData.map((item) => item.new),
        type: 'bar',
      })
      this.echartsData.user.series.push({
        name: '活跃用户',
        data: res.data.userData.map((item) => item.active),
        type: 'bar',
      })
      const myEchartsUser = echarts.init(this.$refs.userEchart)
      myEchartsUser.setOption(this.echartsData.user)
      // 饼图
      this.echartsData.video.series.push({
        data: res.data.videoData,
        type: 'pie'
      })
      const myEchartsVideo = echarts.init(this.$refs.videoEchart)
      myEchartsVideo.setOption(this.echartsData.video)
    })
  },
},
```



###封装Echarts

从上面的例子我们可以看出来，我们会经常跟图标打交道，例如订单数量表，销量表，会员数量表...如果我们没有封装的思路的话，每次都要重复的来设置图表属性，非常的繁琐，我们需要封装的思路来解决这个问题。

首先我们在components下新建一个Echarts.vue（这里直接给完整代码）

```vue
<template>
  <div ref="echart"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  props: {
    chartData: {
      type: Object,
      default () {
        return {
          xData: [],
          series,
        }
      }
    },
    isAxisChart: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    chartData: {
      handler: function () {
        this.initChart()
      },
      deep: true,
    }
  },
  computed: {
    options () {
      return this.isAxisChart ? this.axisOption : this.normalOption
    }
  },
  methods: {
    initChart () {
      this.initChartData()
      // 设置echarts表格
      if (this.echart) {
        this.echart.setOption(this.options)
      } else {
        this.echart = echarts.init(this.$refs.echart)
        this.echart.setOption(this.options)
      }
    },
    initChartData () {
      if (this.isAxisChart) {
        this.axisOption.xAxis.data = this.chartData.xData
        this.axisOption.series = this.chartData.series
      } else {
        this.normalOption.series = this.chartData.series
      }
    }
  },
  data () {
    return {
      axisOption: {
        legend: {
          // 图例文字颜色
          textStyle: {
            color: '#333',
          },
        },
        grid: {
          left: '20%',
        },
        // 提示框
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category', // 类目轴
          data: [],
          axisLine: {
            lineStyle: {
              color: '#17b3a3',
            },
          },
          axisLabel: {
            interval: 0,
            color: '#333',
          },
        },
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#17b3a3',
              },
            },
          },
        ],
        color: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3'],
        series: [],
      },
      normalOption: {
        tooltip: {
          trigger: 'item',
        },
        color: [
          '#0f78f4',
          '#dd536b',
          '#9462e5',
          '#a6a6a6',
          '#e1bb22',
          '#39c362',
          '#3ed1cf',
        ],
        series: [],
      },
      echart: null,
    }
  }
}
</script>

```



### 封装line图

回到Home.vue，导入：

```vue
<!--折线图-->
<el-card shadow="hover" style="height: 280px">
  <!--这里注释掉<div style="height: 280px" ref="echart"></div>-->
  <echart :chartData="echartData.order"
          style="height: 280px"></echart>
</el-card>

... ...

import Echart from '@/components/Echarts.vue'
export default {
  components: {
    Echart
  },
```

methods：

```vue
// 折线图展示
const order = res.data.orderData
let keyArray = Object.keys(order.data[0])

this.echartData.order.xData = order.date
keyArray.forEach((key) => {
  this.echartData.order.series.push({
    name: key,
    data: order.data.map((item) => item[key]),
    type: 'line'
  })
})
```

删除掉echartsData中order的部分。保存刷新看到仍然能够显示折线图，成功封装了折线图。



 ### 封装pie和bar图

首先对template中原来的部分删除。替换为封装的echart图，注意video需要加上`:isAxisChart="false"`属性，因为是一个饼图没有线性数据。

```vue
<div class="graph">
  <!--柱状图-->
  <el-card shadow="hover" style="height: 260px">
    <!--<div style="height: 240px" ref="userEchart"></div>-->
    <echart :chartData="echartData.user"
            style="height: 240px"></echart>
  </el-card>
  <!--饼图-->
  <el-card shadow="hover" style="height: 260px">
    <!--<div style="height: 240px" ref="videoEchart"></div>-->
    <echart :chartData="echartData.video"
            style="height: 240px"
            :isAxisChart="false"></echart>
  </el-card>
</div>
```

然后直接删除掉原来的echartsData。

最后去修改方法：

```vue
// 用户图封装-柱状图
this.echartData.user.xData = res.data.userData.map((item) => item.date)
this.echartData.user.series.push({
  name: '新增用户',
  data: res.data.userData.map((item) => item.new),
  type: 'bar',
})
this.echartData.user.series.push({
  name: '活跃用户',
  data: res.data.userData.map((item) => item.active),
  type: 'bar',
})
// 封装-pie图
this.echartData.video.series.push({
  data: res.data.videoData,
  type: 'pie'
})
```



## 面包屑导航

###路由跳转遗留问题

我们点击其他页面的时候，在header内会显示我们点进去的模块名，例如`首页 / 商品管理`这样的展示形式。我们现在点击除了首页以外的组件会发现没有内容，我们需要先给其他模块实现一个路由跳转。

首先打开router下的index.js，我们删除原来的about内容，在children下新建下面内容：

```js
children: [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home/Home')
  },
  {
    path: '/mall',
    name: 'mall',
    component: () => import('@/views/Mall/Mall')
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/User/User')
  }
]
```

然后在views下新建`Mall/Mall.vue`和`User/User.vue`即可完成路由跳转的配置。



### 面包屑的实现

逻辑：首先是面包屑`首页`一定要存在的,接下来 `Aside` 中点击某菜单,把这个数据存到`vuex`中，然后`Header`来获取`vuex`中这个数据并展示。我们打开store目录下的tab.js添加内容，用于判断和获取侧边栏名称：

```js
export default {
  state: {
    isCollapse: false,
    currentMenu: null
  },
  mutations: {
    collapseMenu (state) {
      state.isCollapse = !state.isCollapse
    },
    selectMenu (state, val) {
      val.name === 'home' ? (state.currentMenu = null) : state.currentMenu = val
    }
  }
}
```

回到CommonAside.vue中添加：

```vue
methods: {
  clickMenu (item) {
    this.$router.push({ name: item.name })
    this.$store.commit('selectMenu', item)
  }
},
```

回到CommonHeader.vue中，删除掉原来的h3标题，我们更换为面包屑导航：

```vue
<el-breadcrumb>
  <el-breadcrumb-item :to="{path:'/'}">首页</el-breadcrumb-item>
  <el-breadcrumb-item :to="current.path"
                      v-if="current">
    {{ current.label }}
  </el-breadcrumb-item>
</el-breadcrumb>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      userImg: require('../assets/images/user.png'),
    }
  },
  methods: {
    handleMenu () {
      this.$store.commit('collapseMenu')
    }
  },
  computed: {
    ...mapState({
      current: state => state.tab.currentMenu,
    }),
  }
}
</script>
```

我们发现面包屑默认是灰色和黑色，跟我们设置的背景颜色不搭配。我们修改一下样式：

```html
<style lang="scss">
  .el-breadcrumb__item{
    .el-breadcrumb__inner{
      color: #666;
      font-weight: normal;
    }
    &:last-child{
      .el-breadcrumb__inner{
        color: white;
      }
    }
  }
</style>
```



### 路由重复导航解决

我们在网页审查元素，打开控制台，点击首页的时候会发现报红，这是因为我们重复点击首页导致的。我们需要改进一下路由的配置。打开router下index.js，在import下添加下面代码：

```js
// 解决重复导航错误
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
```



## Tag标签

### 新增与跳转

在components下创建CommonTag.vue：

```vue
<template>
  <div class="tabs">
    <el-tag
      v-for="tag in tags"
      :key="tag.name"
      size="small"
      :closable="tag.name !== 'home'"
      :effect="$route.name === tag.name ? 'dark' : 'plain'"
      @click="changeMenu(tag)"
    >
      {{ tag.label }}
    </el-tag>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      tags: (state) => state.tab.tabsList,
    })
  },
  methods: {
    changeMenu (item) {
      this.$router.push({ name: item.name })
      this.$store.commit('selectMenu', item)
    }
  }
}
</script>

<style lang="scss">
.tabs {
  padding: 20px 10px 0 10px;

  .el-tag {
    margin-right: 15px;
    cursor: pointer;
  }
}
</style>

```

在Main.vue下面添加：

```vue
 </el-header>
 <!--添加到这里-->
 <common-tag></common-tag>
 <el-main>
```

在store目录下tab.js修改：

```js
export default {
  state: {
    isCollapse: false,
    currentMenu: null,
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
      state.isCollapse = !state.isCollapse
    },
    selectMenu (state, val) {
      val.name === 'home' ? (state.currentMenu = null) : state.currentMenu = val
      if (val.name === 'home') {
        state.currentMenu = null
      } else {
        state.currentMenu = val
        // 新增
        let result = state.tabsList.findIndex(item => item.name === val.name)
        result === -1 ? state.tabsList.push(val) : ''
      }
    }
  }
}

```

### 删除

点击标签删除导航条，回到CommonTag.vue在methods下添加：

```vue
因为解决了一些错误，见下面完整代码。
```

在store目录下的tab.js中的mutations添加下面方法：

```js
closeTag (state, val) {
  let result = state.tabsList.findIndex(item => item.name === val.name)
  state.tabsList.splice(result, 1)
}
```

CommonTag.vue：

```vue
<template>
  <div class="tabs">
    <!--要实现删除后的跳转需要在v-for中加上index参数-->
    <el-tag
      v-for="(tag,index) in tags"
      :key="tag.name"
      size="small"
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
```



















































