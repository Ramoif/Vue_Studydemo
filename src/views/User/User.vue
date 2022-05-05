<template>
  <div class="home" style="padding: 0px; width: 100%">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="fontH24">用户管理</div>
            <p class="dividedLine"/>
            <!-- 表格工具栏  -->
            <div style="margin-bottom: 10px;width: 100%;display: flex;">
              <el-input v-model="search"
                        placeholder="输入用户名"
                        style="width: 20%"
                        clearable></el-input>
              <el-button type="success" style="margin-left: 5px;" @click="load" plain>查询</el-button>
              <div style="padding-left: 10px;">
                <el-button type="primary" @click="add" plain><i class="el-icon-plus"/>新增</el-button>
                <!-- 导入需要上传插件 -->
                <el-upload
                  :action="excelUploadUrl"
                  style="display: inline-block"
                  :show-file-list=false
                  :limit="1"
                  accept=".xlsx"
                  :on-success="handleExcelImportSuccess"
                  :on-error="handleExcelImportError"
                >
                  <el-button type="primary" plain style="margin: 0 10px;"><i class="el-icon-upload"/>导入</el-button>
                </el-upload>
                <!-- 导出直接调用接口 -->
                <el-button type="primary" plain @click="exportUser"><i class="el-icon-download"/>导出</el-button>
                <!-- 批量删除,仅1可见 -->
                <el-button type="danger" @click="deleteUserBatch">批量删除</el-button>
              </div>
            </div>
          </el-col>

        </el-row>
        <!-- 主表格 -->
        <el-table :data="tableData"
                  style="width: 100%"
                  @selection-change="handleSelectionChange"
                  stripe
                  border>
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="id" label="序号" width="80" sortable/>
          <el-table-column prop="username" label="用户名"/>
          <el-table-column prop="role" label="角色权限"/>
          <!-- 数据库中字段nick_name转为驼峰命名nickName -->
          <el-table-column prop="nickName" label="昵称"/>
          <el-table-column prop="age" label="年龄" width="80"/>
          <el-table-column prop="sex" label="性别" width="80"/>
          <el-table-column prop="email" label="邮箱"/>
          <el-table-column prop="cellphone" label="电话"/>
          <!-- 图片展示，不能通过prop来展示，需要设置单独方法 -->
          <el-table-column label="头像">
            <template #default="scope">
              <el-image
                style="width: 40px; height: 40px"
                :src="scope.row.avatarUrl"
                :preview-src-list="[scope.row.avatarUrl]"
                append-to-body>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" sortable>
            <template slot-scope="scope">{{ scope.row.updateTime| dateYMDHMSFormat }}</template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="170">
            <template #default="scope">
              <el-button size="small" type="primary" @click="handleEdit(scope.row)" plain>编辑</el-button>
              <el-button size="small" type="danger" @click="openDeleteMsg(scope.row.id)" plain>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin: 10px 0;">
          <!-- 分页 -->
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

          <!-- 基本信息弹窗，dialogVisible需要在data中定义默认false关闭。 -->
          <el-dialog :visible.sync="dialogVisible" title="用户操作" width="30%">
            <!-- form也需要在下方定义，定义为一个对象form:{} -->
            <el-form :model="form" label-width="120px">
              <!-- 表单绑定和数据库一一对应 -->
              <el-form-item label="用户名">
                <el-input v-model="form.username" style="width: 80%;"></el-input>
              </el-form-item>
              <el-form-item label="角色权限">
                <el-select clearable v-model="form.role" placeholder="请选择角色权限" style="width: 80%">
                  <el-option v-for="item in roles" :key="item.name" :label="item.name" :value="item.flag"/>
                </el-select>
              </el-form-item>
              <el-form-item label="昵称">
                <el-input v-model="form.nickName" style="width: 80%;"></el-input>
              </el-form-item>
              <el-form-item label="年龄">
                <el-input v-model="form.age" style="width: 80%;"></el-input>
              </el-form-item>
              <el-form-item label="性别">
                <el-radio v-model="form.sex" label="男">男</el-radio>
                <el-radio v-model="form.sex" label="女">女</el-radio>
              </el-form-item>
              <el-form-item label="电子邮箱">
                <el-input v-model="form.email" style="width: 80%;"></el-input>
              </el-form-item>
              <el-form-item label="联系电话">
                <el-input v-model="form.cellphone" style="width: 80%;"></el-input>
              </el-form-item>
              <!-- 图片上传 -->
              <el-form-item label="头像">
                <el-upload ref="upload" :action="avatarUploadUrl" :on-success="fileUploadSuccess">
                  <el-button type="primary">点击上传</el-button>
                </el-upload>
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
      <!-- 左右边距 -->
      <el-col :span="1"></el-col>
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
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      dialogVisible: false,
      DetailDialogVisible: false,
      ids: [],
      form: {},
      internVisible: false,
      internForm: {},
      formLabelWidth: '120px',
      avatarUploadUrl: 'http://' + _global._filesUrl + '/files/upload',
      excelUploadUrl: 'http://' + _global._filesUrl + '/user/import',
      roles: [],
    }
  },
  name: 'Home',
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
      const userStr = sessionStorage.getItem('user') || '{}'
      this.user = JSON.parse(userStr)
      request.get('/user', {
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
      // 309添加获取role表信息
      request.get('/role').then(res => {
        console.log(res)
        this.roles = res.data.records
      })
    },
    add () {
      this.dialogVisible = true
      // 每次打开清空表单域
      this.form = {}
    },
    save () {
      if (this.form.id) {
        request.put('/user', this.form).then(res => {
          console.log(res)
          if (res.code === '0') {
            this.$message({
              type: 'success',
              message: '更新完成'
            })
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
          // 更新完成后应该刷新数据并且关闭弹窗。
          this.load()
          this.dialogVisible = false
        })
      } else {
        // api通信，使用axios  ps : .then()是ES6语法
        request.post('/user', this.form).then(res => {
          console.log(res)
          if (res.code === '0') {
            this.$message({
              type: 'success',
              message: '新增成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
          // 更新完成后应该刷新数据并且关闭弹窗。
          this.load()
          this.dialogVisible = false
        })
      }

    },

    handleEdit (row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    // saveUserDetail () {
    //   if (this.internForm.internId) {
    //     request.post('/intern', this.internForm).then(res => {
    //       console.log(res)
    //       if (res === true) {
    //         this.$message({
    //           type: 'success',
    //           message: '更新详细资料完成'
    //         })
    //       } else {
    //         this.$message({
    //           type: 'error',
    //           message: res.msg
    //         })
    //       }
    //       // 更新完成后应该刷新数据并且关闭弹窗。
    //       this.load()
    //       this.DetailDialogVisible = false
    //     })
    //   } else {
    //     this.$message.error('不存在用户详细信息或出错')
    //     this.load()
    //     this.DetailDialogVisible = false
    //   }
    // },
    openDeleteMsg (id) {
      // 传入此列成员的id
      this.$confirm('将删除id为' + id + '的用户, 继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.delete('/user/' + id).then(res => {
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDelete (id) {
      request.delete('/user/' + id).then(res => {
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
      request.post('/user/deleteBatch', this.ids).then(res => {
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
        request.post('/user/deleteBatch', this.ids).then(res => {
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
      window.open('http://' + _global._filesUrl + '/user/export')
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
