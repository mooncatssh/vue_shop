<template>
  <div class="login_container">
    <div class="login_box">
        <!-- 头像区 -->
        <div class="avatar_box">
            <img src="../assets/106449882_p0_master1200.jpg" alt="">
        </div>
        <!-- 登录区 -->
        <el-form  ref="loginfromRef" :model="loginFrom" :rules="loginFromRules" label-width="0px" class="login_form">
            <!-- 用户名 -->
            <el-form-item class="input" prop="username">
                <el-input v-model="loginFrom.username" prefix-icon="el-icon-user" style="border-radius:10px" ></el-input>
            </el-form-item>
            <br>
            <!-- 密码 -->
            <el-form-item class="input" prop="password">
                <el-input show-password v-model="loginFrom.password" prefix-icon="el-icon-lock" style="border-radius:10px" ></el-input>
            </el-form-item>
            <!-- 按钮 -->
            <el-form-item class="btn">
                <el-button type="primary" round @click="login">登录</el-button>
                <el-button type="info" round @click="resetLoginfrom">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
export default {
    name:'login',
    data() {
        return {
            loginFrom:{
                username:'admin',
                password:'123456'
            },
            loginFromRules:{
                /* 验证用户 */
                username:[
                { required: true, message: '请输入正确的用户名', trigger: 'blur' },
                { min: 3, max: 6, message: '长度在 3到 6个字符', trigger: 'blur' }
                ],
                /* 验证密码 */
                password:[
                { required: true, message: '请输入正确的密码', trigger: 'blur'},
                { min: 3, max: 6, message: '长度在 3到 6个字符', trigger: 'blur'}
                ]
            }      
    }
},
methods:{
    /* 重置按钮 */
    resetLoginfrom() {
        /* console.log(this) */
        this.$refs.loginfromRef.resetFields();
    },
    login(){
        this.$refs.loginfromRef.validate(async valid=>{
            if(!valid) return;
            /* 发起登录请求 */
            const {data: res}= await this.$http.post('login',this.loginFrom);
            if(res.meta.status!==200) return this.$message.error("欧尼酱 登录失败了哦 ");
            this.$message.success("成功出发 欧尼酱");

            /* 将token保存到sessionStorage中 */
            window.sessionStorage.setItem('token',res.data.token);
            this.$router.push("/home");
        });
    }
}
}
</script>

<style lang="less" scoped>
.login_container{
    height: 100%;
    background-image: url(../assets/107465767_p1_master1200.jpg);
    background-size: cover;
    background-attachment:scroll;
}
.login_box{
    width: 450px;
    height: 500px;
    /* background-image: url('../assets/106833158_p0_master1200.jpg'); */
    /* background-size: cover; */
    border: 1px solid pink;
    border-radius: 10px;
    position:absolute;
    left: 50%;
    top:60%;
    transform: translate(-50%,-50%);
}
.avatar_box{
    height: 230px;
    width: 230px;
    margin-top:-100px;
    margin-left: 100px;
    padding: 10px;
    box-shadow: 0 0 10px white;
    border: 1px solid white;
    border-radius: 50%;
    img{
        height: 100%;
        width: 100%;
        border-radius: 50%;
    }
}
.input{
    border: 5px solid pink;
    font-size: 12px;
    border-radius: 10px;
}
.login_form{
    width: 300px;
    height: 200px;
    position: absolute;
    left: 60px;
    top: 180px;
    padding: 0px 20px;
}
.btn{
    display: flex;
    justify-content: flex-end;
    margin-left: 70px;
}
</style>>

</style>