<template>
  <div>
    <el-breadcrumb style="height:50px" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item class="u1" :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item class="u1">数据统计</el-breadcrumb-item>
            <el-breadcrumb-item class="u1">数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
        <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
  <div id="main" style="width: 800px;height:600px;"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
    name:'Reports',
    data(){
        return{
            /* 需要合并的数据 */
            options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
        }
    },
    /* 此时页面上的元素已经被渲染完毕了 */
    async mounted(){
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'))
        /* 获取数据 */
        const{data:res} = await this.$http.get('reports/type/1')
        if(res.meta.status!==200){
            return this.$message.error('获取统计数据失败')
        }

        // 指定图表的配置项和数据
      const result = _.merge(res.data,this.options)
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(result)
    },
    methods:{

    }

}
</script >

<style lang="less" scoped>
.u1{
    font-style: italic;
    color: aqua;
    font-size: 30px;
}
.box-card{
    padding:-10px;
    border-bottom:2px solid rgb(212, 92, 112);
    border-radius: 20px;
    opacity: 0.7;
}
</style>>
