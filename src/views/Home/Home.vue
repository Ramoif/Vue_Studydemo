<template>
  <el-row class="home" :gutter="20">
    <!--左侧8分区-->
    <el-col :span="8" style="margin-top: 20px">
      <!--用户小卡片-->
      <el-card shadow="hover">
        <div class="user">
          <img :src="userImg"/>
          <div class="userinfo">
            <p class="name">Admin</p>
            <p class="access">超级管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p>上次登陆时间：<span>2021-1-5</span></p>
          <p>上次登陆地点：<span>湖北宜昌</span></p>
        </div>
      </el-card>
      <!--表格-->
      <el-card shadow="hover" style="height: 460px;margin-top: 20px">
        <el-table :data="tableData">
          <el-table-column
            show-overflow-tooltip
            v-for="(val,key) in tableLabel"
            :key="key"
            :prop="key"
            :label="val"
          ></el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <!--右侧16分区-->
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
      <!--折线图-->
      <el-card shadow="hover" style="height: 280px">
        <!--<div style="height: 280px" ref="echart"></div>-->
        <echart :chartData="echartData.order"
                style="height: 280px"></echart>
      </el-card>
      <div class="graph">
        <!--柱状图-->
        <el-card shadow="hover" style="height: 260px">
          <!--<div style="height: 240px" ref="userEchart"></div>-->
          <echart :chartData="echartData.user"
                  style="height: 240px"></echart>
        </el-card>
        <!--饼图-->
        <el-card shadow="hover" style="height: 260px">
          <!--<div style="height: 240px" ref="videoEchart"></div>-->
          <echart :chartData="echartData.video"
                  style="height: 240px"
                  :isAxisChart="false"></echart>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { getHome } from '../../api/data'
import Echart from '@/components/Echarts.vue'

export default {
  components: {
    Echart
  },
  data () {
    return {
      userImg: require('../../assets/images/user.png'),
      tableData: [],
      countData: [
        {
          name: '今日用户数',
          value: 264,
          icon: 'circle-plus-outline',
          color: '#2ec7c9',
        },
        {
          name: '今日活跃数',
          value: 160,
          icon: 'sunny',
          color: '#ffb980',
        },
        {
          name: '今日完成数',
          value: 0,
          icon: 'check',
          color: '#5ab1ef',
        },
        {
          name: '总用户数',
          value: 2022,
          icon: 's-custom',
          color: '#2ec7c9',
        },
        {
          name: '总平台数',
          value: 25,
          icon: 'umbrella',
          color: '#ffb980',
        },
        {
          name: '总完成数',
          value: 100,
          icon: 'coordinate',
          color: '#5ab1ef',
        },
      ],
      tableLabel: {
        name: '名称',
        todayBuy: '今日购买',
        monthBuy: '本月购买',
        totalBuy: '总购买',
      },
      // 封装的Echart数据
      echartData: {
        order: {
          xData: [],
          series: [],
        },
        user: {
          xData: [],
          series: [],
        },
        video: {
          series: [],
        },
      }
    }
  },
  methods: {
    getTableData () {
      getHome().then((res) => {
        // console.log(res)
        this.tableData = res.data.tableData

        // 折线图展示
        const order = res.data.orderData
        // this.echartsData.order.xAxis.data = order.date
        let keyArray = Object.keys(order.data[0])
        // keyArray.forEach((key) => {
        //   this.echartsData.order.series.push({
        //     name: key,
        //     data: order.data.map((item) => item[key]),
        //     type: 'line'
        //   })
        // })
        // const myEchartsOrder = echarts.init(this.$refs.echart)
        // myEchartsOrder.setOption(this.echartsData.order)

        // 封装-传给组件的值，记得注释掉上面的两行。
        this.echartData.order.xData = order.date
        keyArray.forEach((key) => {
          this.echartData.order.series.push({
            name: key,
            data: order.data.map((item) => item[key]),
            type: 'line'
          })
        })

        // 用户图-柱状图
        // this.echartsData.user.xAxis.data = res.data.userData.map((item) => item.date)
        // this.echartsData.user.series.push({
        //   name: '新增用户',
        //   data: res.data.userData.map((item) => item.new),
        //   type: 'bar',
        // })
        // this.echartsData.user.series.push({
        //   name: '活跃用户',
        //   data: res.data.userData.map((item) => item.active),
        //   type: 'bar',
        // })
        // const myEchartsUser = echarts.init(this.$refs.userEchart)
        // myEchartsUser.setOption(this.echartsData.user)

        // 用户图封装-柱状图
        this.echartData.user.xData = res.data.userData.map((item) => item.date)
        this.echartData.user.series.push({
          name: '新增用户',
          data: res.data.userData.map((item) => item.new),
          type: 'bar',
        })
        this.echartData.user.series.push({
          name: '活跃用户',
          data: res.data.userData.map((item) => item.active),
          type: 'bar',
        })
        // 饼图
        // this.echartsData.video.series.push({
        //   data: res.data.videoData,
        //   type: 'pie'
        // })
        // const myEchartsVideo = echarts.init(this.$refs.videoEchart)
        // myEchartsVideo.setOption(this.echartsData.video)

        // 封装-pie图
        this.echartData.video.series.push({
          data: res.data.videoData,
          type: 'pie'
        })
      })
    },
  },
  mounted () {
    this.getTableData()
  },
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/home";
</style>
