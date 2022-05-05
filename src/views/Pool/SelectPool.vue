<template>
  <el-row :gutter="20">
    <el-col :span="24" :offset="0">
      <div class="contract_container">
        <div class="contract_box">
          <!-- 协议表单 -->
          <el-card style="width: 100%; margin-top: 0px;">
            <h3 class="fontH24">选择集中实习岗位</h3>
            <p style="margin-top: 20px; font-size: 14px; color: #898d83;line-height: 20px;">
              这里是集中实习岗位选择表。在学生与指导老师取得沟通协商后，确定并选择你所联系好的实习单位岗位，发起实习申请。
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
              <el-button @click="testMethod" type="primary" plain>查询集中实习资格</el-button>
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
                <el-table-column prop="maxSize" label="计划人数"/>
                <el-table-column prop="startTime" label="开始日期"/>
                <el-table-column prop="endTime" label="结束日期"/>
                <el-table-column label="目前状态">
                  <template #default="scope">
                    <span v-if="scope.row.currentState === 0">招募中</span>
                    <span v-if="scope.row.currentState === 1">已关闭</span>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="180">
                  <template #default="scope">
                    <el-button size="small" type="primary" plain
                               @click="handleContractEdit(scope.row)">详情
                    </el-button>
                    <el-button size="small" type="warning" plain
                               @click="selectMsg(scope.row)">选择岗位
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
                <p><span>岗位名称：</span>
                  {{ dialogForm.postName }}
                </p>
                <p><span>实习单位名称：</span>
                  {{ dialogForm.chargeName }}
                </p>
                <p><span>地址：</span>
                  {{ dialogForm.address }}
                </p>
                <p><span>岗位联系电话：</span>
                  {{ dialogForm.addressTelephone }}
                </p>
                <p><span>招募人数：</span>
                  {{ dialogForm.maxSize }}
                </p>
                <p><span>目前人数：</span>
                  {{ dialogForm.currentSize }} (请以用人单位为准)
                </p>
                <p><span>开始日期：</span>
                  {{ dialogForm.startTime }}
                </p>
                <p><span>结束日期：</span>
                  {{ dialogForm.endTime }}
                </p>
                <p><span>单位备注：</span>
                  {{ dialogForm.poolDescription }}
                </p>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="allCenter">
            <el-button @click="selectMsg(dialogForm.id)" plain type="warning">选择该岗位</el-button>
            <el-button @click="DialogVisible = false" plain type="danger">关 闭</el-button>
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
  name: 'SelectPool',
  data () {
    return {
      user: {},
      userPoolCurrentState: 0,
      // contract表数据
      tableData: [],
      poolForm: {
        userId: 0,
        poolId: 0
      },
      searchForm: {
        currentState: ''
      },
      // 添加协议表单窗口
      DialogVisible: false,
      formLabelWidth: '120px',
      // 对应表单:data数据
      dialogForm: {},
      contractForm: {},
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
    testMethod () {
      console.log(this.userPoolCurrentState)
      if (this.userPoolCurrentState === 0) {
        this.$message({
          type: 'success',
          message: '您可以创建申请书！'
        })
      } else if (this.userPoolCurrentState > 0) {
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
    },
    load () {
      const userStr = sessionStorage.getItem('user') || '{}'
      this.user = JSON.parse(userStr)
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
      // 获取当前用户的集中实习状态，非0代表有正在进行的实习
      request.get('/contract/queryProcessing/' + this.user.id).then(res => {
        this.userPoolCurrentState = res.data
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
                  type: 'error',
                  message: '修改失败'
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
    // 创建选择岗位的详情上传表单，这里传入pool-create岗位那一列
    selectMsg (row) {
      console.log(row)
      this.$confirm('将选择此项岗位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 传入部分缺省数据
        this.contractForm.userId = this.user.id
        this.contractForm.partA = row.chargeName
        this.contractForm.partB = this.user.username
        this.contractForm.address = row.address
        this.contractForm.partPhone = row.addressTelephone
        this.contractForm.stuPhone = this.user.cellphone
        this.contractForm.startTime = row.startTime
        this.contractForm.endTime = row.endTime
        // (重要)设置状态为2 - 请修改申请书
        this.contractForm.currentState = 2
        // 直接添加contract
        request.post('/contract', this.contractForm).then(res => {
          console.log(res)
          if (res === true) {
            this.$message({
              type: 'success',
              message: '集中实习申请书创建成功，请前往申请书页面修改并查看'
            })
            // 添加成功的时候也让pool的当前size+1
            request.post('/pool/sizeAdd/' + row.id).then(res => {
              console.log(res)
            })
          } else {
            this.$message({
              type: '用户不存在或岗位有误，请重试',
              message: res.msg
            })
          }
        })
        this.load()

        // if (this.poolForm.poolId !== 0 && this.poolForm.userId !== 0) {
        //   request.post('/pool-detail', this.poolForm).then(res => {
        //     if (res === true) {
        //       this.$message({
        //         type: 'success',
        //         message: '集中实习申请书创建成功，请前往申请书页面修改并查看'
        //       })
        //     } else {
        //       this.$message({
        //         type: 'error',
        //         message: res.msg
        //       })
        //     }
        //     // 删除完成后应该刷新数据
        //     this.load()
        //     this.DialogVisible = false
        //   })
        // } else {
        //   this.$message({
        //     type: 'error',
        //     message: '用户不存在或岗位有误，请重试'
        //   })
        //   this.load()
        //   this.DialogVisible = false
        // }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消所选择岗位'
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

.infoDialog span {
  font-size: 18px;
  font-weight: bold;
  color: #409EFF;
}

.infoDialog p {
  font-size: 16px;
  margin: 15px 0;
}
</style>
