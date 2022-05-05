<template>
  <div class="home" style="padding: 0px; width: 100%">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="fontH24">权限路由管理</div>
            <p class="dividedLine"/>
            <div style="margin-bottom: 10px;width: 100%;display: flex;">
              <el-input v-model="search"
                        placeholder="输入名称"
                        style="width: 20%"
                        clearable></el-input>
              <el-button type="success" style="margin-left: 5px;" @click="load" plain>查询</el-button>
              <div style="padding-left: 10px;">
                <el-button type="primary" @click="add" plain><i class="el-icon-plus"/>新增</el-button>
                <!-- 批量删除 -->
                <el-button type="danger" @click="deleteUserBatch">批量删除</el-button>
              </div>
            </div>
          </el-col>

        </el-row>
        <!-- 主表格 -->
        <el-table :data="tableData"
                  :header-cell-class-name="'headerBg'"
                  row-key="id"
                  default-expand-all
                  style="width: 100%"
                  @selection-change="handleSelectionChange"
                  stripe
                  border>
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="id" label="序号" width="80" sortable/>
          <el-table-column prop="name" label="名称"/>
          <el-table-column prop="path" label="路径"/>
          <el-table-column prop="pagePath" label="页面路径"/>
          <el-table-column prop="icon" label="图标">
            <template slot-scope="scope">
              <span :class="scope.row.icon"/>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述"/>
          <el-table-column fixed="right" label="操作" width="300">
            <template #default="scope">
              <el-button size="small" type="success" @click="addChildren(scope.row.id)" v-if="!(scope.row.pid)&&!(scope.row.path)" plain>
                添加子菜单
              </el-button>
              <el-button size="small" type="primary" @click="handleEdit(scope.row)" plain>编辑</el-button>
              <el-button size="small" type="danger" @click="openDeleteMsg(scope.row.id)" plain>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin: 10px 0;">
          <!-- 弹窗 -->
          <el-dialog :visible.sync="dialogVisible" title="权限路由" width="30%">
            <el-form :model="form" label-width="120px">
              <el-form-item label="名称">
                <el-input v-model="form.name" style="width: 80%;"></el-input>
              </el-form-item>
              <el-form-item label="路径">
                <el-input v-model="form.path" style="width: 80%;"></el-input>
              </el-form-item>
              <el-form-item label="页面路径">
                <el-input v-model="form.pagePath" style="width: 80%;"></el-input>
              </el-form-item>
              <el-form-item label="图标">
                <el-select clearable v-model="form.icon" placeholder="请选择" style="width: 80%">
                  <el-option v-for="item in options" :value="item.value" :key="item.name" :label="item.name">
                    <i :class="item.value"/> {{ item.name }}
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="form.description" style="width: 80%;"></el-input>
              </el-form-item>
            </el-form>
            <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="save">确定</el-button>
          </span>
            </template>
          </el-dialog>

        </div>

      </el-col>
    </el-row>
  </div>
</template>

<script>

import request from '@/utils/request'
import _global from '@/config/index'

export default {
  data () {
    return {
      user: {},
      search: '',
      tableData: [],
      dialogVisible: false,
      DetailDialogVisible: false,
      ids: [],
      form: {},
      internVisible: false,
      internForm: {},
      formLabelWidth: '120px',
      options: [],
    }
  },
  name: 'Permission',
  components: {},
  created () {
    this.load()
  },
  methods: {
    fileUploadSuccess (res) {
      // 给表单的cover赋值 = 上传的地址
      this.form.avatarUrl = res.data
    },
    load () {
      request.get('/permission/all', {
        params: {
          search: this.search
        }
      }).then(res => {
        console.log(res)
        // 放入表单数据
        this.tableData = res.data
      })
      // 请求图标数据
      request.get('/permission/icons').then(res => {
        this.options = res.data
      })
    },
    add () {
      this.dialogVisible = true
      // 每次打开清空表单域
      this.form = {}
    },
    addChildren (pid) {
      // 代表这里传入的是新增项的父级id
      this.dialogVisible = true
      this.form = {}
      if (pid) {
        this.form.pid = pid
      }
    },
    save () {
      if (this.form.id) {
        request.post('/permission', this.form).then(res => {
          if (res === true) {
            this.$message({
              type: 'success',
              message: '更新权限路由完成'
            })
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
          this.load()
          this.dialogVisible = false
        })
      } else {
        request.post('/permission', this.form).then(res => {
          console.log(this.form)
          if (res === true) {
            this.$message({
              type: 'success',
              message: '新增成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: res.msg + '，新增失败'
            })
          }
          this.load()
          this.dialogVisible = false
        })
      }
    },

    handleEdit (row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    openDeleteMsg (id) {
      // 传入此列成员的id
      this.$confirm('将删除id为' + id + '的权限菜单, 继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.delete('/permission/' + id).then(res => {
          console.log(res)
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
    handleDelete (id) {
      request.delete('/permission/' + id).then(res => {
        console.log(res)
        if (res.code === '0') {
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
    // 多选操作
    handleSelectionChange (val) {
      // 作用是让ids中存放所有选中的对象的id : [{id,name},{id,name}] => [id,id]
      this.ids = val.map(v => v.id)
    },
    // 多选删除
    deleteBatch () {
      // 未选择
      if (!this.ids.length) {
        this.$message.warning('请选择数据！')
        return
      }
      request.post('/permission/deleteBatch', this.ids).then(res => {
        if (res.code === '0') {
          this.$message.success('批量删除成功')
          this.load()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    deleteUserBatch () {
      this.$confirm('将删除所选用户, 继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!this.ids.length) {
          this.$message.warning('请选择数据！')
          return
        }
        request.post('/permission/deleteBatch', this.ids).then(res => {
          if (res.code === '0') {
            this.$message.success('批量删除成功')
            this.load()
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    exportUser () {
      window.open('http://' + _global._filesUrl + '/permission/export')
    },
    handleExcelImportSuccess (res, file, fileList) {
      this.$message.success('导入成功')
      // 上传完刷新表格
      this.load()
    },
    handleExcelImportError (err, file, fileList) {
      this.$message.success('导入失败')
      this.load()
    },
  }
}
</script>

<style scoped>

</style>
