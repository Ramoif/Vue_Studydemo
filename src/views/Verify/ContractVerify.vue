<template>
  <el-row :gutter="20">
    <el-col :span="24" :offset="0">
      <div class="contract_container">
        <div class="contract_box">
          <!-- 协议表单 -->
          <el-card style="width: 100%; margin-top: 0px;">
            <h3 class="fontH24">申请表审核</h3>
            <p class="dividedLine"/>
            <!-- 条件查询 -->
            <div style="width: 100%; display: flex; margin-bottom: 10px;">
              <el-input v-model="search"
                        placeholder="输入学生姓名"
                        style="width: 20%"
                        clearable></el-input>
              <el-button type="success" style="margin-left: 5px;" @click="load" plain>查询</el-button>

            </div>
            <div class="contractForm">
              <el-table :data="tableData" border style="width: 100%">
                <el-table-column label="序号" width="80px">
                  <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column prop="userId" label="用户ID" width="70"/>
                <el-table-column prop="partB" label="学生姓名" width="200"/>
                <el-table-column prop="partA" label="实习基地"/>
                <el-table-column prop="startTime" label="开始日期" sortable/>
                <el-table-column prop="endTime" label="结束日期" sortable/>
                <el-table-column prop="currentState" label="协议目前状态" width="140">
                  <template #default="scope">
                    <span v-if="scope.row.currentState === 1">申请书待审核</span>
                    <span v-if="scope.row.currentState === 2">需修改申请书</span>
                    <span v-if="[3,4,5,6,7,8,9].includes(scope.row.currentState)">申请书通过</span>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="160">
                  <template #default="scope">
                    <el-button size="small" type="primary" plain
                               v-if="scope.row.currentState===1 || scope.row.currentState===2"
                               @click="handleContractEdit(scope.row)">审核 / 详情
                    </el-button>
                    <el-button size="small" type="text" plain
                               v-if="[3,4,5,6,7,8,9].includes(scope.row.currentState)"
                               @click="exportContract(scope.row.id)">导出申请表
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
        <el-dialog title="审核申请表" :visible.sync="contractDialogVisible">
          <el-form :model="dialogForm" ref="dialogForm">
            <el-row>
              <el-col :span="20" :offset="1">
                <el-form-item label="甲方 (实习基地)" prop="partA" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.partA" autocomplete="off" disabled/>
                </el-form-item>
                <el-form-item label="乙方 (实习生)" prop="partB" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.partB" autocomplete="off" disabled/>
                </el-form-item>
                <el-form-item label="实习地址" prop="address" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.address" autocomplete="off" disabled/>
                </el-form-item>
                <el-form-item label="目前就读学校" prop="school" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.school" autocomplete="off" disabled/>
                </el-form-item>
                <el-form-item label="单位联系电话" prop="partPhone" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.partPhone" autocomplete="off" disabled/>
                </el-form-item>
                <el-form-item label="班级" prop="grade" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.gradeClass" autocomplete="off" disabled/>
                </el-form-item>
                <el-form-item label="学号" prop="gradeNum" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.gradeNum" autocomplete="off" disabled/>
                </el-form-item>
                <el-form-item label="个人联系电话" prop="partPhone" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.stuPhone" autocomplete="off" disabled/>
                </el-form-item>
                <el-form-item label="开始实习时间" prop="startTime" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.startTime" autocomplete="off" disabled/>
                </el-form-item>
                <el-form-item label="结束实习时间" prop="endTime" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.endTime" autocomplete="off" disabled/>
                </el-form-item>
                <p class="dividedLine"/>
                <h3 class="fontH24" style="margin: 20px 0;">审核意见</h3>
                <el-form-item>
                  <el-select v-model="verifyHolder" placeholder="选择审核意见">
                    <el-option label="不同意" value="2"></el-option>
                    <el-option label="通过" value="3"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="反馈信息" prop="currentComment">
                  <el-input v-model="dialogForm.currentComment" type="textarea" autocomplete="off"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="contractDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="save">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-col>
  </el-row>

</template>

<script>

import request from '@/utils/request'
import _global from '@/config/index'

export default {
  name: 'ContractVerify',
  data () {
    return {
      // 当前用户
      currentUser: {},
      // contract表数据
      tableData: [],
      search: '',
      verifyHolder: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchForm: {
        internState: '',
      },
      // 添加协议表单窗口
      contractDialogVisible: false,
      formLabelWidth: '120px',
      // 对应表单:data数据
      dialogForm: {},
      // 表单验证规则
      rules: {
        partA: [{
          required: true,
          message: '请输入内容',
        }],
        partB: [{
          required: true,
          message: '请输入内容',
        }],
        address: [{
          required: true,
          message: '请输入内容',
        }],
        school: [{
          required: true,
          message: '请输入内容',
        }],
        partPhone: [{
          required: true,
          message: '请输入内容',
        }],
        grade: [{
          required: true,
          message: '请输入内容',
        }],
        startTime: [{
          required: true,
          message: '请输入内容',
        }],
        endTime: [{
          required: true,
          message: '请输入内容',
        }]
      },
    }
  },
  created () {
    this.load()
  },
  methods: {
    load () {
      const str = sessionStorage.getItem('user') || '{}'
      this.currentUser = JSON.parse(str)
      request.get('/contract', {
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
      // 刷新清空表单
      this.dialogForm = {}
    },
    addContract () {
      this.contractDialogVisible = true
      this.dialogForm = {}
    },
    save () {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          // 更新
          if (this.dialogForm.id) {
            // 把操作编号更新到对象中
            if (this.verifyHolder !== '') {
              this.dialogForm.currentState = this.verifyHolder
              request.post('/contract', this.dialogForm).then(res => {
                console.log(res)
                if (res === true) {
                  this.$message({
                    type: 'success',
                    message: '更新成功'
                  })
                } else {
                  this.$message({
                    type: '更新失败',
                    message: res.msg
                  })
                }
                this.load()
                this.contractDialogVisible = false
              })
            } else {
              this.$message.error('你没有选中审核意见')
              return false
            }
          }
        } else {
          this.$message.error('不符合表单验证规则')
          return false
        }
      })
    },
    handleEdit (row) {
      this.dialogForm = JSON.parse(JSON.stringify(row))
      this.contractDialogVisible = true
    },
    exportContract (id) {
      window.open('http://' + _global._filesUrl + '/contract/export/' + id)
    },
    handleContractEdit (row) {
      this.dialogForm = JSON.parse(JSON.stringify(row))
      this.contractDialogVisible = true
    },
    openDeleteMsg (id) {
      this.$confirm('将删除此项协议, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.delete('/contract/' + id).then(res => {
          if (res === true) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
          // 删除完成后应该刷新数据
          this.load()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
.dividedLine {
  padding: 0 20px 0;
  margin: 20px 0;
  line-height: 0;
  border: 1px solid #ddd;
  text-align: center;
}

.detailBox p {
  margin-bottom: 20px;
}

.detailBox span {
  color: #666666;
}

</style>
