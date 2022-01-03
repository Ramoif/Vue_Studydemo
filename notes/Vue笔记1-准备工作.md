# VUE笔记1-准备工作

本文参考[尚硅谷Vue2.0~3.0 2021教程]( [尚硅谷Vue2.0+Vue3.0全套教程丨vuejs从入门到精通_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1Zy4y1K7SH?p=2) )结合而来。

power by ramoif



## 写在前面

留白



## 准备工作

### Yarn

解决npm的一些问题。

```shell
npm install -g yarn
```







## Vue-cli4安装与搭建

### 需要知识

HTML

CSS

JavaScript

Node.js (npm包管理工具)

Webpack 自动化构建工具



### 安装脚手架

```shell
cnpm install -g @vue/cli
```

安装完后用下面命令查看是否安装好，注意是大写。

```shell
vue -V
```

显示如下信息，安装完成。

```text
@vue/cli 4.5.15
```



### 创建脚手架

```shell
vue create vue_cli  #此处vue_cli为自定义的名字

#可能会出现问你是否更换npm的源地址，自行选择。

#第一步：执行后弹出下面信息，这里选择最后一项Manually select features手动选择
Vue CLI v4.5.15
? Please pick a preset: (Use arrow keys)
> Default ([Vue 2] babel, eslint)
  Default (Vue 3) ([Vue 3] babel, eslint)
  Manually select features 
  
#第二步：勾选图中所需内容，空格勾选
Vue CLI v4.5.15
? Please pick a preset: Manually select features
? Check the features needed for your project:
 ( ) Choose Vue version
 (*) Babel
 ( ) TypeScript
 (*) Progressive Web App (PWA) Support
 (*) Router
 (*) Vuex
 (*) CSS Pre-processors
>(*) Linter / Formatter
 ( ) Unit Testing
 ( ) E2E Testing 
 
#第三步：直接回车
? Use history mode for router? (Requires proper server setup for index fallback in production) (Y/n)   

#第四步：选node-sass
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default):
  Sass/SCSS (with dart-sass)
> Sass/SCSS (with node-sass)
  Less
  Stylus      
  
#第五步：选standard config
? Pick a linter / formatter config: (Use arrow keys)
> ESLint with error prevention only
  ESLint + Airbnb config
  ESLint + Standard config
  ESLint + Prettier 
  
#第六步：直接回车
? Pick additional lint features: (Press <space> to select, <a> to toggle all, <i> to invert selection)
>(*) Lint on save
 ( ) Lint and fix on commit  
 
#第七步：直接回车
? Where do you prefer placing config for Babel, ESLint, etc.? (Use arrow keys)
> In dedicated config files
  In package.json                                                                         

#第八步：保存配置项吗？按需选择。y以后输入名字。
? Save this as a preset for future projects? (y/N)   

#等待安装......出现下面提示，执行就可以测试！
 $ cd vue_cli
 $ npm run serve


```

打开localhost:8080，看到Welcome vue，脚手架搭建成功。



## Element-UI

引入Element-UI，CDN的引入css和js方式如下：

> ### CDN
>
> 目前可以通过 [unpkg.com/element-ui](https://unpkg.com/element-ui/) 获取到最新版本的资源，在页面上引入 js 和 css 文件即可开始使用。
>
> ```html
> <!-- 引入样式 -->
> <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
> <!-- 引入组件库 -->
> <script src="https://unpkg.com/element-ui/lib/index.js"></script>
> ```

这里我们将Hello world官方演示粘贴如下：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <!-- import CSS -->
  <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
</head>
<body>
  <div id="app">
    <el-button @click="visible = true">Button</el-button>
    <el-dialog :visible.sync="visible" title="Hello world">
      <p>Try Element</p>
    </el-dialog>
  </div>
</body>
  <!-- import Vue before Element -->
  <script src="https://unpkg.com/vue/dist/vue.js"></script>
  <!-- import JavaScript -->
  <script src="https://unpkg.com/element-ui/lib/index.js"></script>
  <script>
    new Vue({
      el: '#app',
      data: function() {
        return { visible: false }
      }
    })
  </script>
</html>
```

### 安装

右键vue-cli脚手架目录，在终端中打开，输入下面信息导入：

```shell
cnpm install element-ui --save-dev
```

如果此处出现报错，系统上禁止运行...请按照下面步骤操作：

> 必须以管理员身份运行
>
> 在powershell中执行Start-Process powershell -Verb runAs
>
> 会提示授权，并以管理员身份运行powershell
>
> 继续重新执行set-ExecutionPolicy RemoteSigned 选择 Y

当在package.json中可以看到“element-ui”的版本号时，说明安装完成了。



### 引入 - 完全引入

分为完全引入和按需引入两种。

完整引入，在src目录下的main.js中引入：

```js
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

/** 在new Vue前面添加 */
Vue.use(ElementUI);
```

然后输入`npm run serve`启动，发现报错：

```text
D:\idea-2019.3.3\Projects\vue_cli\src\main.js
   6:35  error  Extra semicolon  semi
   7:46  error  Extra semicolon  semi
  11:19  error  Extra semicolon  semi

✖ 3 problems (3 errors, 0 warnings)
  3 errors and 0 warnings potentially fixable with the `--fix` option.
```

这时候我们在vue_cli目录下创建一个vue.config.js文件，写入下面内容：

```js
module.exports = {
  lintOnSave: false
}
```

再次启动，http://localhost:8080/能够显示内容。

我们如何使用element-ui组件呢？这时候我们打开Vue.app修改一下内容：

```vue
<template>
  <div id="app">
    <p>这是一个P段落</p>
    <el-button>按钮</el-button>
    <el-button type="info">信息</el-button>
  </div>
</template>
```

保存，然后看到8080显示内容变化了。这个有一个弊端，引入了所有样式，这样对性能不太友好。



### 引入 - 按需引入

按照官网要求，我们需要先安装babel-plugin-component

> 借助 [babel-plugin-component](https://github.com/QingWei-Li/babel-plugin-component)，我们可以只引入需要的组件，以达到减小项目体积的目的。
>
> 首先，安装 babel-plugin-component：
>
> ```bash
> npm install babel-plugin-component -D
> ```
>
> 然后，将（本项目中为babel.config.js） .babelrc 修改为：
>
> ```json
> {
>   "presets": [["es2015", { "modules": false }]],
>   "plugins": [
>     [
>       "component",
>       {
>         "libraryName": "element-ui",
>         "styleLibraryName": "theme-chalk"
>       }
>     ]
>   ]
> }
> ```

然后回到main.js，修改内容：

```js
import { Button, Select } from 'element-ui';

Vue.component(Button.name, Button);
Vue.component(Select.name, Select);
```

一般开发选择后者。



## Vue路由

打开App.vue修改template中的下面内容：

```vue
<template>
  <div id="app">
    <router-link to="/"> 去home组件 </router-link>
    <router-link to="/about"> 去about组件 </router-link>
    <!--  给router-link展示的区域↓  -->
    <router-view />
  </div>
</template>
```

这时候保存，可以看到页面出现两个按钮，可以分别跳转到两个不同的展示页面。



## 报错解决

### 依赖丢失

```text
These dependencies were not found:
* element-ui in ./src/main.js

* element-ui/lib/theme-chalk/index.css in ./src/main.js

使用下面命令：
cnpm i element-ui -S
```























