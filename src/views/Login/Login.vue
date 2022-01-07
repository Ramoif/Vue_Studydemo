<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像-->
      <div class="avatar_box">
        <img src="../../assets/images/user.png">
      </div>
      <!--表单验证区域-->
      <el-form class="login_form">
        <el-form-item prop="username">
<!--          <el-input v-model="loginForm.username"-->
<!--                    prefix-icon="el-icon-user-solid">-->
<!--          </el-input>-->
        </el-form-item>
        <el-form-item prop="password">
<!--          <el-input v-model="loginForm.password"-->
<!--                    prefix-icon="el-icon-user-lock"-->
<!--                    type="password">-->
<!--          </el-input>-->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login'
}
</script>

<style lang="scss" scoped>
.login_container {
  height: 100%;
  background-color: #999;
}

.login_box {
  width: 450px;
  height: 380px;
  background-color: #fff;
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
    margin:-65px auto;
    background-color: #FFF;

    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}

</style>
