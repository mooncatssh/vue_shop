<template>
  <div>
    <el-breadcrumb style="height:50px" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item class="u1" :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item class="u1">商品管理</el-breadcrumb-item>
            <el-breadcrumb-item class="u1">商品分类</el-breadcrumb-item>
        </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
        <el-row>
            <el-col>
                <el-button @click="showAddCate" class="b2" type="primary" round>添加分类</el-button>
            </el-col>
        </el-row>
        <!-- 表格区 -->
        <tree-table
        class="treetable" 
        :data="catelist" 
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index index-text="#" border>
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
            <i class="el-icon-circle-check" 
            v-if="scope.row.cat_deleted==false" style="color:darkseagreen"></i>
            <i class="el-icon-circle-close" v-else style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level==0">一级</el-tag>
            <el-tag type="success" size="mini" v-else-if="scope.row.cat_level==1">二级</el-tag>
            <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
            <el-button type="primary" size="mini" @click="selectCate(scope.row.cat_id)">编辑</el-button>
            <el-button type="danger" size="mini" @click="removeCate(scope.row.cat_id)">删除</el-button>
        </template>
        </tree-table>
        <!-- 分页区 -->
        <el-pagination
               @size-change="handleSizeChange"
               @current-change="handleCurrentChange"
               :current-page="querInfo.pagenum"
               :page-sizes="[1, 3, 7, 10]"
               :page-size="querInfo.pagesize"
               layout="total, sizes, prev, pager, next, jumper"
               :total="total">
        </el-pagination> 
        <!-- 添加分类对话框 -->
        <el-dialog
         title="添加分类"
         :visible.sync="addCateDialogVisible"
         width="35%"
         :append-to-body="true"
         @close="addCateDialogClose">
         <!-- 分类商品表单 -->
         <el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateFormRules" label-width="80px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input class="input1" v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- options 用来指定数据源 -->
            <!-- props 用来指定配置对象 -->
            <el-cascader
              expand-trigger="hover"
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChange"
              clearable :change-on-select="true"></el-cascader>          
          </el-form-item>
         </el-form>
         <!--底部区 -->        
         <span slot="footer" class="dialog-footer">
           <el-button @click="addCateDialogVisible = false">取 消</el-button>
           <el-button type="primary" @click="addCate">确 定</el-button>
         </span>
       </el-dialog>
       <!-- 编辑商品列表对话框 -->
       <el-dialog 
            title="编辑分类"
            :visible.sync="selectCateDialog"
            width="35%" 
            :append-to-body="true"
            @close="eddDialogClose">
            <!--内容区 -->
        <el-form :model="Cates"  ref="selectCateFromRef" label-width="80px">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="Cates.cat_name"></el-input>
            </el-form-item>
        </el-form> 
        <!-- 底部区 -->
           <span slot="footer" class="dialog-footer">
             <el-button @click="selectCateDialog = false">取 消</el-button>
             <el-button type="primary" @click="selectedCate()">确 定</el-button>
           </span>
        </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
    name:'cate',
    data(){
        return{
            /* 获取商品列表参数 */
            querInfo:{
                type: 3,
                pagenum: 1 ,
                pagesize: 5
            },
            /* 商品分类的数据 */
            catelist:[],
            /* 总数据条数 */
            total: 0 ,
            /* 为table指定列定义 */
            columns:[
                {
                label:'分类名称',
                prop:'cat_name'
            },
            {
                label:'是否有效',
                /* 表示 将当前列定义为模板列 */
                type:'template',
                /* 当前模板列的使用名称 */
                template:'isok'
            },
            {
                label:'排序',
                type:'template',
                template:'order'
            },
            {
                label:'操作',
                type:'template',
                template:'opt'
            }
        ],
        /* 添加分类对话框 显示 */
        addCateDialogVisible:false,
        /* 将要添加商品表单的分类对象 */
        addCateForm:{
            /* 将要添加的分类名称 */
            cat_name:'',
            /* 父级分类的Id */
            cat_pid:0,
            /* 分类层级 */
            cat_level:''
        },
        /* 添加表单的分类验证规则 */
        addCateFormRules:{
            cat_name:[
            {required: true, message:'请输入分类名称',trigger:'blur'}
            ],

        },
        /* 父级分类的数据 */
        parentCateList:[],
         /* 指定级联选择器的配置对象 */
         cascaderProps:{
            value:'cat_id',
            label:'cat_name',
            children:'children'
         },
         /* 选中的父级分类的id数组 */
         selectedKeys:[],
         /* 编辑分类对话框显示 */
        selectCateDialog:false,
        /* 请求编辑参数 */
        Cates:{}
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        /* 获取商品分类列表 */
        async getCateList(){
           const{data:res} = await this.$http.get('categories',{params: this.querInfo})
           if(res.meta.status !==200) {
           return this.$message.error('获取商品列表失败')
       }
       this.catelist = res.data.result
       this.total = res.data.total
    },
    /* 监听 pagesize 改变 */
    handleSizeChange(newSize){
        this.querInfo.pagesize=newSize
        this.getCateList()
    },
    /* 监听 pagenum 改变 */
    handleCurrentChange(newPage){
        this.querInfo.pagenum = newPage
        this.getCateList()
    },
    /* 展示添加分类商品对话框 */
    async showAddCate(){
        this.getParentCateList()
        this.addCateDialogVisible = true
    },
    /* 获取父级分类 */
    async getParentCateList(){
        const{data:res} = await this.$http.get('categories',{params: {type: 2 }})
        if(res.meta.status!==200){
            this.$message.error('获取父级分类失败')
        }
        this.parentCateList = res.data
    },
    /* 选中项发生变化触发的函数 */
    parentCateChange(){
    /* 如果 selectedKeys 数组中的length > 0 ,证明选中的父级分类  */
    /* 反之 没有 */
    if(this.selectedKeys.length>0){
        /* 父级分类的Id */
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        /* 父级分类的level */
        this.addCateForm.cat_level = this.selectedKeys.length

        return
    }else{
        /* 父级分类的Id */
        this.addCateForm.cat_pid = 0
        /* 父级分类的level */
        this.addCateForm.cat_level = 0
    }
    },
    /* 确定添加商品分类 */
    addCate(){
        this.$refs.addCateFormRef.validate(async valid =>{
            if(!valid) return
            const{data:res} = await this.$http.post('categories',this.addCateForm)
            if(res.meta.status !==201) {
           return this.$message.error('添加分类失败')
       }
       this.getCateList()
       this.addCateDialogVisible = false

} )
    },
    /* 监听对话框的关闭,重置表单数据 */
    addCateDialogClose(){
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys = []
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
    },
    /* 编辑对话框展示 */
    async selectCate(id){
        const{data:res} = await this.$http.get('categories/'+id,this.Cates)
        if(res.meta.status!==200){
            this.$message.error('请求编辑分类失败')
        }
        this.Cates = res.data
        console.log(this.Cates)
        this.selectCateDialog = true
    },
    /* 提交编辑对话框 */
    async selectedCate(){
        this.$refs.selectCateFromRef.validate(async valid =>{
            if(!valid) return
        const{data:res} = await this.$http.put('categories/'+this.Cates.cat_id,{cat_name: this.Cates.cat_name})
        if(res.meta.status!==200){
            this.$message.error('提交编辑分类失败')
        }
        this.getCateList()
        this.selectCateDialog = false
    })
    },
    /* 删除分类 */
    async removeCate(id){
        //弹出询问是否删除
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
        const{data:res} = await this.$http.delete('categories/'+id,this.Cates)
        if(res.meta.status!==200){
            this.$message.error('删除分类失败')
        }
        this.$message.success('成功删除')
        this.getCateList()
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
    border-bottom:2px solid rgb(212, 92, 112);
    border-radius: 20px;
    opacity: 0.7;
}
.b2{
    background-color: rgb(212, 92, 112);
    font-size: 20px;
    color: white;
}
/deep/ .el-button.el-button--primary{
    border-radius: 30px;
    background-color: rgb(53, 219, 219);
    color: rgb(146, 197, 108);

}
/deep/ .el-card__body{
    height: 450px;
    overflow-y: scroll;
    scrollbar-arrow-color:rgb(218, 214, 214);
}
.treetable{
    margin-top: 15px;
}
.zk-table{
    font-size: 20px;
    font-style: italic;
    color: rgb(149, 224, 237);
}
/deep/ .el-tag{
    border-radius: 30px;
}
/deep/ .el-button--danger {
    border-radius: 30px;
}
/deep/ .el-pagination{
    margin-top: 50px;
    padding-bottom: -20px;
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
    font-size: 14px;
    color: aqua;
    text-align: left;

}
/deep/.el-input__inner{
    background-color: rgb(115, 234, 108);
    font-size: 20px;
    color: red;
    opacity: 0.3;
}
/deep/ .input1{
    width: 300px;
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
/deep/ .el-scrollbar__view{
    background-image: url('../../assets/D34CA7AE2875D6BBFDE2D8CE98A8D3AF.jpg');
    background-size: cover;
}

</style>>

