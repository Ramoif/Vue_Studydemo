<template>
  <el-row :gutter="20">
    <el-col :span="16" :offset="4">
      <div class="person_container">
        <div class="person_box">
          <!-- 修改个人信息 -->
          <el-card style="width: 100%; margin-top: 30px;">
            <h3 class="infoTitle">账户基本信息</h3>

            <p class="dividedLine"/>
            <!-- 头像 -->
            <div class="avatar_box">
              <el-avatar :src="form.avatarUrl" fit="fill" :size="130"/>

            </div>
            <el-form style="margin-top: 50px" ref="form" :model="form" label-width="80px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="用户名">
                    <el-input v-model="form.username" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="密码">
                    <el-input v-model="form.password" show-password></el-input>
                  </el-form-item>
                  <el-form-item label="性别">
                    <el-input v-model="form.sex"></el-input>
                  </el-form-item>
                  <el-form-item label="电子邮箱">
                    <el-input v-model="form.email"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="昵称">
                    <el-input v-model="form.nickName"></el-input>
                  </el-form-item>
                  <el-form-item label="年龄">
                    <el-input v-model="form.age"></el-input>
                  </el-form-item>
                  <el-form-item label="联系电话">
                    <el-input v-model="form.cellphone"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <!-- 详细个人信息展示 -->
            <!--
            <div class="detailBox">
              <h3 class="infoTitle">详细个人信息</h3>
              <p class="dividedLine"/>
              <el-row style="margin-left: 20px;">
                <el-col :span="8">
                  <p>真实姓名 : <span>{{ detailedForm.trueName }}</span></p>
                  <p>联系电话 : <span>{{ detailedForm.telephone }}</span></p>
                  <p>所学专业 : <span>{{ detailedForm.subject }}</span></p>
                  <p>目前年级 : <span>{{ detailedForm.grade }}</span></p>
                </el-col>
                <el-col :span="8">
                  <p>籍贯 : <span>{{ detailedForm.nativePlace }}</span></p>
                  <p>生日 : <span>{{ detailedForm.birthday }}</span></p>
                  <p>学历 : <span>{{ detailedForm.degree }}</span></p>
                </el-col>
                <el-col :span="8">
                  <p>身份证号 : <span>{{ detailedForm.civilCard }}</span></p>
                  <p>就读学校 : <span>{{ detailedForm.school }}</span></p>
                  <p>入学时间 : <span>{{ detailedForm.graduateDay }}</span></p>
                </el-col>
              </el-row>
            </div>
            -->
            <div style="text-align: center">
              <el-button type="success" @click="handleEdit">编辑头像</el-button>
              <!--<el-button type="success" @click="">编辑详细信息</el-button>-->
              <el-button type="primary" @click="update">保存基本信息</el-button>
            </div>
          </el-card>
        </div>
      </div>

      <div class="infoDialog">
        <!-- 基本信息弹窗，dialogVisible需要在data中定义默认false关闭。 -->
        <el-dialog :visible.sync="dialogVisible" title="上传头像" width="30%">
          <!-- form也需要在下方定义，定义为一个对象form:{} -->
          <el-form :model="form" label-width="120px">
            <el-form-item label="预览头像">
              <el-upload ref="upload"
                         class="avatar-uploader"
                         :action="avatarUploadUrl"
                         :on-success="fileUploadSuccess">
                <img v-if="form.avatarUrl" :src="form.avatarUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <el-button type="primary" plain style="margin-top: 20px">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
          <div><p style="margin: 0 20px; color: #999;">上传完成后您可能需要刷新页面获取到更新的头像。</p></div>
          <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false" plain>取消</el-button>
            <el-button type="primary" @click="update" plain>保存头像</el-button>
          </span>
          </template>
        </el-dialog>
      </div>
    </el-col>
  </el-row>

</template>

<script>
import request from '@/utils/request'
import _global from '@/config'

export default {
  name: 'Personal',
  data () {
    return {
      form: {},
      commentVis: false,
      commentList: [],
      dialogVisible: false,
      avatarUploadUrl: 'http://' + _global._filesUrl + '/files/upload',
      detailedForm: {
        trueName: '张三',
        nativePlace: '武汉',
        birthday: '2000-01-01',
        telephone: '12345678910',
        civilCard: '100100100010101000',
        school: '三峡大学',
        subject: '临床医学',
        degree: '本科',
        graduateDay: '2018-09-01',
        grade: '大四',
      },
    }
  },
  created () {
    const str = sessionStorage.getItem('user') || '{}'
    this.form = JSON.parse(str)
  },
  methods: {
    update () {
      request.put('/user', this.form).then(res => {
        console.log(res)
        if (res.code === '0') {
          this.$message({
            type: 'success',
            message: '更新个人信息成功'
          })
          sessionStorage.setItem('user', JSON.stringify(this.form))
          // 触发Layout更新用户信息
          this.$emit('userInfo')
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
        if (this.dialogVisible === true) {
          this.dialogVisible = false
        }
      })
    },
    showComments (comments) {
      this.commentList = comments
      this.commentVis = true
    },
    handleEdit () {
      this.dialogVisible = true
    },
    fileUploadSuccess (res) {
      this.form.avatarUrl = res.data
    },
  }
}
</script>

<style lang="scss" scoped>
.infoDialog {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}

.detailBox {
  font-size: 14px;
}

.detailBox p {
  font-weight: bold;
  margin-bottom: 20px;
}

.detailBox span {
  font-weight: normal;
  color: #666;
}

.infoTitle {
  text-align: left;
  margin: 30px 20px;
  font-size: 20px;
  font-weight: bold;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.person_container {

}

.person_box {
  .el-input {
    width: 75%;
  }

  .avatar_box {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
    margin: auto auto 20px auto;
    background-color: #FFF;

    el-avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}

</style>
