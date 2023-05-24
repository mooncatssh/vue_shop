<template>
  <div>
    <el-breadcrumb style="height:50px" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item class="u1" :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item class="u1">权限管理</el-breadcrumb-item>
            <el-breadcrumb-item class="u1">权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
        <el-table :data="rightlist" stripe >
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="权限名称" prop="authName"></el-table-column>
            <el-table-column prop="path" label="路径"></el-table-column>
            <el-table-column prop="level" label="权限等级">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.level ==='0'">一级权限</el-tag>
                <el-tag type="success" v-else-if="scope.row.level ==='1'">二级权限</el-tag>
                <el-tag type="warning" v-else>三级权限</el-tag>
            </template>
        </el-table-column>
        </el-table>
    </el-card>
  </div>
</template>

<script>

export default {
    name:'rights',
    data(){
        return{
            //权限列表
            rightlist:[]
        }
    },
    created(){
        this.getRightList()
    },
    methods:{
        //获取权限列表
        async getRightList(){
        const{data:res} = await this.$http.get('rights/list')
        if(res.meta.status!==200){
            this.$message.error('权限获取失败')
        }
        this.$message.success('权限获取成功')
        this.rightlist = res.data
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
</style>>
