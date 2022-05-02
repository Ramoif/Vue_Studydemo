<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../../assets/images/user.png">
      </div>
      <div style="color: #7598fc;font-size: 30px;text-align: center;padding: 100px 0 30px 0;">
        自主实习平台系统
      </div>
      <!-- 表单 -->
      <el-form class="login_form" ref="userForm" :model="user" size="normal" :rules="rules">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="user.username" placeholder="用户名"/>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="user.password" placeholder="密码" show-password/>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 30%; text-align: center;" type="success" @click="toRegister">前往注册</el-button>
          <el-button style="width: 66%; text-align: center;" type="primary" @click="login">登 录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { router, setRoutes } from '@/router'

import ValidCode from '@/components/ValidCode'

export default {
  name: 'Login',
  components: {
    ValidCode,
  },
  data () {
    return {
      user: {},
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
      }
    }
  },
  created () {
    document.onkeydown = (e) => {
      const _key = window.event.keyCode
      if (_key === 13) {
        this.login()
      }
    }
  },
  methods: {
    createValidCode (data) {
      this.validCode = data
    },
    login () {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.request.post('/user/login', this.user).then(res => {
            if (res.code === '600' || !res) {
              this.$message.error('用户名或密码错误')
            } else {
              console.log(res)
              this.$message.success('登录成功')
              sessionStorage.setItem('user', JSON.stringify(res.data)) // 会话存储
              localStorage.setItem('permissions', JSON.stringify(res.data.permissions)) // 本地存储
              setRoutes()
              this.$router.push('/home')
            }
          })
        } else {
          return false
        }
      })
    },
    toRegister () {
      this.$router.push('/register')
    },
  }
}
</script>

<style lang="scss" scoped>
.login_container {
  height: 100%;
  width: 100%;
  background: url("../../assets/images/bkg.jpg");
  background-size: 100% 100%;
  position: fixed;
}

.login_box {
  width: 450px;
  height: 400px;
  background-color: #f8fcff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin: -65px auto;
    background-color: #FFF;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}

.login_form {
  margin: 0 50px;
}

</style>
