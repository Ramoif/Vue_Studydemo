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

