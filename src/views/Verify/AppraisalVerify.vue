<template>
  <el-row :gutter="20">
    <el-col :span="24" :offset="0">
      <div class="contract_container">
        <div class="contract_box">
          <!-- 协议表单 -->
          <el-card style="width: 100%; margin-top: 0px;">
            <h3 class="fontH24">自主实习成绩表一览<i class="el-icon-paperclip"/></h3>
            <p style="margin-top: 10px; font-size: 14px; color: #898d83;line-height: 20px;">
              这里可以查看所有已经上传了申请表的人员的附件资料情况。查看详情可以查看实习生的附件资料详情。
            </p>
            <p class="dividedLine"/>
            <!-- 条件查询 -->
            <div style="width: 100%; display: flex; margin-bottom: 10px;">
              <el-select v-model="search" placeholder="选择实习资料状态">
                <el-option style="color: #999" label="选择实习资料状态" value=""></el-option>
                <el-option label="未上传附件资料" value="0"></el-option>
                <el-option label="待审核附件资料" value="1"></el-option>
                <el-option label="已退回附件资料" value="2"></el-option>
                <el-option label="附件审核通过" value="3"></el-option>
                <el-option label="待上传鉴定" value="4"></el-option>
                <el-option label="鉴定审核中" value="5"></el-option>
                <el-option label="鉴定已完成" value="6"></el-option>
              </el-select>
              <el-button type="success" style="margin-left: 5px;" @click="load" plain>查询</el-button>
              <!-- 导出直接调用接口 -->
              <el-button type="primary" plain @click="exportAppraisal"><i class="el-icon-download"/>导出为Excel</el-button>
            </div>
            <div class="contractForm">
              <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="contract.id" label="序号" width="75" sortable/>
                <el-table-column prop="contract.partB" label="实习生"/>
                <el-table-column prop="contract.partA" label="实习单位"/>
                <el-table-column label="实习目前状态">
                  <template #default="scope">
                    <span v-if="scope.row.currentState === 0">附件未上传</span>
                    <span v-if="scope.row.currentState === 1">附件1~6待审核</span>
                    <span v-if="scope.row.currentState === 2">附件1~6已退回</span>
                    <span v-if="scope.row.currentState === 3">附件1~6审核通过</span>
                    <span v-if="scope.row.currentState === 4">鉴定表上传中</span>
                    <span v-if="scope.row.currentState === 5">鉴定审核中</span>
                    <span v-if="scope.row.currentState === 6">实习鉴定结束</span>
                  </template>
                </el-table-column>
                <el-table-column prop="endResult" label="鉴定成绩">
                  <template #default="scope">
                    <span v-if="!scope.row.endResult">无</span>
                    <span v-if="scope.row.endResult">{{ scope.row.endResult }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="contract.startTime" label="实习开始时间" width="200"/>
                <el-table-column prop="contract.endTime" label="实习结束时间" width="200"/>
                <el-table-column fixed="right" label="操作" width="160">
                  <template #default="scope">
                    <el-button size="small" type="text" plain
                               @click="showAppraisalDetail(scope.row)">资料详情
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
          </el-card>
        </div>
      </div>

      <div class="infoDialog">
        <el-dialog title="审核申请表" :visible.sync="DialogVisible">
          <el-row :gutter="10">
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
            <!-- 7区间 -->
            <el-col :span="3">
              <div class="docImgBox">
                <div class="docHeader">鉴定表：</div>
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
            <el-button @click="DialogVisible = false">关闭</el-button>
          </div>
        </el-dialog>
      </div>
    </el-col>
  </el-row>

</template>

<script>

import request from '@/utils/request'
import _global from '@/config'

export default {
  name: 'AppraisalVerify',
  data () {
    return {
      search: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      docTable: {},
      DialogVisible: false,
    }
  },
  created () {
    this.load()
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
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    showAppraisalDetail (row) {
      this.docTable = JSON.parse(JSON.stringify(row))
      this.DialogVisible = true
    },
    exportAppraisal () {
      window.open('http://' + _global._filesUrl + '/contract/export')
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
