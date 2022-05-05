<template>
  <div class="home" style="padding: 0px; width: 100%">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="fontH24">权限管理</div>
            <p class="dividedLine"/>
            <div style="margin-bottom: 10px;width: 100%;display: flex;">
              <el-input v-model="search"
                        placeholder="输入名称"
                        style="width: 20%"
                        clearable></el-input>
              <el-button type="success" style="margin-left: 5px;" @click="load" plain>查询</el-button>
              <div style="padding-left: 10px;">
                <el-button type="primary" @click="add" plain><i class="el-icon-plus"/>新增</el-button>
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
          <el-table-column prop="name" label="名称"/>
          <el-table-column prop="description" label="描述"/>
          <el-table-column prop="flag" label="唯一标识"/>
          <el-table-column fixed="right" label="操作" width="220">
            <template #default="scope">
              <el-button size="small" type="danger" @click="selectPermission(scope.row.id)" plain>路由分配</el-button>
              <el-button size="small" type="primary" @click="handleEdit(scope.row)" plain>编辑</el-button>
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

          <!-- 弹窗-role -->
          <el-dialog :visible.sync="dialogVisible" title="用户操作" width="30%">
            <el-form :model="form" label-width="120px">
              <el-form-item label="ID">
                <el-input v-model="form.id" style="width: 80%;"></el-input>
              </el-form-item>
              <el-form-item label="名称">
                <el-input v-model="form.name" style="width: 80%;"></el-input>
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="form.description" style="width: 80%;"></el-input>
              </el-form-item>
              <el-form-item label="唯一标识">
                <el-input v-model="form.flag" style="width: 80%;"></el-input>
              </el-form-item>
            </el-form>
            <template #footer>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="save">确定</el-button>
              </span>
            </template>
          </el-dialog>

          <!-- 弹窗-permission -->
          <el-dialog :visible.sync="permissionDialogVisible" title="用户操作" width="30%">
            <!-- 分配菜单 -->
            <el-tree :props="permissionProps"
                     :data="permissionData"
                     :default-expanded-keys="expends"
                     :default-checked-keys="checks"
                     show-checkbox
                     ref="tree"
                     node-key="id">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span><i :class="data.icon"/> {{ data.name }}</span>
              </span>
            </el-tree>
            <template #footer>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="permissionDialogVisible = false">取消</el-button>
                  <el-button type="primary" @click="saveRolePermission">确定</el-button>
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
      currentPage: 1,
      pageSize: 10,
      total: 0,
      // role
      tableData: [],
      // permission
      permissionData: [],
      dialogVisible: false,
      DetailDialogVisible: false,
      permissionDialogVisible: false,
      permissionProps: {
        label: 'name'
      },
      expends: [],
      checks: [],
      // 权限路由
      thisRoleId: 0,
      ids: [],
      form: {},
      internVisible: false,
      internForm: {},
      formLabelWidth: '120px',
      avatarUploadUrl: 'http://' + _global._filesUrl + '/files/upload',
      excelUploadUrl: 'http://' + _global._filesUrl + '/user/import',
    }
  },
  name: 'Role',
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
      request.get('/role', {
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          search: this.search
        }
      }).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      })

    },
    add () {
      this.dialogVisible = true
      // 每次打开清空表单域
      this.form = {}
    },
    save () {
      if (this.form.id) {
        request.post('/role', this.form).then(res => {
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
        request.post('/role', this.form).then(res => {
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
    saveRolePermission () {
      request.post('/role/rolePermission/' + this.thisRoleId,
        this.$refs.tree.getCheckedKeys()).then(res => {
        if (res.code === '0') {
          this.$message({
            type: 'success',
            message: '绑定路由完成'
          })
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
        this.permissionDialogVisible = false
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
    handleEdit (row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    // 多选操作
    handleSelectionChange (val) {
      // 作用是让ids中存放所有选中的对象的id : [{id,name},{id,name}] => [id,id]
      this.ids = val.map(v => v.id)
    },
    selectPermission (roleId) {
      this.thisRoleId = roleId
      this.checks = []
      // 传入树形结构 - 默认展开的参数
      request.get('/permission/all', {
        params: {
          search: ''
        }
      }).then(res => {
        this.permissionData = res.data
        this.expends = this.permissionData.map(v => v.id)
      })
      // 传入树形结构 - 选中的参数
      request.get('/role/rolePermission/' + roleId).then(res => {
        this.checks = res.data
      })
      this.permissionDialogVisible = true
    },

  }
}
</script>

<style scoped>

</style>
