<template>
  <div>
    <el-breadcrumb style="height:50px" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item class="u1" :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item class="u1" :to="{ path:'/goods'}">商品列表</el-breadcrumb-item>
            <el-breadcrumb-item class="u1">添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 提示区域 -->
      <div class="a1">添加商品信息</div>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex" finish-status="success" align-center>
         <el-step title="基本信息"></el-step>
         <el-step title="商品参数"></el-step>
         <el-step title="商品属性"></el-step>
         <el-step title="商品图片"></el-step>
         <el-step title="商品内容"></el-step>
         <el-step title="完成"></el-step>
      </el-steps> 
      <!-- tab栏区域 -->
      <el-form :model="addForm" :rules="addrules" ref="addFormRef" label-width="100px" 
      label-position="top">
      <el-tabs v-model="activeIndex" tab-position='left'>
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <!-- 级联选择器 -->
            <el-form-item style="width: 50px;" label="商品分类" prop="">
            <el-cascader
             :options="cateList"
             :props="cateProps"
             v-model="addForm.goods_cat"
             @change="handleChange">
            </el-cascader></el-form-item>         
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
          
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
      </el-tabs>  
    </el-form>          
    </el-card>
  </div>
</template>

<script>
export default {
    name:'add',
    data(){
        return{
          /* 活动点 */
          activeIndex:'0',
          /* 获取添加信息的数据对象 */
          addForm:{
            goods_name:'',
            goods_price:'',
            goods_number:'',
            goods_weight:'',
            /* 商品分类 */
            goods_cat:[]
          },
          /* 商品分类列表 */
          cateList:[],
          cateProps:{
            label:'cat_name',
            value:'cat_id',
            children:'children'

          },
          /* 商品校验规则 */
          addrules:{
            goods_name:[
            {required: true,message:'请输入商品名称',trigger:'blur'},
            ],
            goods_price:[
            {required: true,message:'请输入商品价格',trigger:'blur'},
            ],
            goods_number:[
            {required: true,message:'请输入商品数量',trigger:'blur'},
            ],
            goods_weight:[
            {required: true,message:'请输入商品重量',trigger:'blur'},
            ]
          }

        }
    },
    created(){
      this.getCateList()

    },
    methods:{
      /* 获取所有商品分类数据 */
      async getCateList(){
      const{data:res} = await this.$http.get('categories')
      if(res.meta.status!==200){
        return this.$message.error('商品分类列表获取失败')
      }
      this.cateList = res.data
      },
      /* 级联选择器选中会触发这个函数 */
      handleChange(){

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
/deep/.a1{
  text-align: center;
  font-size: 30px;
  font-style: italic;
  color: #9c9c9c;
}
/deep/ .el-steps{
  margin-top: 10px;
  font-style: italic;
}
/deep/ .el-form-item__label{
  font-size: 20px;
  font-style: italic;
  color: #9c9c9c;
}
/deep/.el-tabs--left .el-tabs__item.is-left{
  font-size: 25px;
  font-style: italic;
  color: #d4a3a3;
}
/deep/.el-input__inner{
    font-size: 30px;
    font-style: italic;
    border-radius: 30px;
    border: 0px;
    color: #9c9c9c;
    box-shadow: 0 2px pink;
}
</style>>
