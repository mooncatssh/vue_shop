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
      <el-tabs v-model="activeIndex" tab-position='left' :before-leave="beforeTabLeave" 
      @tab-click="tabClicked">
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
           <!-- 渲染参数列表的item项 -->
           <el-form-item :label="ietm.attr_name" v-for="ietm in manyTableData" :key="ietm.attr_id">
            <el-checkbox-group v-model="ietm.attr_vals">
             <el-checkbox :label="cb" border v-for="(cb,i) in ietm.attr_vals" :key="i"></el-checkbox>
           </el-checkbox-group>
          </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="ietm.attr_name" v-for="ietm in onlyTableData" :key="ietm.attr_id">
              <el-input v-model="ietm.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 上传图片  action图片要上传的api接口地址-->
            <el-upload
                :on-success="handleSuccess"
                :headers="headerObj"
                :action="uploadURL"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>              
                <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>                        
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce">
            </quill-editor>
            <el-button  class="btn" @click="add">添加商品</el-button>
          </el-tab-pane>
      </el-tabs>  
    </el-form>          
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
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
            goods_cat:[],
            /* 图片存储数组 */
          pics:[],
          /* 商品的详细介绍 */
          goods_introduce:'',
          /* 商品参数 */
          attrs:[]
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
            ],
            goods_cat:[
            {required: true,message:'请输入商品分类',trigger:'blur'},
            ]
          },
          /* 动态参数列表 */
          manyTableData:[],
          /* 静态属性列表 */
          onlyTableData:[],
          /* 上传图片的api地址 */
          uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
          dialogImageUrl: '',
          /* 图片放大框 */
          dialogVisible: false,
          /* 图片上传组件的headers 请求头对象 */
          headerObj:{
            Authorization: window.sessionStorage.getItem('token')
          },
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
      /* 如果选中不为第三项则清空 */
      handleChange(){
        if(this.addForm.goods_cat.length!==3){
          this.addForm.goods_cat = []
        }
      },
      /* 切换判断 */
      beforeTabLeave(activeName,oldActiveName){
        if(oldActiveName = 0 && this.addForm.goods_cat.length!==3){
          this.$message.error('请输入商品分类')
          return false
        }
      },
      /* 获取参数列表 */
      async tabClicked(){
        if(this.activeIndex=== '1'){
          const{data:res} = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`,{params:{sel:'many'}})
          if(res.meta.status!==200){
            return this.$message.error('获取参数失败')
          }
          /* 将字符串 分割为变为数组 */
          res.data.forEach(ietm => {
            ietm.attr_vals = ietm.attr_vals.length ===0 ? []
            :ietm.attr_vals.split(' ')
          }); 
          this.manyTableData = res.data
        }
        else if(this.activeIndex==='2'){
          const{data:res} = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`,{params:{sel:'only'}})
          if(res.meta.status!==200){
            return this.$message.error('获取静态参数失败')
          }
          console.log(this.activeIndex)
          console.log(res.data)
          this.onlyTableData = res.data
        }
      },
      /* 图片预览效果 */
      handlePictureCardPreview(file) {
        console.log(file)
        this.dialogImageUrl = file.response.data.url
        this.dialogVisible = true
      },
      /* 处理图片移除效果 */
      handleRemove(file) {
        console.log(file)
         /* 1获取 将要删除的图片信息 */
         const filePath = file.response.data.tmp_path
         this.addForm.pics = this.addForm.pics.filter(ietm =>ietm.pic !==filePath)
        /* 2从pics数组中，找到图片对应的索引值 */
        /* const i = this.addForm.pics.findIndex(x => x.pic === filePath) */
        /* 调用数组的splice 放法，把图片信息对象，从pics数组中移除 */
       /*  this.addForm.pics.splice(i,1) */
      },
      /* 监听图片上传成功的事件 */
      handleSuccess(response){
        console.log(response)
        /* 1拼接得到一个图片信息对象 */
        const picInfo = {
          pic: response.data.tmp_path
        }
        /* 2将图片信息对象，push到pics数组中 */
        this.addForm.pics.push(picInfo)
        console.log(this.addForm)
      },
      /* 添加商品 */
      add(){
        this.$refs.addFormRef.validate(async valid =>{
          if(!valid) return this.$message.error('请填写必要的内容')
          /* 执行添加的业务逻辑 */
          /* loash  cloneDeep(obj)深拷贝 用于创建一个与原对象完全独立的新对象，
          两者之间不会有任何关联。它会递归地复制对象及其嵌套的所有子对象和属性，
          直到复制了整个对象树。这样，即使在原对象和新对象之间发生修改，它们也不会相互影响*/
          const form = _.cloneDeep(this.addForm)

          form.goods_cat = form.goods_cat.join(',')
          /* 处理动态参数 */
          this.manyTableData.forEach(ietm =>{
            const newInfo = {attr_id: ietm.attr_id,
              attr_vals: ietm.attr_vals.join(' ')
            }
              this.addForm.attrs.push(newInfo)
          })
          /* 处理静态属性 */
          this.onlyTableData.forEach(ietm =>{
            const newInfo ={
              attr_id:ietm.attr_id,
              attr_vals: ietm.attr_vals
            }
            this.addForm.attrs.push(newInfo)
          })
          form.attrs = this.addForm.attrs
          console.log(form)
          
          /* 发起请求添加商品 */
          /* 商品的名称必须是唯一的 */
          const{data:res} = await this.$http.post('goods',form)
          if(res.meta.status!==201){
            return this.$message.error('商品添加失败')
          }
          this.$message.success('添加商品成功')
          this.$router.push('/goods')
        })
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
/deep/ .el-tabs__content{
  height: 500px;
  /* 滚动条 */
  overflow: scroll;
}
/* 隐藏滚动条 */
/deep/::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

/deep/::-webkit-scrollbar-button {
  display:none;
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
  width: 300px;
    font-size: 20px;
    font-style: italic;
    border-radius: 30px;
    border: 0px;
    color: #9c9c9c;
    box-shadow: 0 2px pink;
}
/deep/.el-checkbox{
  margin: 0 5px 0 0 !important;
  font-style: italic;
  box-shadow: 2px ;
  color: transparent !important;
  background-image: url('../../assets/741973362C48871270267D42442DFA70.png');
  -webkit-background-clip: text;
  animation: moveImg 7s infinite alternate linear;
}
@keyframes moveImg {
            0% {
                background-position: 0%;
            }
 
            50% {
                background-position: 50%;
            }
 
            100% {
                background-position: 100%;
            }
        }
.ql-container{
  min-height: 300px;
}
.btn{
  border-radius: 30px;
  margin-top: 15px;
  font-size: 20px;
  font-style: italic;
  color: transparent !important;
  background-image: url('../../assets/741973362C48871270267D42442DFA70.png');
  -webkit-background-clip: text;
  animation: moveImg 7s infinite alternate linear;
}
</style>>
