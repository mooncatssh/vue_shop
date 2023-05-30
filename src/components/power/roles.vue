<template>
  <div>
    <el-breadcrumb style="height:50px" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item class="u1" :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item class="u1">权限管理</el-breadcrumb-item>
            <el-breadcrumb-item class="u1">角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
        <!-- 添加角色区域 -->
        <el-row :gutter="70">
                <el-col>
                    <el-button @click="addDialogVisible=true"  class="b2" type="primary" round>添加角色</el-button>
                </el-col>
        </el-row>
        <!-- 权限列表 -->
        <el-table :data="rolelist">
            <!--展开列  -->
            <el-table-column type="expand" >
                 <template slot-scope="scope">
                    <el-row :class="['bdbottom',i1 == 0 ? 'bdtop':'' ,'vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                        <!-- 渲染一级权限 -->
                        <el-col :span="5">
                            <el-tag closable @close="removeRightById(scope.row,item1.id)">{{ item1.authName }}</el-tag>
                        </el-col>
                        <!-- 渲染二级权限 -->
                        <el-col :span="19">
                            <!-- 通过for循环渲染二级权限 -->
                            <el-row :class="[i2 ===0 ? '' : 'bdtop' ,'vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                <el-col :span="6">
                                    <el-tag closable @close="removeRightById(scope.row,item2.id)" type="success" >{{ item2.authName }}</el-tag>
                                </el-col>
                                <!--通过for循环渲染三级权限 -->
                                <el-col  :span="18">
                                    <el-tag type="warning" v-for="(item3,) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">
                                        {{ item3.authName }}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                 </template>
                </el-table-column>
            <!-- 索引列 -->
            <el-table-column label="#" type="index"></el-table-column>

            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="180px" >
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="showedialogVisible(scope.row.id)" icon="el-icon-edit"></el-button>
                    <el-button type="danger" style="border-radius:10px" size="mini" icon="el-icon-delete" @click="removeRolesById(scope.row.id)"></el-button>
                    <el-button style="border-radius:10px" type="warning" size="mini" icon="el-icon-setting" @click="showSetRightDialog(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 添加角色框 -->
        <el-dialog
            title="添加角色"
            :visible.sync="addDialogVisible"
            width="35%"
            :append-to-body="true"
            @close="addDialogClose">
            <!--内容区 -->
        <el-form :model="rolesFrom" ref="rolesFromRef" label-width="80px">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="rolesFrom.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="rolesFrom.roleDesc"></el-input>
            </el-form-item>
            </el-form>
            <!-- 底部区 -->
            <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addRoles">确 定</el-button>
            </span>
          </el-dialog>
          <!-- 修改对话框 -->
          <el-dialog 
            title="修改角色"
            :visible.sync="edialogVisible"
            width="35%" 
            :append-to-body="true"
            @close="eddDialogClose">
            <!--内容区 -->
        <el-form :model="Roles" ref="editFromRef" label-width="80px">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="Roles.roleName" ></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="Roles.roleDesc"></el-input>
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
            @close="setRightDialogClose">
            <!--内容区 -->
            <el-tree :data ="rightlist" :props="rightlistProps" show-checkbox node-key="id" 
            default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <!-- 底部区 -->
            <span slot="footer" class="dialog-footer">
              <el-button @click="setDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
          </el-dialog>                    
    </el-card>
  </div>
</template>

<script>
export default {
    name:'roles',
    data(){
        return{
            /* 获取全部权限列表 */
            rolelist:[],
            /* 添加角色框 */
            addDialogVisible:false,
            /* 请求角色列表参数 */
            rolesFrom:{
                roleName:'',
                roleDesc:''
            },
            /* 修改角色框 */
            edialogVisible:false,
            /* 请求编辑参数 */
            Roles:{},
            /* 分配权限 */
            setDialogVisible:false,
            /* 所有权限的数组 */
            rightlist: [],
            /* 权限列表 */
            rightlistProps:{
                label: 'authName',
                children: 'children'
            },
            /* 默认选中的id节点数组 */
            defKeys:[],
            /* 即将获取权限的id */
            roleId:'',
        }
    },
    created(){
        this.getRoleList()
    },
    methods:{
        /* 获取权限列表 */
        async getRoleList(){
        const{data:res} = await this.$http.get('roles')
        if(res.meta.status!==200){
            this.$message.error('权限获取失败')
        }
        this.$message.success('权限获取成功')
        this.rolelist = res.data
        },
        /* 关闭添加框 */
        addDialogClose(){
            this.$refs.rolesFromRef.resetFields()
        },
        /* 添加网络请求 */
        addRoles(){
            this.$refs.rolesFromRef.validate(async valid=>{
                if(!valid)return
            const{data:res} =  await this.$http.post('roles',this.rolesFrom)
            if(res.meta.status!==201){
                console.log(res)
            this.$message.error('添加用户失败')
            }
            this.$message.success('添加用户成功')
            this.addDialogVisible=false
            this.getRoleList()
            
        })
        },
        /* 编辑网络请求 */
        async showedialogVisible(id){
        const{data:res} = await  this.$http.get('roles/'+id,this.Roles)
            if(res.meta.status!==200){
            this.$message.error('修改用户失败')
            }
            this.$message.success('修改用户成功')
            //打开对话框
            this.edialogVisible =true
            this.Roles=res.data
        },
        /* 关闭修改框 */
        eddDialogClose(){
            this.$refs.editFromRef.resetFields()
        },
        /* 提交编辑网络请求 */
        eddUserInfo(){
            this.$refs.editFromRef.validate(async valid=>{
            if(!valid)return
                const {data:res}= await this.$http.put('roles/'+this.Roles.roleId,{roleName:this.Roles.roleName,roleDesc:this.Roles.roleDesc})
            if(res.meta.status!==200){
                return this.$message.error('请求出错')
        }
            this.edialogVisible = false
            this.getRoleList()
    })
    },
    /*删除角色 */
    async removeRolesById(id){
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
       const {data:res}= await this.$http.delete('roles/'+id)
       if(res.meta.status!==200){
        this.$message.error('错误的')
       }
       this.$message.success('成功删除')
       this.getRoleList()
        console.log('确认乐删除')

    },
    /* 删除权限 */
    async removeRightById(role,rightId){
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
        const{data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if(res.meta.status!==200){
            return this.$message.error('权限删除失败')
        }
        role.children = res.data


    },
    /* 获取所有权限 */
    async showSetRightDialog(role){
        /* 获取权限的id */
        this.roleId = role.id

        const{data:res}= await this.$http.get('rights/tree')
        if(res.meta.status!==200){
            this.$message.error('权限获取失败')
        }
        this.rightlist = res.data
        /* 递归获取三级权限id */
        this.getLeafKeys(role,this.defKeys)
        this.setDialogVisible = true
    },
    /* 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中 */
    getLeafKeys(node,arr){
        //如果当前 node 节点不包含 children 属性，则是三级节点
        if(!node.children){
            return arr.push(node.id)
        }
        node.children.forEach(item=>
            this.getLeafKeys(item,arr)
        )
    },
    /* 监听分配权限对话框关闭事件 */
    setRightDialogClose(){
        this.defKeys=[]
    },
    /*点击为角色分配权限*/
    async allotRights(){
        const keys=[
            /* ... 为展开括号 */
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedNodes()
        ]
        const idStr = keys.join(',')
        const{data:res }= await this.$http.post(`roles/${this.roleId}/rights`,{rids: idStr})
        if(res.meta.status!==200){
            return this.$message.error('分配权限失败')
        }
        this.getRoleList()
        this.setDialogVisible = false
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
.b2{
    background-color: pink;
    font-size: 20px;
    color: white;
}
/deep/ .el-button.el-button--primary{
    border-radius: 30px;
    background-color: rgb(53, 219, 219);
    color: rgb(146, 197, 108);

}
/deep/ .el-button.el-button--default{
    border-radius: 30px;
    background-color: rgb(96, 105, 105);
    color: pink;
    
}
.el-table{
    margin-top: 20px;
}
.box-card{
    padding:-10px;
    border-bottom:2px solid pink;
    border-radius: 20px;
    opacity: 0.7;
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
    font-size: 17px;
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
/deep/ .el-tag{
    border-radius: 30px;
}
.bdtop{
    border-bottom: 1px solid #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}
/* 纵向居中对齐 */
.vcenter{
    display: flex;
    align-items: center;
}
/deep/ .el-tree{
    font-style: italic;
    color: #806ad7;// 白色字体
    background: rgba(0,0,0,0);// 整体背景透明
}

</style>>
  