import Mock from 'mockjs'

let List = []
export default {
  getStatisticalData: () => {
    for (let i = 0; i < 7; i++) {
      List.push(
        Mock.mock({
          oppo: Mock.Random.float(100, 8000, 0, 0),
          xiaomi: Mock.Random.float(100, 8000, 0, 0),
          huawei: Mock.Random.float(100, 8000, 0, 0),
          vivo: Mock.Random.float(100, 8000, 0, 0),
          ZTE: Mock.Random.float(100, 8000, 0, 0)
        })
      )
    }
    return {
      code: 20000,
      data: {
        // 饼图
        videoData: [
          {
            name: 'oppo',
            value: 2999
          },
          {
            name: 'xiaomi',
            value: 5999
          },
          {
            name: 'huawei',
            value: 1500
          },
          {
            name: 'vivo',
            value: 2000
          },
          {
            name: 'ZTE',
            value: 4000
          }
        ],
        // 饼图
        userData: [
          {
            date: '周一',
            new: 5,
            active: 200
          },
          {
            date: '周二',
            new: 11,
            active: 400
          },
          {
            date: '周三',
            new: 22,
            active: 330
          },
          {
            date: '周四',
            new: 69,
            active: 550
          },
          {
            date: '周五',
            new: 53,
            active: 200
          },
          {
            date: '周六',
            new: 65,
            active: 770
          },
          {
            date: '周日',
            new: 33,
            active: 170
          }
        ],
        // 折线图
        orderData: {
          date: ['20211001', '20211002', '20211003', '20211004', '20211005', '20211006', '20211007'],
          data: List
        },
        tableData: [
          {
            name: 'oppo',
            todayBuy: 100,
            monthBuy: 3500,
            totalBuy: 22000
          },
          {
            name: 'xiaomi',
            todayBuy: 300,
            monthBuy: 2200,
            totalBuy: 24000
          },
          {
            name: 'huawei',
            todayBuy: 800,
            monthBuy: 4500,
            totalBuy: 65000
          },
          {
            name: 'vivo',
            todayBuy: 300,
            monthBuy: 2200,
            totalBuy: 65000
          },
          {
            name: 'ZTE',
            todayBuy: 300,
            monthBuy: 1200,
            totalBuy: 15000
          }
        ],
      }
    }
  }
}
