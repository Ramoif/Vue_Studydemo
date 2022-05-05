<template>
  <el-row :gutter="20">
    <el-col :span="24" :offset="0">
      <div class="contract_container">
        <div class="contract_box">
          <!-- 协议表单 -->
          <el-card style="width: 100%; margin-top: 0px;">
            <h3 class="fontH24">申请表管理</h3>
            <p class="dividedLine"/>
            <!-- 条件查询 -->
            <div style="width: 100%; display: flex; margin-bottom: 10px;">
              <p style="font-weight: bold; line-height: 40px;">协议状态&nbsp;:&nbsp;</p>
              <el-select v-model="searchForm.internState" placeholder="选择申请书状态">
                <el-option label="已提交" value="已提交"></el-option>
                <el-option label="需修改" value="需修改"></el-option>
                <el-option label="已审核" value="已审核"></el-option>
              </el-select>
              <el-button type="primary" style="margin: 0 5px" @click="addContract" plain>创建新申请表</el-button>
              <el-button @click="queryInternMethod" type="warning" plain>查询申请资格</el-button>
            </div>
            <div class="contractForm">
              <el-table :data="tableData" border style="width: 100%">
                <el-table-column label="序号" width="70px">
                  <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column prop="partB" label="实习生姓名"/>
                <el-table-column prop="partA" label="实习单位名称"/>
                <el-table-column prop="address" label="实习单位地址"/>
                <el-table-column prop="school" label="学校"/>
                <el-table-column prop="partPhone" label="单位联系电话"/>
                <el-table-column prop="gradeClass" label="班级"/>
                <el-table-column prop="gradeClass" label="学号"/>
                <el-table-column prop="stuPhone" label="个人联系电话"/>
                <el-table-column prop="startTime" label="开始日期"/>
                <el-table-column prop="endTime" label="结束日期"/>
                <el-table-column label="协议目前状态">
                  <template #default="scope">
                    <span v-if="scope.row.currentState === 1">已提交申请书</span>
                    <span v-if="scope.row.currentState === 2">申请书需修改</span>
                    <span v-if="[3,4,5,6,7,8,9].includes(scope.row.currentState)">申请书通过</span>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="160">
                  <template #default="scope">
                    <el-button size="small" type="primary" plain
                               v-if="[3,4,5,6,7,8,9].includes(scope.row.currentState)"
                               @click="exportContract(scope.row.id)">导出申请表
                    </el-button>
                    <el-button size="small" type="text" plain
                               v-if="scope.row.currentState===1 || scope.row.currentState===2"
                               @click="handleContractEdit(scope.row)">查看 / 修改
                    </el-button>
                    <el-button size="small" type="text" plain
                               v-if="scope.row.currentState===1 || scope.row.currentState===2"
                               @click="openDeleteMsg(scope.row.id)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </div>
      </div>

      <div class="infoDialog">
        <el-dialog title="申请表详情" :visible.sync="contractDialogVisible">
          <el-form :model="dialogForm" ref="dialogForm" :rules="rules">
            <el-row>
              <el-col :span="20" :offset="1">
                <el-form-item label="实习单位名称" prop="partA" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.partA" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="实习生姓名" prop="partB" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.partB" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="实习地址" prop="address" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.address" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="单位负责人" prop="partCharge" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.partCharge" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="目前就读学校" prop="school" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.school" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="单位联系电话" prop="partPhone" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.partPhone" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="班级" prop="gradeClass" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.gradeClass" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="学号" prop="gradeNum" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.gradeNum" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="个人联系电话" prop="partPhone" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.stuPhone" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="开始实习时间" prop="startTime" :label-width="formLabelWidth">
                  <el-date-picker v-model="dialogForm.startTime" type="date" placeholder="选择开始日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="结束实习时间" prop="endTime" :label-width="formLabelWidth">
                  <el-date-picker v-model="dialogForm.endTime" type="date" placeholder="选择结束日期">
                  </el-date-picker>
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
  name: 'Contract',
  data () {
    return {
      // 当前用户
      currentUser: {},
      // contract表数据
      tableData: [],
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
        partCharge: [{
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
        gradeClass: [{
          required: true,
          message: '请输入内容',
        }],
        gradeNum: [{
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
      request.get('/contract/' + this.currentUser.id).then(res => {
        this.tableData = res.data
        console.log(this.tableData)
      })
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
            this.dialogForm.currentState = 1
            request.post('/contract', this.dialogForm).then(res => {
              console.log(res)
              if (res === true) {
                this.$message({
                  type: 'success',
                  message: '申请书修改完成'
                })
              } else {
                this.$message({
                  type: '申请书修改失败',
                  message: res.msg
                })
              }
              this.load()
              this.contractDialogVisible = false
            })
          } else { // 新增
            this.dialogForm.userId = this.currentUser.id
            this.dialogForm.currentState = 1
            request.post('/contract', this.dialogForm).then(res => {
              console.log(res)
              if (res === true) {
                this.$message({
                  type: 'success',
                  message: '申请书新增成功'
                })
              } else {
                this.$message({
                  type: '申请书新增失败',
                  message: res.msg
                })
              }
              // 更新完成后应该刷新数据并且关闭弹窗。
              this.load()
              this.contractDialogVisible = false
            })
          }
        } else {
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
      this.$confirm('将删除此项申请书, 是否继续?', '提示', {
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
    queryInternMethod () {
      request.get('/contract/queryProcessing/' + this.currentUser.id).then(res => {
        if (res.data === 0) {
          this.$message({
            type: 'success',
            message: '您可以创建申请书！'
          })
        } else if (res.data > 0) {
          this.$message({
            type: 'error',
            message: '您现在不能创建更多的申请书了'
          })
        } else {
          this.$message({
            type: 'error',
            message: '操作有误，请联系管理员'
          })
        }
      })
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
