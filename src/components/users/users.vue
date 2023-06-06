<template>
    <div>
        <el-breadcrumb style="height:50px" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item class="u1" :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item class="u1">用户管理</el-breadcrumb-item>
            <el-breadcrumb-item class="u1">用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域 -->
        <el-card class="box-card">
            <!--搜索与添加区域 -->
            <el-row :gutter="70">
                <el-col :span="10">
                    <el-input clearable @clear="getUserList" type="text" placeholder="请输入内容" v-model="querryInfo.query" class="input-with-select">
                        <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
                        </el-input>           
                </el-col>
                <el-col :span="4">
                    <el-button @click="addDialogVisible=true" class="b2" type="primary" round>添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="userlist" stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="姓名" prop="username" ></el-table-column>
                <el-table-column label="邮箱" prop="email" ></el-table-column>
                <el-table-column label="电话" prop="mobile" ></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态" prop="mg_state">
                    <template slot-scope="scope">
                         <el-switch
                          v-model="scope.row.mg_state"
                           active-color="#13ce66"
                           inactive-color="#ff4949"
                           @change="userStateChanged(scope.row)">
                         </el-switch>
                </template>
                </el-table-column> 
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-button type="primary" style="border-radius:10px" @click="showedialogVisible(scope.row.id)" size="mini" icon="el-icon-edit"></el-button>
                        <el-button type="danger" style="border-radius:10px" size="mini" icon="el-icon-delete" @click="removeUserById(scope.row.id)"></el-button>
                        <el-tooltip class="item" effect="light" :enterable="false" content="授权" placement="top">
                        <el-button type="warning" style="border-radius:10px" size="mini" icon="el-icon-setting" @click="setRole(scope.row)"></el-button>
                        </el-tooltip>                   
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination
               @size-change="handleSizeChange"
               @current-change="handleCurrentChange"
               :current-page="querryInfo.pagenum"
               :page-sizes="[1, 3, 7, 10]"
               :page-size="querryInfo.pagesize"
               layout="total, sizes, prev, pager, next, jumper"
               :total="total">
            </el-pagination>         
        </el-card>
        <!-- 添加用户对话框 -->
       <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="35%" 
            :append-to-body="true"
            @close="addDialogClose">
            <!-- 内容主题区 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
              </el-form-item>
        </el-form>            
            <!--底部区 -->
            <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog 
            title="修改用户"
            :visible.sync="edialogVisible"
            width="35%" 
            :append-to-body="true"
            @close="eddDialogClose">
            <!--内容区 -->
        <el-form :model="editFrom" :rules="addFormRules" ref="editFromRef" label-width="80px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="editFrom.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
                <el-input v-model="editFrom.mobile"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editFrom.email"></el-input>
            </el-form-item>
        </el-form> 
        <!-- 底部区 -->
           <span slot="footer" class="dialog-footer">
             <el-button @click="edialogVisible = false">取 消</el-button>
             <el-button type="primary" @click="eddUserInfo()">确 定</el-button>
           </span>
        </el-dialog>
        <!-- 分配权限对话框 -->
        <el-dialog
            title="分配权限"
            :visible.sync="setDialogVisible"
            width="35%" 
            :append-to-body="true"
            @close="setRoleDialogClosed">
            <!--内容区 -->
            <div class="p1">
                <p>当前的用户:{{userInfo.username}}</p>
                <p>当前的角色:{{ userInfo.role_name}}</p>
                <p>分配新角色:
                <el-select v-model="selectedRoleId" placeholder="请选择">
                    <el-option
                       v-for="item in roleList"
                       :key="item.id"
                       :label="item.roleName"
                       :value="item.id">
                    </el-option>
                   </el-select>                 
                </p>
            </div>
            <!-- 底部区 -->
            <span slot="footer" class="dialog-footer">
              <el-button @click="setDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
          </el-dialog>           
    </div>         
</template>

<script>

import { Message } from 'element-ui';
import { ref } from 'vue';

export default {
    name:'users',
    components:{},
    data(){
         //验证邮箱的规则
         var checkEmail=(rule,value,cb)=>{
            const regEmail= /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
            if(regEmail.test(value)){
                return cb()
            }
           cb(new Error('邮箱输入错误'))
        }
        //验证手机号的规则
        var checkPhone=(rule,value,cb)=>{
            const regPhone= /^1[0-9]{10}$/
            if(regPhone.test(value)){
                return cb()
            }
            cb(new Error('电话号码输入错误'))
        } 
        return{
            //获取用户列表的对象
            querryInfo:{
                query:'',
                //当前页数
                pagenum:'1',
                //当前每页显示多少数据
                pagesize:'2'
            },
            userlist:[],
            total:0,
            //添加用户对话框的显示与隐藏
            addDialogVisible:false,
            //添加用户的表单数据
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            //添加验证规则
            addFormRules:{
                username:[
                {required: true, message:'请输入用户名',trigger:'blur'},
                {min:3,max:8,message:'输入3-8个字符',trigger:'blur'}],
                password:[
                {required: true,message:'输入密码',trigger:'blur'},
                {min:5,max:8,message:'输入5-8个字符',trigger:'blur'}],
                email:[
                {required: true,message:'请输入邮箱地址',trigger:'blur'},
                {validator:checkEmail,trigger:'blur'},],
                mobile:[
                {required: true,message:'请输入电话号码',trigger:'blur'},
                {validator:checkPhone,trigger:'blur'},]
        },
            //修改用户对话框的显示
            edialogVisible:false,
            //请求参数
            editFrom:{},
            /* 控制角色分配对话框的显示 */
            setRoleVisible: false,
            /* 角色权限对话框 */
            setDialogVisible:false,
            /* 需要被分配角色的用户信息 */
            userInfo:{},
            /* 获取的角色 */
            roleList:[],
            /* 选中的值 */
            selectedRoleId:''
        }
    },
    created(){
        this.getUserList()
    },
    methods:{
        //获取列表
       async getUserList(){
        const {data:res} = await this.$http.get('users',{params:this.querryInfo});
        if(res.meta.status !==200) {
        return this.$message.error('获取失败')
       }
       this.userlist =res.data.users,
       this.total=res.data.total       
    },
    /* 监听 pagesize 改变的事件  */
    handleSizeChange(newSize){
        this.querryInfo.pagesize = newSize;
        this.getUserList()
    },
    /* 监听页面值改变的事件 */
    handleCurrentChange(newPage){
        this.querryInfo.pagenum = newPage;
        this.getUserList()
    },
    /* 获取角色状态信息 */
    async userStateChanged(userinfo){
        console.log(userinfo)
        const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        if(res.meta.status!==200) {
            this.userinfo.mg_state = !userinfo.mg_state
            return this.$message.error('错误')
    }
    this.$message.success('更新成功')
    },
    //监听对话框的清空
    addDialogClose(){
        this.$refs.addFormRef.resetFields()
    },
    //点击按钮，添加用户
    addUser(){
        this.$refs.addFormRef.validate(async valid =>{
            if(!valid) return
            //可以发起添加网络请求
            const {data:res} = await this.$http.post('users',this.addForm)
            if(res.meta.status!==201){
                console.log(res)
            this.$message.error('添加用户失败')
            }
            this.$message.success('添加用户成功')
            //关闭对话框
            this.addDialogVisible = false
            //重新调用列表
            this.getUserList()
        })
    },
    //展示编辑用户的对话框
    async showedialogVisible(id){
           const{data:res} =  await  this.$http.get('users/'+id,this.editFrom)
           if(res.meta.status!==200){
            return this.$message.error('展示编辑用户对话框错误')
           }
           this.edialogVisible = true
           this.editFrom = res.data
    },
    //表单的清空
    eddDialogClose(){
        this.$refs.eddDialogClose.resetFields()
    },
    //修改用户信息并提交
    eddUserInfo(){
        this.$refs.editFromRef.validate(async valid=>{
            if(!valid) return
        const{data:res} = await this.$http.put('users/'+this.editFrom.id,{email:this.editFrom.email,mobile:this.editFrom.mobile})
        if(res.meta.status!==200){
            return this.$message.error('修改用户信息出错')
        }    

            this.edialogVisible= false
            //更新列表
            this.getUserList()
        })

    },
    //删除操作根据ID
    async removeUserById(id){
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
       const {data:res}= await this.$http.delete('users/'+id)
       if(res.meta.status!==200){
        this.$message.error('错误的')
       }
       this.$message.success('成功删除')
       this.getUserList()
        console.log('确认乐删除')

    },
    /* 展示分配角色的对话框 */
    async setRole(userinfo){
        this.userInfo = userinfo
        /* 获取角色列表 */
        const{data:res} =await this.$http.get('roles')
        if(res.meta.status!==200){
            return this.$message.error('请求出错')
        } 
        this.roleList = res.data   
        this.setDialogVisible = true
    },
    /* 点击按钮,分配角色 */
    async saveRoleInfo(){
        if(!this.selectedRoleId){
        return this.$message.error('请用户选中要分配的角色')
        }
        const{data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid: this.selectedRoleId})
        console.log(res)
        if(res.meta.status!==200){
            return this.$message.error('角色分配出错')
        } 
        this.getUserList()   
        this.setDialogVisible = false
    },
    /* 监听清空分配权限对话框 */
    setRoleDialogClosed(){
        this.selectedRoleId=''
        this.userInfo={}
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
/deep/.el-input__inner{
    background-color: rgb(115, 234, 108);
    font-size: 20px;
    color: red;
    opacity: 0.3;
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
.p1{
    font-size: 25px;
    font-style: italic;
    color:rgb(212, 92, 112);
}
</style>