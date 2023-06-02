<template>
  <div>
    <el-breadcrumb style="height:50px" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item class="u1" :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item class="u1">商品管理</el-breadcrumb-item>
            <el-breadcrumb-item class="u1">分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
        <el-alert title="注意: 只允许为第三级分类设置相关参数 !" type="warning" :closable="false">
        </el-alert>
    <!--选择商品分类区域-->
    <el-row class="cat_opt">
        <el-col>
            <span>选择商品分类:</span>
            <el-cascader
            expand-trigger="hover"
            v-model="selectedCateKeys"        
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
            clearable :change-on-select="true"></el-cascader>
        </el-col>
    </el-row>
    <!-- tab 页签区域 -->
    <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <el-tab-pane label="动态参数" name="many">
            <!-- 动态参数按钮 -->
            <el-button type="primary" :disabled="isBtnDisabled" @click=" addDialogVisible=true">添加参数</el-button>
            <!-- 动态参数表格 -->
            <el-table :data="manyData" border stripe>
                <!-- 展开列 -->
                <el-table-column  type="expand">
                    <template slot-scope="scope">
                        <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i">
                            {{ item }}
                        </el-tag>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="showData(scope.row.attr_id)">编辑</el-button>
                        <el-button type="primary" icon="el-icon-delete" @click="deleteData(scope.row.attr_id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" :disabled="isBtnDisabled" @click=" addDialogVisible=true">添加属性</el-button>
            <!-- 静态参数表格 -->
            <el-table :data="onlyData" border stripe>
                <!-- 展开列 -->
                <el-table-column  type="expand"></el-table-column>
                <!-- 索引列 -->
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="showData(scope.row.attr_id)">编辑</el-button>
                        <el-button type="primary" icon="el-icon-delete" @click="deleteData(scope.row.attr_id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
  </el-tabs>     
    </el-card>
     <!--添加对话框 -->  
    <el-dialog
            :title="'添加'+titleText"
            :visible.sync="addDialogVisible"
            width="35%"
            :append-to-body="true"
            @close="addDialogClose">
            <!--内容区 -->
        <el-form :model="addForm" ref="addFormRef" rules="addFormRules" label-width="80px">
            <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="addForm.attr_name"></el-input>
            </el-form-item>
            </el-form>
            <!-- 底部区 -->
            <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addData">确 定</el-button>
            </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
            :title="'修改'+titleText"
            :visible.sync="editDialogVisible"
            width="35%"
            :append-to-body="true"
            @close="editDialogClose">
            <!--内容区 -->
        <el-form :model="editForm" ref="editFormRef" rules="editFormRules" label-width="80px">
            <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="editForm.attr_name"></el-input>
            </el-form-item>
            </el-form>
            <!-- 底部区 -->
            <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editData">确 定</el-button>
            </span>
    </el-dialog>    
  </div>
</template>
<script>
import { Scope } from 'eslint-scope'

export default {
    name:'params',
    data(){
        return{
            /* 商品分类列表 */
            catelist:[],
            /* 级联选择框的配置对象 */
            cateProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            /* 级联选择框双向绑定到的数组 */
            selectedCateKeys:[],
            /* tab数据列表 */
            activeName:'many',
            /* 动态参数数据 */
            manyData:[],
            /* 静态参数数据 */
            onlyData:[],
            /* 添加对话框显示 */
            addDialogVisible:false,
            /* 要添加的参数 */
            addForm:{
                attr_name:''
            },
            /* 验证添加规则 */
            addFormRules:{
                attr_name:[
                    {required:true, message:'请输入参数名称',trigger:'blur'}
                ]
            },
            /* 修改对话框显示 */
            editDialogVisible:false,
            /* 修改获取参数 */
            editForm:{},
            /* 修改验证规则 */
            editFormRules:{
                attr_name:[
                    {required:true, message:'请输入参数名称',trigger:'blur'}
                ]
            }
        }
    },
    created(){
        this.getCateList()
    },
    computed:{
        /* 如果按钮需要被禁用，则返回 true */
        isBtnDisabled(){
            if(this.selectedCateKeys.length !==3){
                return true
            }
            return false
        },
        /* 获取三级分类的ID */
        cateId(){
            if(this.selectedCateKeys.length ==3){
                return this.selectedCateKeys[2]
            }
            return null
        },
        /* 获取动态标题 */
        titleText(){
            if(this.activeName == 'many'){
                return '动态参数'
            }
            return '静态参数'
        }
    },
    methods:{
        /* 获取所有的商品分类列表 */
    async getCateList(){
        const{data:res} = await this.$http.get('categories')
        if(res.meta.status!==200){
            return this.$message.error('商品分类数据列表')
        }
        this.catelist = res.data
        console.log(this.catelist)
    },
    /* 级联选择框中的变化，会触发这个函数 监听 */
    handleChange(){
        this.getParamsData()
    },
    /* tab 页面点击函数 */
    handleTabsClick(){
        this.getParamsData()
    },
    /* 获取参数的列表数据 */
    async getParamsData(){
        if(this.selectedCateKeys.length !==3){
            this.selectedCateKeys = []
            return 
        }
        /* 根据所选分类的ID,和当前所处的面板，获取对应的参数 */
        const{data:res} =await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
        if(res.meta.status !==200){
            return this.$message.error('获取三级分类参数失败')
        }
        res.data.forEach(item=> {
            item.attr_vals = item.attr_vals.split(' ')
        }),
        console.log(res.data)
        /* 用于判断是获取的哪个表格的参数数据 */
        if(this.activeName == 'many'){
            this.manyData = res.data
        }else{
            this.onlyData = res.data
        }
        
    },
    /* 监听添加框清空事件 */
    addDialogClose(){
        this.$refs.addFormRef.resetFields()
    },
    /* 监听修改框清空事件 */
    editDialogClose(){
        this.$refs.editFormRef.resetFields()
    },
    /* 添加动态参数或静态属性 */
    addData(){
        this.$res.addFormRef.validate(async valid =>{
            if(!valid) return
            const{data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,
            {  attr_name:this.addForm.attr_name,
               attr_sel : this.activeName
            })
            if(res.meta.status!==201){
                this.$message.error('添加参数或属性失败')
            }
            this.addDialogVisible = false
            this.getParamsData()
        })
    },
    /* 展示修改对话框 */
    async showData(attr_id){
        const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{
            params:{attr_sel: this.activeName}})
            if(res.meta.status!==200){
                return this.$message.error('获取修改参数失败')
            }
            this.editForm = res.data
            this.editDialogVisible = true
    },
    /* 提交分类参数修改 */
    editData(){
        this.$refs.editFormRef.validate(async valid=>{
            if(!valid) return
            const{data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
            {
                attr_name:this.editForm.attr_name,
                attr_sel:this.editForm.activeName
            })
            if(res.meta.status!==200){
                return this.$message.error('提交分类参数失败')
            }
            this.getParamsData()
            this.editDialogVisible = false
        })
    },
    /* 删除分类参数 */
    async deleteData(attrid){
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
        const{data:res} = await this.$http.delete(` categories/${this.cateId}/attributes/${attrid}`)
        if(res.meta.status!==200){
            return this.$message.error('删除分类参数失败')
        }
        this.getParamsData()
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
/deep/.el-alert__title{
    font-size: 30px;
    color: pink;
    font-style: italic;

}
.cat_opt{
    margin:15px 20px;
}
span{
    font-size: 25px;
    font-style: italic;
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
    margin-left: 100px;
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
    font-size: 15px;
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
/deep/ .el-cascader-node>.el-radio{
    background:rgb(111, 184, 212)
  }
/deep/ .el-tabs{
    font-style: italic;
    color: palevioletred;
}
/deep/ .el-tabs__item{
    font-size: 30px;
}
.el-table-column{
    margin-top: 5px;
}
/deep/ .el-tag{
    border-radius: 30px;
    margin: 10px;
}
</style>>
