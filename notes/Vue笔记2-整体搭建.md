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
