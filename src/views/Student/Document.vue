<template>
  <el-row :gutter="20">
    <el-col :span="24" :offset="0">
      <div class="contract_container">
        <div class="contract_box">
          <!-- 协议表单 -->
          <el-card style="width: 100%; margin-top: 0px;">
            <h3 class="fontH24">附件资料上传</h3>
            <p style="margin-top: 20px; font-size: 14px; color: #898d83;">
              仅<span class="redSpan">申请书通过</span>才可以进行附件资料上传。
              你需要仔细确认文件是否符合要求， 尽量上传符合要求的文件来通过审核。
            </p>
            <p class="dividedLine"/>
            <!-- 条件查询 -->
            <div style="width: 100%; display: flex; margin-bottom: 10px;">
              <p style="font-weight: bold; line-height: 40px;">协议状态&nbsp;:&nbsp;</p>
              <el-select v-model="searchForm.internState" placeholder="选择协议状态">
                <el-option label="已提交" value="1"></el-option>
                <el-option label="未通过" value="2"></el-option>
                <el-option label="已审核" value="3"></el-option>
              </el-select>
              <el-button type="warning" style="margin: 0 5px" @click="toDownload" plain>去教务网下载附件</el-button>
            </div>
            <div class="contractForm">
              <el-table :data="unsigns" border style="width: 100%">
                <el-table-column label="序号" width="70px">
                  <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column prop="partB" label="实习生姓名"/>
                <el-table-column prop="partA" label="实习单位名称"/>
                <el-table-column prop="address" label="实习单位地址"/>
                <el-table-column prop="startTime" label="开始日期"/>
                <el-table-column prop="endTime" label="结束日期"/>
                <el-table-column label="协议目前状态" width="160">
                  <template #default="scope">
                    <span v-if="scope.row.currentState === 3">待上传附件</span>
                    <span v-if="scope.row.currentState === 4">附件已上传，待审核</span>
                    <span v-if="scope.row.currentState === 5">被退回，请重新上传</span>
                    <span v-if="scope.row.currentState === 6">审核通过</span>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="160">
                  <template #default="scope">
                    <el-button size="small" type="primary" plain
                               v-if="[3,5].includes(scope.row.currentState)"
                               @click="toUploadDocument(scope.row.id)">上传附件资料
                    </el-button>
                    <el-button size="small" type="primary" plain
                               v-if="[4,6].includes(scope.row.currentState)"
                               @click="toUploadDocument(scope.row.id)">查看附件资料
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </div>
      </div>

    </el-col>
  </el-row>

</template>

<script>

import request from '@/utils/request'
import router from '@/router'
import _global from '@/config/index'

export default {
  name: 'Document',
  data () {
    return {
      // 当前用户
      currentUser: {},
      // contract表数据
      tableData: [],
      searchForm: {
        internState: '',
      },

    }
  },
  computed: {
    unsigns () {
      return this.tableData.filter(item => [3, 4, 5, 6].includes(item.currentState))
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
    toDownload () {
      window.open('https://kjxy.ctgu.edu.cn/info/1180/15683.htm')
    },
    toUploadDocument (id) {
      if (id) {
        router.push('/documentUpload/' + id)
      } else {
        this.$message.error('error')
      }
    },

  }
}
</script>

<style scoped>
.redSpan {
  color: orangered;
}

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
