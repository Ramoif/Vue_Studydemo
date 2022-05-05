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
              这里是实习鉴定的审核部分。你可以结束你所管理的学生的实习进度，进行实习鉴定阶段的打分（评价）。
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
                    <span v-if="scope.row.currentState === 4">等待提交鉴定</span>
                    <span v-if="scope.row.currentState === 5">鉴定审核中</span>
                    <span v-if="scope.row.currentState === 6">鉴定完成</span>
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
                    <el-button v-if="[5, 6].includes(scope.row.currentState)"
                               size="mini" type="primary" plain
                               @click="showDetails(scope.row)">
                      审核/查看详情
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                :current-Page.sync="currentPage"
                :page-sizes="[5, 10, 20, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              >
              </el-pagination>
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
                  <!-- 7区间 -->
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
                <el-row :gutter="20">
                  <div class="infoBox" style="height: 120px;">
                    <el-col :span="20" :offset="2">
                      <!-- 反馈意见区域 -->
                      <div class="messageBox">
                        <h3 class="fontH18" style="margin: 40px 0 10px 0;">鉴定成绩:</h3>
                        <el-select v-model="verifyHolder" placeholder="选择审核意见">
                          <el-option label="合格" value="合格"></el-option>
                          <el-option label="优秀" value="优秀"></el-option>
                          <el-option label="不合格" value="不合格"></el-option>
                        </el-select>
                      </div>
                    </el-col>
                  </div>
                </el-row>
                <div slot="footer" class="allCenter">
                  <el-button @click="DialogVisible = false">返回</el-button>
                  <el-button type="primary" @click="submitVerify">确 定</el-button>
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
  name: 'TeacherAppraisal',
  data () {
    return {
      search: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      currentUser: {},
      searchKey: '',
      // 对应表单:data数据
      DialogVisible: false,
      docTableList: [],
      docTable: {},
      verifyHolder: '',
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
      request.get('/contract-detail/appraisal', {
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          search: this.search
        }
      }).then(res => {
        console.log(res)
        this.docTableList = res.data.records
        this.total = res.data.total
      })
      this.docTable = {}
    },
    // 分页组件
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange (pageNum) {
      this.currentPage = pageNum
      this.load()
    },
    endContract (row) {
      this.$confirm('将结束该实习生的实习，并开始实习鉴定，确定？', '提示', {
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
    toDownload () {
      window.open('https://kjxy.ctgu.edu.cn/info/1180/15683.htm')
    },
    showDetails (row) {
      this.docTable = row
      this.DialogVisible = true
    },
    submitVerify () {
      if (this.docTable.id) {
        if (this.verifyHolder !== '') {
          this.docTable.endResult = this.verifyHolder
          if (this.docTable.currentState === 5) {
            this.docTable.currentState = 6
          }
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
            this.DialogVisible = false
            this.load()
          })
        } else {
          this.$message.error('你没有选择审核意见')
        }
      } else {
        this.$message.error('error')
        this.DialogVisible = false
        this.load()
      }
    },
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
