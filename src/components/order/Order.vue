<template>
  <div>
    <el-breadcrumb style="height:50px" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item class="u1" :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item class="u1">订单管理</el-breadcrumb-item>
            <el-breadcrumb-item class="u1">订单列表</el-breadcrumb-item>
        </el-breadcrumb>
         <!--卡片视图区域 -->
         <el-card class="box-card">
            <!--搜索与添加区域 -->
            <el-row :gutter="70">
                <el-col :span="10">
                    <el-input clearable @clear="getOrderList" type="text" placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select">
                        <el-button @click="getOrderList" slot="append" icon="el-icon-search"></el-button>
                        </el-input>           
                </el-col>
                <el-col :span="4">
                    <el-button  class="b2" type="primary" round>添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 订单列表 -->
            <el-table :data="orderlist" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column  label="订单编号" prop="order_number"></el-table-column>
                <el-table-column  label="订单价格" prop="order_price"></el-table-column>
                <el-table-column  label="是否发货" prop="is_send"></el-table-column>
                <el-table-column  label="是否付款" prop="order_pay">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.order_pay ==1" type="primary">已付款</el-tag>
                        <el-tag v-else type="danger">未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column  label="下单时间" prop="create_time">
                    <template slot-scope="scope">
                        {{ scope.row.create_time | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-button type="primary" style="border-radius:10px"  size="mini" @click="showBox(scope.row.order_id)" icon="el-icon-edit"></el-button>
                        <el-button type="warning" style="border-radius:10px" size="mini" @click="showProgressBox" icon="el-icon-location"></el-button>     
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination
               @size-change="handleSizeChange"
               @current-change="handleCurrentChange"
               :current-page="queryInfo.pagenum"
               :page-sizes="[ 3,5, 7, 10]"
               :page-size="queryInfo.pagesize"
               layout="total, sizes, prev, pager, next, jumper"
               :total="total">
            </el-pagination>
            <!-- 修改订单地址对话框 -->
            <el-dialog 
            title="修改订单"
            :visible.sync="edialogVisible"
            width="35%" 
            :append-to-body="true"
            @close="eddDialogClose">
            <!--内容区 -->
        <el-form :model="olderFrom" :rules="olderFromRules"  ref="olderFromRef" label-width="80px">
            <el-form-item label="订单价格" prop="order_price">
                <el-input v-model="olderFrom.order_price"></el-input>
            </el-form-item>
            <el-form-item label="是否发货" prop="is_send">
                <el-input v-model="olderFrom.is_send"></el-input>
            </el-form-item>
            <el-form-item label="是否付款" prop="order_pay">
                <el-switch
                     v-model="olderFrom.order_pay"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     :active-value="1"
                     :inactive-value="0">
                   </el-switch>                   
            </el-form-item>
        </el-form> 
        <!-- 底部区 -->
           <span slot="footer" class="dialog-footer">
             <el-button @click="edialogVisible = false">取 消</el-button>
             <el-button type="primary" @click="eddUserInfo()">确 定</el-button>
           </span>
        </el-dialog> 
        <!-- 修改订单地址对话框 -->
        <el-dialog 
            title="物流信息"
            :visible.sync="adialogVisible"
            width="30%" 
            :append-to-body="true">
             <!-- 时间线 -->
      <el-timeline>
          <!-- 遍历进度信息，时间线内信息 -->
        <el-timeline-item v-for="(activity, index) in progressInfo" 
        :key="index" :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline> 
        <!-- 底部区 -->
           <span slot="footer" class="dialog-footer">
             <el-button @click="adialogVisible = false">取 消</el-button>
           </span>
        </el-dialog>         
    </el-card>
  </div>
</template>
<script>
import cityDate from './citydata.js'
export default {
    name:'Order',
    data(){
        return{
            /* 请求订单列表 */
            queryInfo:{
                query:'',
                pagenum:'1',
                pagesize:'5'
            },
            /* 订单列表 */
            orderlist:[],
            total:0,
            /* 修改订单对话框 */
            edialogVisible:false,
            /* 查看物流对话框 */
            adialogVisible:false,
            /* 修改订单对象 */
            olderFrom:{
                order_price:'',
                is_send:'',
                order_pay:''
            },
            /* 订单修改验证规则 */
            olderFromRules:{
                order_price:[{required: true, message:'请输入订单价格',trigger:'blur'}],
                is_send:[{required: true, message:'请输入是否发货',trigger:'blur'}]
            },
            /* 地址 */
            cityDate,
            /* 物流信息列表 */
            progressInfo:[],
        }
    },
    created(){
        this.getOrderList()
    },
    methods:{
        /* 获取订单列表 */
        async getOrderList(){
            const{data:res} = await this.$http.get('orders',{params:this.queryInfo})
            if(res.meta.status!==200){
                return this.$message.error('获取订单失败')
            }
            this.orderlist = res.data.goods
            this.total = res.data.total
            console.log(this.orderlist)
        },
    /* 监听 pagesize 改变的事件  */
    handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize;
        this.getOrderList()
    },
    /* 监听页面值改变的事件 */
    handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage;
        this.getOrderList()
    },
    /* 清空修改框 */
    eddDialogClose(){
        this.$refs.olderFromRef.resetFields()
    },
    /* 展示修改地址的对话框 */
    async showBox(id){
        const{data:res} = await this.$http.get(`orders/${id}`)
        if(res.meta.status!==200){
        return this.$message.error('获取订单详情失败')
     }
     this.olderFrom = res.data
     this.edialogVisible = true
     console.log(this.olderFrom)
    },
    /* 修改订单 */
    eddUserInfo(){
        this.$refs.olderFromRef.validate(async valid=>{
            if(!valid) return
            const{data:res} = await this.$http.put(`orders/${this.olderFrom.order_id}`,
            {order_price:this.olderFrom.order_price,is_send:this.olderFrom.is_send,
            order_pay:this.olderFrom.order_pay})
            if(res.meta.status!==201){
                return this.$message.error('修改订单失败')
            }
            this.edialogVisible =false
            this.getOrderList()
        })
    },
    /* 显示物流进度 */
    async showProgressBox(){
          // 接口数据失效，把data写死
       /*  const{data:res} = await this.$http.get('/kuaidi/1106975712662')
        if(res.meta.status!==200){
            return this.$message.error('物流信息请求失败')
        }
        this.progressInfo = res.data */
        this.progressInfo = [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: '',
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context: '【北京市】北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: '',
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 【北京海淀育新小区营业点】',
          location: '',
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context: '快件在【北京顺义集散中心】已装车,准备发往 【北京海淀育新小区营业点】',
          location: '',
        },
        {
      "time": "2018-05-10 07:32:00",
      "ftime": "2018-05-10 07:32:00",
      "context": "快件到达 [北京海淀育新小区营业点]",
      "location": ""
    },
    {
      "time": "2018-05-10 02:03:00",
      "ftime": "2018-05-10 02:03:00",
      "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
      "location": ""
    },
    {
      "time": "2018-05-09 23:05:00",
      "ftime": "2018-05-09 23:05:00",
      "context": "快件到达 [北京顺义集散中心]",
      "location": ""
    },
    {
      "time": "2018-05-09 21:21:00",
      "ftime": "2018-05-09 21:21:00",
      "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
      "location": ""
    },
    {
      "time": "2018-05-09 13:07:00",
      "ftime": "2018-05-09 13:07:00",
      "context": "顺丰速运 已收取快件",
      "location": ""
    },
    {
      "time": "2018-05-09 12:25:03",
      "ftime": "2018-05-09 12:25:03",
      "context": "卖家发货",
      "location": ""
    },
    {
      "time": "2018-05-09 12:22:24",
      "ftime": "2018-05-09 12:22:24",
      "context": "您的订单将由HLA(北京海淀区清河中街店)门店安排发货。",
      "location": ""
    },
    {
      "time": "2018-05-08 21:36:04",
      "ftime": "2018-05-08 21:36:04",
      "context": "商品已经下单",
      "location": ""
    }]
        this.adialogVisible = true
    }

}

}
</script>

<style lang="less" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';
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
.b2{
    background-color: rgb(212, 92, 112);
    font-size: 20px;
    color: white;
}
/deep/.el-input__inner{
    background-color: rgb(115, 234, 108);
    font-size: 20px;
    color: red;
    opacity: 0.3;
}
.el-table{
    margin-top: 20px;
}
.el-pagination{
    margin-top: 20px;
}
/deep/ .el-dialog__wrapper{
    width: 1500px;
    opacity: 0.5;
}
/deep/ .el-dialog{
    border-radius: 50px;
}
/deep/ .el-dialog__header{
    padding: 1vh 1vw 0 1vw;
    background-image: url('../../assets/E624A820181D9856AA0ED0F782385C1B.jpg');
    background-size: cover;
    border-radius: 50px;
    opacity: 0.5;
}
/deep/ .el-dialog__title {
    margin-left: 130px;
    line-height: 80px;
    font-size: 50px;
    color: #596bcc;
    font-style: italic;
    opacity: 0.8;
    }
/deep/ .el-dialog__body{
    line-height: 20px;
    font-style: italic;
    opacity: 0.5;
    background-image: url('../../assets/E624A820181D9856AA0ED0F782385C1B.jpg');
    background-size:cover;
}
/deep/ .el-form-item__label{
    height: 50px;
    font-size: 18px;
    color: aqua;
    text-align: left;

}
/deep/.el-input__inner:hover{
    background-color: yellow;
}
/deep/ .el-dialog__footer{
    background-image: url('../../assets/E624A820181D9856AA0ED0F782385C1B.jpg');
    background-size:cover;
    border-radius: 50px;
    opacity: 0.5;
}
/deep/ .el-button.el-button--default{
    border-radius: 30px;
    background-color: rgb(96, 105, 105);
    color: rgb(212, 92, 112);
    
}
/deep/ .el-button.el-button--primary{
    border-radius: 30px;
    background-color: rgb(53, 219, 219);
    color: rgb(146, 197, 108);

}
/deep/.el-timeline-item{
    size: 30px;
    font-size: 20px;
    font-style: initial;
    color: pink;
}
</style>>