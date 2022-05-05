<template>
  <el-row :gutter="20">
    <el-col :span="24" :offset="0">
      <div class="contract_container">
        <div class="contract_box">
          <!-- 协议表单 -->
          <el-card style="width: 100%; margin-top: 0px;">
            <h3 class="fontH24">实习鉴定<i class="el-icon-data-analysis"/></h3>
            <p class="fontH18" style="margin-top: 20px; color: #7c6868">提示：</p>
            <p style="margin-top: 10px; font-size: 14px; color: #898d83;line-height: 20px;">
              这里是实习鉴定部分。你需要在材料下载页面下载<span class="redSpan">附件7-实习鉴定表</span>，
              然后交由实习单位负责人对你的实习进行鉴定，完成实习鉴定后点击<span class="redSpan">结束实习</span>按钮上传你的鉴定表。
            </p>
            <p class="dividedLine"/>
            <!-- 条件查询 -->
            <div style="width: 100%; display: flex; margin-bottom: 10px;">
              <p style="font-weight: bold; line-height: 40px;">协议状态&nbsp;:&nbsp;</p>
              <el-select v-model="searchKey" placeholder="选择协议状态">
                <el-option label="实习中" value="3"></el-option>
                <el-option label="鉴定中" value="4"></el-option>
                <el-option label="结束鉴定" value="5"></el-option>
              </el-select>
              <el-button icon="el-icon-search" type="primary" style="margin: 0 10px;">搜索</el-button>
              <el-button type="warning" style="margin: 0 5px" @click="toDownload" plain>去教务网下载附件</el-button>
            </div>
            <div class="contractForm">
              <el-table :data="unContract" border style="width: 100%">
                <el-table-column prop="id" label="序号" width="75" sortable/>
                <el-table-column prop="contract.partB" label="实习生姓名" width="160"/>
                <el-table-column prop="contract.partA" label="实习单位"/>
                <el-table-column label="协议目前状态" width="140">
                  <template #default="scope">
                    <span v-if="scope.row.currentState === 3">实习中</span>
                    <span v-if="scope.row.currentState === 4">鉴定表待上传</span>
                    <span v-if="scope.row.currentState === 5">鉴定审核中</span>
                    <span v-if="scope.row.currentState === 6">鉴定结束</span>
                  </template>
                </el-table-column>
                <el-table-column prop="contract.startTime" label="实习开始时间" width="120"/>
                <el-table-column prop="contract.endTime" label="实习结束时间" width="120"/>
                <el-table-column fixed="right" label="操作" width="150">
                  <template #default="scope">
                    <el-button v-if="scope.row.currentState === 3"
                               size="mini" type="danger" plain
                               @click="endContract(scope.row)">
                      结束实习
                    </el-button>
                    <el-button v-if="scope.row.currentState === 4"
                               size="mini" type="warning" plain
                               @click="toAppraisalUpload(scope.row.contractId)">
                      上传鉴定表
                    </el-button>
                    <el-button v-if="[5, 6].includes(scope.row.currentState)"
                               size="mini" type="info" plain
                               @click="showDetails(scope.row)">
                      查看鉴定
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <div class="verifyDialog">
              <el-dialog title="查看详情" :visible.sync="DialogVisible">
                <el-row :gutter="20">
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
                  <el-col :span="3">
                    <div class="docImgBox">
                      <div class="docHeader">附件七：</div>
                      <div class="docBody">
                        <el-image style="width: 100px; height: 150px"
                                  :src="docTable.annexEnd"
                                  :preview-src-list="[docTable.annexEnd]">
                        </el-image>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <div slot="footer" class="allCenter">
                  <el-button @click="DialogVisible = false">返回</el-button>
                </div>
              </el-dialog>
            </div>

          </el-card>
        </div>
      </div>

    </el-col>
  </el-row>

</template>

<script>

import _global from '@/config'
import request from '@/utils/request'
import router from '@/router'

export default {
  name: 'Appraisal',
  data () {
    return {
      currentUser: {},
      searchKey: '',
      // 对应表单:data数据
      DialogVisible: false,
      docTableList: [],
      docTable: {},
      UploadUrl: 'http://' + _global._filesUrl + '/files/upload',
    }
  },
  created () {
    this.load()
  },
  computed: {
    // 仅附件审核通过后(3-6)才可以显示在鉴定表中
    unContract () {
      return this.docTableList.filter(item => [3, 4, 5, 6].includes(item.currentState))
    }
  },
  methods: {
    load () {
      const str = sessionStorage.getItem('user') || '{}'
      this.currentUser = JSON.parse(str)
      request.get('/contract-detail/findDetails/' + this.currentUser.id).then(res => {
        console.log(res)
        this.docTableList = res.data
      })
      this.docTable = {}
    },
    endContract (row) {
      this.$confirm('将结束你的实习，并开始实习鉴定，确定？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 仅实习中[3]可以结束
        if (row.currentState === 3) {
          this.docTable = row
          this.docTable.currentState = 4
          request.post('/contract-detail', this.docTable).then(res => {
            console.log(res)
            if (res === true) {
              this.$message({
                type: 'success',
                message: '结束实习操作成功'
              })
            } else {
              this.$message({
                type: '结束实习操作失败',
                message: res.msg
              })
            }
            this.load()
          })
        } else {
          this.$message.error('此协议不在实习中，请重试')
          this.load()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交鉴定'
        })
      })
    },
    toAppraisalUpload (contractId) {
      if (contractId) {
        router.push('/appraisalUpload/' + contractId)
      } else {
        this.$message.error('error')
      }
    },
    toDownload () {
      window.open('https://kjxy.ctgu.edu.cn/info/1180/15683.htm')
    },
    showDetails (row) {
      this.docTable = row
      this.DialogVisible = true
    }
  }
}
</script>

<style scoped>


.detailBox p {
  margin-bottom: 20px;
}

.detailBox span {
  color: #666666;
}

</style>
