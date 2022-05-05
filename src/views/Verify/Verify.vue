<template>
  <el-row :gutter="20">
    <el-col :span="24" :offset="0">
      <el-card>
        <div class="verify-header">
          <h3 class="fontH24">附件资料审核</h3>
          <p style="margin-top: 10px; font-size: 14px; color: #898d83;line-height: 20px;">
            这里是进行附件1~附件6的审核的功能区，分别是：附件1-申请表、附件2-单位简介表、附件3-介绍信、
            附件4-单位接收函、附件5-安全承诺书、附件6-家长告知书。
          </p>
          <p class="dividedLine"/>
        </div>
        <div class="verifySearch">
          <el-select v-model="search" placeholder="选择附件资料状态">
            <el-option style="color: #999" label="选择附件资料状态" value=""></el-option>
            <el-option label="待审核" value="1"></el-option>
            <el-option label="已退回" value="2"></el-option>
            <el-option label="审核通过" value="3"></el-option>
            <el-option label="审核通过(实习鉴定中)" value="4"></el-option>
            <el-option label="审核通过(鉴定审核中)" value="5"></el-option>
            <el-option label="审核通过(结束实习)" value="6"></el-option>
          </el-select>
          <el-button type="success" style="margin-left: 5px;" @click="load" plain>查询</el-button>
        </div>
        <div class="verifyForm">
          <el-table :data="unsigns" @selection-change="handleSelectionChange" border style="width: 100%">
            <el-table-column type="selection" width="55"/>
            <el-table-column label="序号" width="70px">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="contract.partB" label="实习生姓名"/>
            <el-table-column prop="contract.partA" label="实习基地"/>
            <el-table-column label="实习目前状态">
              <template #default="scope">
                <span v-if="scope.row.currentState === 0">未上传资料</span>
                <span v-if="scope.row.currentState === 1">待审核</span>
                <span v-if="scope.row.currentState === 2">已退回</span>
                <span v-if="scope.row.currentState === 3">审核通过</span>
                <span v-if="scope.row.currentState === 4">审核通过(实习鉴定中)</span>
                <span v-if="scope.row.currentState === 5">审核通过(鉴定审核中)</span>
                <span v-if="scope.row.currentState === 6">审核通过(结束实习)</span>
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" sortable>
              <template slot-scope="scope">{{ scope.row.updateTime| dateYMDHMSFormat }}</template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
              <template #default="scope">
                <el-button size="small" type="primary" @click="examineDetail(scope.row)" plain>审核 / 查看</el-button>
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
            style="margin: 20px auto;"
          >
          </el-pagination>
        </div>
        <!-- 审核资料弹窗 -->
        <div class="verifyDialog">
          <el-dialog title="审核附件资料" :visible.sync="DialogVisible">
            <el-row :gutter="10">
              <!-- 1区间 -->
              <el-col :span="3" :offset="2">
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
                    <el-image style="width: 100px; height: 150px"
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
            </el-row>
            <el-row :gutter="20">
              <div class="infoBox" style="height: 120px;">
                <el-col :span="20" :offset="2">
                  <!-- 反馈意见区域 -->
                  <div class="messageBox">
                    <h3 class="fontH18" style="margin: 40px 0 10px 0;">审核意见:</h3>
                    <el-select v-model="verifyHolder" placeholder="选择审核意见">
                      <el-option label="拒绝" value="2"></el-option>
                      <el-option label="审核通过" value="3"></el-option>
                    </el-select>
                    <h3 class="fontH18" style="margin: 20px 0 10px 0;">反馈信息:</h3>
                    <el-input v-model="docTable.comments" type="textarea" autocomplete="off"/>
                  </div>
                </el-col>
              </div>
            </el-row>
            <div slot="footer" class="allCenter">
              <el-button @click="DialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitVerify">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>

import request from '@/utils/request'

export default {
  data () {
    return {
      // 条件查询
      search: '',
      verifyHolder: '',
      // 多选操作
      ids: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      docTable: {},
      auditOption: '',
      DialogVisible: false,
    }
  },
  name: 'Verify',
  components: {},
  created () {
    this.load()
  },
  computed: {
    unsigns () {
      return this.tableData.filter(item => [1, 2, 3, 4, 5, 6].includes(item.currentState))
    }
  },
  methods: {
    load () {
      request.get('/contract-detail', {
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          search: this.search
        }
      }).then(res => {
        console.log(res)
        // 放入表单数据
        this.tableData = res.data.records
        // 放入查询总条数
        this.total = res.data.total
      })
      this.docTable = {}
    },
    submitVerify () {
      if (this.docTable.id) {
        if (this.verifyHolder !== '') {
          this.docTable.currentState = this.verifyHolder
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
    // 审核examine
    examineDetail (row) {
      this.docTable = JSON.parse(JSON.stringify(row))
      this.DialogVisible = true
    },
    handleSelectionChange (val) {
      this.ids = val.map(v => v.id)
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange (pageNum) {
      this.currentPage = pageNum
      this.load()
    },
  },
}

</script>

<style lang="scss" scoped>
.docHeader {
  font-size: 10px;
}

.verifySearch {
  display: flex;
  margin-bottom: 10px;
}
</style>
