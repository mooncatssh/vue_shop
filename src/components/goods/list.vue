<template>
  <div>
    <el-breadcrumb style="height:50px" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item class="u1" :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item class="u1">商品管理</el-breadcrumb-item>
            <el-breadcrumb-item class="u1">商品列表</el-breadcrumb-item>
    </el-breadcrumb>
     <!-- 卡片视图 -->
     <el-card class="box-card">
        <!-- 添加商品区域 -->
        <el-row :gutter="20">
                <el-col :span="8">
                    <el-input type="text" class="input-with-select" placeholder="请输入内容" clearable @clear="getGoodsList()" v-model="queryInfo.query">
                        <el-button slot="append" @click="getGoodsList()" icon="el-icon-search" round></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button class="b2" type="primary" @click="drawer=true">添加商品</el-button>
                </el-col>
        </el-row>
        <!--商品列表 -->
        <el-table :data="goodslist">
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="商品名称" prop="goods_name"></el-table-column>
            <el-table-column label="商品价格(元)" prop="goods_price"></el-table-column>
            <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
            <el-table-column label="创建时间" prop="add_time">
                <template slot-scope="scope">
                    {{ scope.row.add_time | dateFormat }}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary"  icon="el-icon-edit"></el-button>
                    <el-button type="danger" style="border-radius:10px" @click="removeGoods(scope.row.goods_id)" size="mini" icon="el-icon-delete" ></el-button>
                </template>
            </el-table-column>
        </el-table>
         <!-- 分页区域 -->
         <el-pagination
               @size-change="handleSizeChange"
               @current-change="handleCurrentChange"
               :current-page="queryInfo.pagenum"
               :page-sizes="[5, 10, 15, 20]"
               :page-size="queryInfo.pagesize"
               layout="total, sizes, prev, pager, next, jumper"
               :total="total">
            </el-pagination>
        <!-- 添加商品对话框 -->
        <el-drawer
            title="我是标题"
            :visible.sync="drawer"
            :direction="direction"
            :before-close="handleClose">
            <span>我来啦!</span>         
            <!-- 内容主题区 -->
        <el-form :model="addGoods" :rules="addGoodsRules" ref="addGoodsRef" label-width="80px">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addGoods.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="以为','分割的分类列表" prop="goods_cat">
                <el-input v-model="addGoods.goods_cat"></el-input>
              </el-form-item>
              <el-form-item label="价格" prop="goods_price">
                <el-input v-model="addGoods.goods_price"></el-input>
              </el-form-item>
              <el-form-item label="数量" prop="goods_number">
                <el-input v-model="addGoods.goods_number"></el-input>
              </el-form-item>
              <el-form-item label="重量" prop="goods_weight">
                <el-input v-model="addGoods.goods_weight"></el-input>
              </el-form-item>
        </el-form>            
            <!--底部区 -->
            <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addgoods">确 定</el-button>
            </span>
        </el-drawer>    
</el-card>
  </div>
</template>

<script>
export default {
    name:'list',
    data(){
        return{
            /* 查询参数对象 */
            queryInfo:{
                query:'',
                pagenum: 1,
                pagesize: 10
            },
            /* 商品列表 */
            goodslist: [],
            /* 总页数 */
            total: 0,
            /* 添加商品对话框 */
            drawer:false,
            /* 添加商品获取列表 */
            addGoods:{
                goods_name:'',
                goods_cat:'',
                goods_price:'',
                goods_number:'',
                goods_weight:''
            }

        }
    },
    created(){
        this.getGoodsList()

    },
    methods:{
        /* 根据分页获取相应的商品列表 */
        async getGoodsList(){
            const{data:res} = await this.$http.get('goods',{params: this.queryInfo})
            if(res.meta.status!==200){
                this.$message.error('获取商品列表失败')
            }
            this.goodslist = res.data.goods
            this.total = res.data.total
        },
        /* 监听 pagesize 改变事件 */
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        /* 监听pagenum改变事件 */
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        /* 提交添加商品 */
        async addgoods(){
            const{data:res} = await this.$http.post('goods',this.addGoods)
            if(res.meta.status!==201){
                return this.$message.error('添加商品失败')
            }
            this.addDialogVisible = false
            this.getGoodsList()
        },
        /* 删除商品 */
        async removeGoods(id){
          const confirmResult = await this.$confirm('欧尼酱,消灭该敌人, 嗯?', '询问QAQ', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
        ).catch(err => err)
        //如果用户确认删除，则返回值为字符串 confirm
        //如果用户取消删除，则返回值为字符串 cancel
        if(confirmResult !=='confirm'){
            return this.$message.info('已取消删除')
        }
        const{data:res} = await this.$http.delete(`goods/${id}`)
        if(res.meta.status!==200){
            return this.$message.error('删除商品失败')
        }
        this.getGoodsList()
    }
}

}
</script>

<style lang="less" scoped>
.u1{
    font-style: italic;
    color: aqua;
    font-size: 30px;
}
.box-card{
    padding:-10px;
    border-bottom:2px solid pink;
    border-radius: 20px;
    opacity: 0.7;
}
.el-table{
    margin-top: 20px;
}
.input-with-select{
    width: 500px;
    height: 40px;
    border-radius: 30px;
}
/deep/ .el-card__body{
}
.b2{
    background-color: rgb(212, 92, 112);
    font-size: 20px;
    color: white;
    margin-left: 250px;
}
/deep/.el-input__inner{
    background-color: rgb(115, 234, 108);
    font-size: 20px;
    color: red;
    opacity: 0.3;
}
/deep/.el-input__inner:hover{
    background-color: yellow;
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
    font-size: 17px;
    color: aqua;
    text-align: left;

}
/deep/ .el-dialog__footer{
    background-image: url('../../assets/E624A820181D9856AA0ED0F782385C1B.jpg');
    background-size:cover;
    border-radius: 50px;
    opacity: 0.5;
}
.el-pagination{
    margin-top: 20px;
}
</style>>
