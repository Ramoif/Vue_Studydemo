<template>
  <el-row class="home" :gutter="20">
    <!--左侧分区-->
    <el-col :span="8" style="margin-top: 20px">
      <!--用户小卡片-->
      <el-card shadow="hover">
        <div class="user">
          <el-avatar v-if="currentUser.avatarUrl" :size="150" :src="currentUser.avatarUrl"/>
          <el-avatar v-if="!currentUser.avatarUrl" :size="150" :src="userImg"/>
          <div class="userinfo">
            <p class="name">{{ currentUser.username }}</p>
            <span class="access" v-if="currentUser.role==='ROLE_ADMIN'">管理员</span>
            <span class="access" v-if="currentUser.role==='ROLE_USER'">普通用户</span>
            <span class="access" v-if="currentUser.role==='ROLE_TEST'">超级管理员</span>
          </div>
        </div>
        <div class="login-info">
          <p>账户创建时间：<span>{{ currentUser.createTime| dateYMDHMSFormat }}</span></p>
          <p>欢迎来到实习实训平台！</p>
        </div>
      </el-card>

    </el-col>
    <!--右侧分区-->
    <el-col :span="16" style="margin-top: 20px">
      <div class="num">
        <el-card shadow="hover"
                 v-for="item in countData"
                 :key="item.name"
                 :body-style="{display:'flex',padding:0}"
        >
          <i class="icon"
             :class="`el-icon-${item.icon}`"
             :style="{background:item.color}">
          </i>
          <div class="detail">
            <p class="num">{{ item.value }}</p>
            <p class="txt">{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <el-card shadow="hover">
        <div style="line-height: 30px;font-size: 16px;">
          <p style="text-align: center;" class="fontH18">实习须知</p>
          <p>
            一、在外实习期间本人学业由自己负责，保证按时参加考试，完成学校的各项要求；<br>
            二、在外实习期间本人的人身财产安全由自己负责；<br>
            三、在外实习期间本人的交通安全由自己负责；<br>
            四、在外实习期间遵守学校的各项规章制度，与指导教师始终保持联系；<br>
            五、学生在自主实习期间要主动联系就业单位。
          </p>
          <p style="text-align: center;" class="fontH18">实习小贴士</p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;以实习单位为课堂，在具有丰富实践经验的管理人员指导下，认真完成专业实习。在实习过程中，学生应努力做到：<br>
            1、自觉遵守国家法律法规和学校的实习纪律，严格按照规定时间进行实习，不得提前结束实习，也不得未经批准随意延长实习时间。<br>
            2、遵守实习单位的劳动纪律和各项规章制度，树立良好的职业道德和组织纪律观念，与实习指导师傅和实习单位搞好关系。<br>
            3、对在实习中悉知的商业秘密要严格保密。借阅实习单位提供的各类文件、数据等资料，必须严格按照有关规定妥善保管，用毕完整归还。<br>
            4、虚心学习，勤奋探索，认真求教；树立良好的精神风貌，维护学校的声誉，遵守各项职业道德规范，提高职业素养，不得向实习单位提出不恰当的待遇要求。<br>
            5、善于总结并吸取实践工作经验，尊重实习单位员工。认真做好实习笔记，撰写实习报告。<br>
            6、实习期间，注意应经常与学校指导老师保持联系，及时汇报实习情况，听取老师对实习过程的指导与建议。
          </p>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import request from '@/utils/request'

export default {
  components: {},
  data () {
    return {
      currentUser: {},
      userImg: require('../../assets/images/user.png'),
      tableData: [],
      countData: [
        {
          name: '已提交申请表用户数',
          value: 1,
          icon: 'circle-plus-outline',
          color: '#2ec7c9',
        },
        {
          name: '平台已注册用户数',
          value: 0,
          icon: 'sunny',
          color: '#ffb980',
        },
        {
          name: '实习已鉴定用户数',
          value: 5,
          icon: 'check',
          color: '#5ab1ef',
        },
      ],
    }
  },
  created () {
    this.load()
  },
  methods: {
    load () {
      const userStr = sessionStorage.getItem('user') || '{}'
      this.currentUser = JSON.parse(userStr)
      request.get('/contract/counts').then(res => {
        this.countData[0].value = res.data
      })
      request.get('/user/counts').then(res => {
        this.countData[1].value = res.data
      })
      request.get('/contract-detail/counts').then(res => {
        this.countData[2].value = res.data
      })
    }
  },
  mounted () {

  },
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/home";
</style>
