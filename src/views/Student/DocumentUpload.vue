<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-card>
        <div class="fontH24">附件上传</div>
        <p style="margin-top: 20px; font-size: 14px; color: #898d83;line-height: 20px;">
          仅<span class="redSpan">申请书通过</span>才可以进行附件资料上传。
          你需要仔细确认文件是否符合要求， 尽量上传符合要求的文件来通过审核。
          你可以在这个页面点击图片查看自己上传的照片是否清晰可见，以便快速审核避免二次编辑。
        </p>
        <p class="dividedLine"/>
        <!-- 图片区域 -->
        <el-row :gutter="10">
          <div class="fontH18" style="color: #666; margin-bottom: 20px; display: flex; ">
            请上传下面包含的所有附件，当前状态：
            <div style="color: black">
              <span v-if="docTable.currentState === 0">未提交附件</span>
              <span v-if="docTable.currentState === 1">已提交，待审核</span>
              <span v-if="docTable.currentState === 2">附件资料不通过，重新上传</span>
              <span v-if="docTable.currentState === 3">已审核附件资料</span>
              <span v-if="docTable.currentState === 4"></span>
              <span v-if="docTable.currentState === 5"></span>
              <span v-if="docTable.currentState === 6">实习鉴定中</span>
              <span v-if="docTable.currentState === 7">结束鉴定</span>
            </div>
          </div>
          <!-- 1区间 -->
          <el-col :span="4">
            <div class="docImgBox">
              <div class="docHeader">附件一：</div>
              <div class="docBody">
                <el-image style="width: 100px; height: 150px"
                          :src="docTable.annexA"
                          :preview-src-list="[docTable.annexA]">
                </el-image>
              </div>
              <div class="docFooter">
                <el-upload ref="upload" :action="UploadUrl" :on-success="annexASuccess">
                  <el-button plain type="primary">点击上传</el-button>
                </el-upload>
              </div>
            </div>
          </el-col>
          <!-- 2区间 -->
          <el-col :span="4">
            <div class="docImgBox">
              <div class="docHeader">附件二：</div>
              <div class="docBody">
                <el-image style="width: 100px; height: 150px"
                          :src="docTable.annexB"
                          :preview-src-list="[docTable.annexB]">
                </el-image>
              </div>
              <div class="docFooter">
                <el-upload ref="upload" :action="UploadUrl" :on-success="annexBSuccess">
                  <el-button plain type="primary">点击上传</el-button>
                </el-upload>
              </div>
            </div>

          </el-col>
          <!-- 3区间 -->
          <el-col :span="4">
            <div class="docImgBox">
              <div class="docHeader">附件三：</div>
              <div class="docBody">
                <el-image style="width: 100px; height: 150px"
                          :src="docTable.annexC"
                          :preview-src-list="[docTable.annexC]">
                </el-image>
              </div>
              <div class="docFooter">
                <el-upload ref="upload" :action="UploadUrl" :on-success="annexCSuccess">
                  <el-button plain type="primary">点击上传</el-button>
                </el-upload>
              </div>
            </div>

          </el-col>
          <!-- 4区间 -->
          <el-col :span="4">
            <div class="docImgBox">
              <div class="docHeader">附件四：</div>
              <div class="docBody">
                <el-image style="width: 100px; height: 150px"
                          :src="docTable.annexD"
                          :preview-src-list="[docTable.annexD]">
                </el-image>
              </div>
              <div class="docFooter">
                <el-upload ref="upload" :action="UploadUrl" :on-success="annexDSuccess">
                  <el-button plain type="primary">点击上传</el-button>
                </el-upload>
              </div>
            </div>
          </el-col>
          <!-- 5区间 -->
          <el-col :span="4">
            <div class="docImgBox">
              <div class="docHeader">附件五：</div>
              <div class="docBody">
                <el-image style="width: 100px; height: 150px"
                          :src="docTable.annexE"
                          :preview-src-list="[docTable.annexE]">
                </el-image>
              </div>
              <div class="docFooter">
                <el-upload ref="upload" :action="UploadUrl" :on-success="annexESuccess">
                  <el-button plain type="primary">点击上传</el-button>
                </el-upload>
              </div>
            </div>
          </el-col>
          <!-- 6区间 -->
          <el-col :span="4">
            <div class="docImgBox">
              <div class="docHeader">附件六：</div>
              <div class="docBody">
                <el-image style="width: 100px; height: 150px"
                          :src="docTable.annexF"
                          :preview-src-list="[docTable.annexF]">
                </el-image>
              </div>
              <div class="docFooter">
                <el-upload ref="upload" :action="UploadUrl" :on-success="annexFSuccess">
                  <el-button plain type="primary">点击上传</el-button>
                </el-upload>
              </div>
            </div>
          </el-col>
        </el-row>
        <!-- 操作区域 -->
        <el-row :gutter="20">
          <div class="infoBox">
            <el-col :span="20" :offset="2">
              <!--  预留的反馈意见区域，仅为  -->
              <div class="messageBox" v-if="docTable.currentState === 2">
                <p class="redSpan fontH18">审核意见:</p>
                <p style="font-size: 16px; margin-top: 5px; text-decoration:underline;">{{ docTable.comments }}</p>
              </div>
              <div class="allCenter" style="height: 20px;">
                <el-button type="info" style="width: 10%" @click="backToDocument">返回</el-button>
                <el-button type="success" style="width: 10%" @click="submitDetails">提交审核</el-button>
              </div>
            </el-col>
          </div>
        </el-row>
      </el-card>
    </el-col>
  </el-row>

</template>

<script>

import testImg1 from '@/assets/images/maomao.png'
import _global from '@/config/index'
import request from '@/utils/request'

export default {
  name: 'DocumentUpload',
  data () {
    return {
      testImgUrl: testImg1,
      testId: '1',
      UploadUrl: 'http://' + _global._filesUrl + '/files/upload',
      cid: '',
      docTable: {},
    }
  },
  created () {
    this.cid = this.$route.params.cid
    this.load()
  },
  methods: {
    load () {
      request.get('/contract-detail/' + this.cid).then(res => {
        console.log(res)
        // 放入表单数据
        this.docTable = res
      })
    },
    save (table) {
      if (table.id) {
        // 仅当前 未提交-0 和 被拒绝-2 两种状态可以更新
        if (table.currentState === 0 || table.currentState === 2) {
          request.post('/contract-detail', table).then(res => {
            console.log(res)
            if (res === true) {
              this.$message({
                type: 'success',
                message: '附件上传成功'
              })
            } else {
              this.$message({
                type: '附件上传失败',
                message: res.msg
              })
            }
            this.load()
          })
        }
      } else {
        this.$message('不存在此协议附件详情！')
        this.$router.push('/document')
      }
    },
    annexASuccess (res) {
      // 点击上传后图片直接上传到了后台，这里选择直接用更新方法存路径
      this.docTable.annexA = res.data
      // id存在执行更新方法
      if (this.docTable.id) {
        // 仅当前 未提交-0 和 被拒绝-2 两种状态可以更新
        if (this.docTable.currentState === 0 || this.docTable.currentState === 2) {
          request.post('/contract-detail', this.docTable).then(res => {
            console.log(res)
            if (res === true) {
              this.$message({
                type: 'success',
                message: '附件上传成功'
              })
            } else {
              this.$message({
                type: '附件上传失败',
                message: res.msg
              })
            }
            this.load()
          })
        }
      } else {
        this.$message('不存在此协议详情！')
        this.$router.push('/document')
      }
    },
    annexBSuccess (res) {
      this.docTable.annexB = res.data
      this.save(this.docTable)
    },
    annexCSuccess (res) {
      this.docTable.annexC = res.data
      this.save(this.docTable)
    },
    annexDSuccess (res) {
      this.docTable.annexD = res.data
      this.save(this.docTable)
    },
    annexESuccess (res) {
      this.docTable.annexE = res.data
      this.save(this.docTable)
    },
    annexFSuccess (res) {
      this.docTable.annexF = res.data
      this.save(this.docTable)
    },
    backToDocument () {
      this.$router.push('/document')
    },
    submitDetails () {
      // 仅0、2可以更改信息
      if (this.docTable.currentState === 0 || this.docTable.currentState === 2) {
        if (this.docTable.annexA !== null || this.docTable.annexB !== null || this.docTable.annexC !== null || this.docTable.annexD !== null || this.docTable.annexE !== null || this.docTable.annexF !== null) {
          // 变为1、待审核
          this.docTable.currentState = 1
          request.post('/contract-detail', this.docTable).then(res => {
            console.log(res)
            if (res === true) {
              this.$message({
                type: 'success',
                message: '提交完成'
              })
            } else {
              this.$message({
                type: '提交失败',
                message: res.msg
              })
            }
            this.load()
          })
        } else {
          this.$message.error('你还有文件未提交！')
          this.load()
        }
      } else {
        this.$message.error('你已经提交，不可重复提交')
        this.load()
      }
    },
  },
}
</script>

<style scoped>
.docImgBox {
  margin: 20px auto;
  height: 240px;
}

.docHeader {
  font-size: 12px;
}

.infoBox {
  height: 100px;
}

.messageBox {
  height: 80px;
  border: 1px #666;
  line-height: 25px;
  font-size: 14px
}

.redSpan {
  color: orangered;
}
</style>
