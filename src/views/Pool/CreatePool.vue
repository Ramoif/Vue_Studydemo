<template>
  <el-row :gutter="20">
    <el-col :span="24" :offset="0">
      <div class="contract_container">
        <div class="contract_box">
          <!-- 协议表单 -->
          <el-card style="width: 100%; margin-top: 0px;">
            <h3 class="fontH24">发布集中实习</h3>
            <p style="margin-top: 20px; font-size: 14px; color: #898d83;line-height: 20px;">
              在这里可以发布集中实习岗位，提供给集中实习学生选择。
            </p>
            <p class="dividedLine"/>
            <!-- 条件查询 -->
            <div style="width: 100%; display: flex; margin-bottom: 10px;">
              <p style="font-weight: bold; line-height: 40px;">岗位目前状态&nbsp;:&nbsp;</p>
              <el-select v-model="search" placeholder="选择集中实习岗位状态">
                <el-option style="color: #999" label="选择状态" value=""></el-option>
                <el-option label="待招募" value="0"></el-option>
                <el-option label="已下架" value="1"></el-option>
              </el-select>
              <el-button type="success" style="margin-left: 5px;" @click="load" plain>查询</el-button>
              <el-button type="primary" style="margin: 0 5px" @click="addContract" plain>创建集中实习岗位</el-button>
            </div>
            <div class="contractForm">
              <el-table :data="tableData" border style="width: 100%">
                <el-table-column label="序号" width="70px">
                  <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column prop="postName" label="岗位名称"/>
                <el-table-column prop="chargeName" label="实习单位名称"/>
                <el-table-column prop="address" label="实习地址"/>
                <el-table-column prop="addressTelephone" label="单位电话"/>
                <el-table-column prop="startTime" label="开始日期"/>
                <el-table-column prop="endTime" label="结束日期"/>
                <el-table-column label="协议目前状态">
                  <template #default="scope">
                    <span v-if="scope.row.currentState === 0">初始化0</span>
                    <span v-if="scope.row.currentState === 1">状态位1</span>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="160">
                  <template #default="scope">
                    <el-button size="small" type="text" plain
                               @click="handleContractEdit(scope.row)">查看 / 修改
                    </el-button>
                    <el-button size="small" type="text" plain
                               @click="openDeleteMsg(scope.row.id)">下架 / 删除
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
        <el-dialog title="岗位详情" :visible.sync="DialogVisible">
          <el-form :model="dialogForm" ref="dialogForm">
            <el-row>
              <el-col :span="20" :offset="1">
                <el-form-item label="岗位名称" prop="postName" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.postName" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="实习单位名称" prop="chargeName" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.chargeName" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="地址" prop="address" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.address" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="岗位联系电话" prop="addressTelephone" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.addressTelephone" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="招募人数" prop="maxSize" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.maxSize" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="开始实习时间" prop="startTime" :label-width="formLabelWidth">
                  <el-date-picker v-model="dialogForm.startTime" type="date" placeholder="选择开始日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="结束实习时间" prop="endTime" :label-width="formLabelWidth">
                  <el-date-picker v-model="dialogForm.endTime" type="date" placeholder="选择结束日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="岗位发布描述" prop="poolDescription" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.poolDescription" autocomplete="off"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="DialogVisible = false">取 消</el-button>
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
  name: 'CreatePool',
  data () {
    return {
      // contract表数据
      tableData: [],
      searchForm: {
        currentState: '',
      },
      // 添加协议表单窗口
      DialogVisible: false,
      formLabelWidth: '120px',
      // 对应表单:data数据
      dialogForm: {},
      // page
      search: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
    }
  },
  created () {
    this.load()
  },
  methods: {
    load () {
      request.get('/pool/search', {
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
    addContract () {
      this.DialogVisible = true
      this.dialogForm = {}
    },
    save () {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          // 更新
          if (this.dialogForm.id) {
            request.post('/pool', this.dialogForm).then(res => {
              console.log(res)
              if (res === true) {
                this.$message({
                  type: 'success',
                  message: '修改完成'
                })
              } else {
                this.$message({
                  type: '修改失败',
                  message: res.msg
                })
              }
              this.load()
              this.DialogVisible = false
            })
          } else { // 新增
            request.post('/pool', this.dialogForm).then(res => {
              console.log(res)
              if (res === true) {
                this.$message({
                  type: 'success',
                  message: '新增成功'
                })
              } else {
                this.$message({
                  type: '新增失败',
                  message: res.msg
                })
              }
              // 更新完成后应该刷新数据并且关闭弹窗。
              this.load()
              this.DialogVisible = false
            })
          }
        } else {
          return false
        }
      })
    },
    handleEdit (row) {
      this.dialogForm = JSON.parse(JSON.stringify(row))
      this.DialogVisible = true
    },
    handleContractEdit (row) {
      this.dialogForm = JSON.parse(JSON.stringify(row))
      this.DialogVisible = true
    },
    openDeleteMsg (id) {
      this.$confirm('将删除此项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.delete('/pool/' + id).then(res => {
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
