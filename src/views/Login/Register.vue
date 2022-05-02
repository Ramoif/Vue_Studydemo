<template>
  <div id="bkground" style="width: 100%; height: 100vh; overflow: hidden">
    <div class="reg_box">
      <div style="color: #5caed5; font-size: 30px; text-align: center; padding: 30px 0;">
        注册账号
      </div>
      <!-- 设置对齐需要label-position="right" label-width="80px"这两个属性！ -->
      <el-form label-position="right" label-width="80px" ref="form" :model="form" size="normal" :rules="rules"
               style="margin: 0 50px;">
        <el-form-item label="用户名" prop="username">
          <el-input prefix-icon="el-icon-user" v-model="form.username" placeholder="4-16个字符"/>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input prefix-icon="el-icon-chat-dot-square" v-model="form.nickName" placeholder="至少4个字符"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="form.password" placeholder="4-16位" show-password/>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm">
          <el-input prefix-icon="el-icon-lock" v-model="form.confirm" placeholder="和密码一致" show-password/>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input prefix-icon="el-icon-time" v-model="form.age" placeholder="请输入符合要求的年龄"/>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio v-model="form.sex" label="男">男</el-radio>
          <el-radio v-model="form.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input prefix-icon="el-icon-message" v-model="form.email" placeholder="请输入电子邮箱"/>
        </el-form-item>
        <el-form-item label="联系电话" prop="cellphone">
          <el-input prefix-icon="el-icon-phone" v-model="form.cellphone" placeholder="请输入联系电话"/>
        </el-form-item>
      </el-form>
      <div style="margin: 30px 50px 50px 50px;">
        <el-button style="width: 30%; text-align: center;" type="info" @click="toLogin">返回登录</el-button>
        <el-button style="width: 66%; text-align: center;" type="success" @click="register">注册</el-button>
      </div>

    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import router from '@/router'

export default {
  name: 'Register',
  data () {
    // 验证邮箱的规则
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('输入合法的邮箱!'))
    }

    // 验证手机号的规则
    const checkCellphone = (rule, value, callback) => {
      const regMobile = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('输入合法的手机号!'))
    }

    return {
      form: {},
      rules: {
        username: [
          // 校验规则 可以有多个不同规则-提示不同信息
          // required - 非空
          // min - max 最小 - 最大长度
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 4,
            max: 16,
            message: '请输入符合长度的用户名（4-16位）',
            trigger: 'blur'
          }
        ],
        nickName: [
          {
            min: 4,
            max: 16,
            message: '请输入符合长度的昵称（4-16位）',
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
            min: 4,
            max: 16,
            message: '请输入符合长度的密码（4-16位）',
            trigger: 'blur'
          }
        ],
        confirm: [
          {
            required: true,
            message: '请确认密码',
            trigger: 'blur'
          },
          {
            min: 4,
            max: 16,
            message: '请输入符合长度的密码（4-16位）',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        cellphone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: checkCellphone,
            trigger: 'blur'
          }
        ]
      },
    }
  },
  methods: {
    register () {
      // 注册前校验密码是否一致
      if (this.form.password !== this.form.confirm) {
        this.$message({
          type: 'error',
          message: '密码不一致，请重试！'
        })
      } else {
        this.$refs.form.validate((valid) => {
          if (valid) {
            request.post('/user/register', this.form).then(res => {
              if (res.code === '0') {
                this.$message({
                  type: 'success',
                  message: '注册成功'
                })
                // 注册完成后页面跳转到登录页面
                this.$router.push('/login')
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                })
              }
            })
          }
        })
      }
    },
    toLogin () {
      router.push('/login')
    },
  }
}
</script>

<style lang="scss" scoped>
#bkground {
  background: url("../../assets/images/bkg.jpg");
  background-size: 100% 100%;
  height: 100%;
  position: fixed;
  width: 100%;
}

.reg_box {
  width: 600px;
  background-color: #f8fcff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);


}
</style>
