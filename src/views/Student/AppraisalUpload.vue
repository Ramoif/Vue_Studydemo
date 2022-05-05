<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-card>
        <div class="fontH24">实习鉴定材料上传</div>
        <p class="fontH18" style="margin-top: 20px; color: #7c6868">写在前面：</p>
        <p style="margin-top: 10px; font-size: 14px; color: #898d83;line-height: 20px;">
          在这个页面你可以确认你的所有实习材料是否清晰可见。在材料下载页面下载<span class="redSpan">附件7-实习鉴定表</span>，
          然后交由实习单位负责人对你的实习进行鉴定，完成实习鉴定后在此页面上传你的实习鉴定表。
          你需要仔细确认文件是否符合要求， 尽量上传符合要求的文件来通过审核。
          你可以在这个页面<span class="redSpan">点击图片</span>查看自己上传的照片是否清晰可见，
          自我审核一遍再上传材料，以便审核人员快速审查，避免二次编辑。
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
              <span v-if="docTable.currentState === 4">实习鉴定中，待上传实习鉴定表</span>
              <span v-if="docTable.currentState === 5">鉴定审核中</span>
              <span v-if="docTable.currentState === 6">鉴定已完成</span>
            </div>
          </div>
          <!-- 1区间 -->
          <el-col :span="3" :offset="1">
            <div class="docImgBox">
              <div class="docHeader">附件一：</div>
              <div class="docBody">
                <el-image style="width: 100px; height: 150px"
                          :src="docTable.annexA"
                          :preview-src-list="[docTable.annexA]">
                </el-image>
              </div>
            </div>
          </el-col>
          <!-- 2区间 -->
          <el-col :span="3">
            <div class="docImgBox">
              <div class="docHeader">附件二：</div>
              <div class="docBody">
                <el-image style="width: 100px; height: 150px"
                          :src="docTable.annexB"
                          :preview-src-list="[docTable.annexB]">
                </el-image>
              </div>
            </div>

          </el-col>
          <!-- 3区间 -->
          <el-col :span="3">
            <div class="docImgBox">
              <div class="docHeader">附件三：</div>
              <div class="docBody">
                <el-image style="width: 60%; height: 150px"
                          :src="docTable.annexC"
                          :preview-src-list="[docTable.annexC]">
                </el-image>
              </div>
            </div>

          </el-col>
          <!-- 4区间 -->
          <el-col :span="3">
            <div class="docImgBox">
              <div class="docHeader">附件四：</div>
              <div class="docBody">
                <el-image style="width: 100px; height: 150px"
                          :src="docTable.annexD"
                          :preview-src-list="[docTable.annexD]">
                </el-image>
              </div>
            </div>
          </el-col>
          <!-- 5区间 -->
          <el-col :span="3">
            <div class="docImgBox">
              <div class="docHeader">附件五：</div>
              <div class="docBody">
                <el-image style="width: 100px; height: 150px"
                          :src="docTable.annexE"
                          :preview-src-list="[docTable.annexE]">
                </el-image>
              </div>
            </div>
          </el-col>
          <!-- 6区间 -->
          <el-col :span="3">
            <div class="docImgBox">
              <div class="docHeader">附件六：</div>
              <div class="docBody">
                <el-image style="width: 100px; height: 150px"
                          :src="docTable.annexF"
                          :preview-src-list="[docTable.annexF]">
                </el-image>
              </div>
            </div>
          </el-col>
          <!-- 7区间鉴定表 -->
          <el-col :span="4">
            <div class="docImgBox">
              <div class="docHeader"><span style="font-weight: bold">实习鉴定表：</span></div>
              <div class="docBody">
                <el-image style="width: 100px; height: 150px"
                          :src="docTable.annexEnd"
                          :preview-src-list="[docTable.annexEnd]">
                </el-image>
              </div>
              <div class="docFooter">
                <el-upload ref="upload" :action="UploadUrl" :on-success="annexEndSuccess">
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
              <div class="allCenter" style="height: 20px;">
                <el-button type="info" style="width: 10%" @click="backToAppraisal" plain>返回</el-button>
                <el-button type="success" style="width: 10%" @click="submitAppraisal" plain>提交鉴定表</el-button>
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
  name: 'AppraisalUpload',
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
        // 仅待上传状态可以上传附件7
        if (table.currentState === 4) {
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
        this.$router.push('/appraisal')
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
    annexEndSuccess (res) {
      this.docTable.annexEnd = res.data
      this.save(this.docTable)
    },
    submitAppraisal () {
      if (this.docTable.annexEnd) {
        this.$confirm('将提交你的实习鉴定，确认？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 仅鉴定中[4]可以上传
          if (this.docTable.currentState === 4) {
            this.docTable.currentState = 5
            request.post('/contract-detail', this.docTable).then(res => {
              console.log(res)
              if (res === true) {
                this.$message({
                  type: 'success',
                  message: '提交鉴定完成'
                })
              } else {
                this.$message({
                  type: '提交鉴定失败',
                  message: res.msg
                })
              }
              this.$router.push('/appraisal')
            })
          } else {
            this.$message.error('你不在鉴定状态，请重试')
            this.load()
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消提交鉴定'
          })
        })
      } else {
        this.$message.error('实习鉴定表不存在！')
        this.load()
      }
    },
    backToAppraisal () {
      this.$router.push('/appraisal')
    },
  }
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
