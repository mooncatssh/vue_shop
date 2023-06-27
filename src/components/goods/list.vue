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
                    <el-button class="b2" type="primary" @click="addSetGoods">添加商品</el-button>
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
                    <el-button size="mini" type="primary" @click="showGoods(scope.row.goods_id)" icon="el-icon-edit"></el-button>
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
        <!-- 编辑商品对话框 -->
        <el-drawer
            :visible.sync="drawer"
            :direction="direction"
            :append-to-body="true"
            size="30%"
            :before-close="handleClose">        
            <!-- 内容主题区 -->
        <el-form :model="addGoods" :rules="addGoodsRules" ref="addGoodsRef" label-width="80px">
              <el-form-item class="b3" label="名称" prop="goods_name">
                <el-input v-model="addGoods.goods_name"></el-input>
              </el-form-item>
              <el-form-item class="b3" label="价格" prop="goods_price">
                <el-input v-model="addGoods.goods_price"></el-input>
              </el-form-item>
              <el-form-item class="b3" label="数量" prop="goods_number">
                <el-input v-model="addGoods.goods_number"></el-input>
              </el-form-item>
              <el-form-item class="b3" label="重量" prop="goods_weight">
                <el-input v-model="addGoods.goods_weight"></el-input>
              </el-form-item>
              
        </el-form>
        <div class="demo-drawer__footer">           
              <el-button class="b4" @click="drawer = false">取 消</el-button>
              <el-button class="b4" type="primary" @click="addgoods">确 定</el-button>
        </div> 
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
                pagesize: 5
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
        /* 添加商品页面跳转 */
        async addSetGoods(){
            this.$router.push('/goods/add')
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
        },
        /* 查询商品信息 */
        async showGoods(id){
            const{data:res} = await this.$http.get(`categories/${id}`)
            if(res.meta.status!==200){
                return this.$message.error('查询商品信息失败')
            }
            this.drawer = true
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
    color: rgb(48, 45, 45);
    opacity: 0.3;
}
/deep/.el-input__inner:hover{
    background-color: yellow;
}
/deep/ .el-button.el-button--default{
    border-radius: 30px;
    background-color: rgb(102, 199, 199);
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
/deep/ .el-drawer{
    background-image: url('../../assets/3839A082A178F54ACD24ECD3ECC9749E.jpg');
    background-size: cover;
    opacity: 0.7;
}
/deep/.el-drawer{
    span{
    margin-left: 100px;
    font-style: italic;
    opacity: 0.8;
    }

}
.b3{
    /deep/ .el-form-item__label{
    height: 50px;
    font-size: 30px;
    color:rgb(82, 141, 200);
    text-align: left;

}
    /deep/.el-input__inner{
    background-color: rgb(208, 85, 163);
    width: 300px;
    font-size: 30px;
    color: rgb(202, 231, 17);
    opacity: 0.3;
    }
    /deep/.b4{
        opacity: 0.2;
}
}
/deep/ .el-dialog__title {
    margin-left: 130px;
    line-height: 80px;
    font-size: 50px;
    color: #596bcc;
    font-style: italic;
    opacity: 0.8;
    }
/deep/ .el-form-item__label{
    height: 50px;
    font-size: 14px;
    color:aqua;
    text-align: left;

}
.el-pagination{
    margin-top: 20px;
}
</style>>
