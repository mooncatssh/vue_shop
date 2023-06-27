<template>
  <div class="login_container">
    <div class="h3">You Shall Die</div>
    <div class="login_box">
        <!-- 头像区 -->
        <div class="avatar_box">
            <div class="img"></div>
        </div>
        <!-- 登录区 -->
        <el-form  ref="loginfromRef" :model="loginFrom" :rules="loginFromRules" label-width="0px" class="login_form">
            <div class="w">HI,GOAT</div>
            <br><br>
            <div class="w">Welcome Back</div>
            <!-- 用户名 -->
            <el-form-item class="input" prop="username">
                <el-input v-model="loginFrom.username" prefix-icon="el-icon-user" style="border-radius:10px" ></el-input>
            </el-form-item>
            <br>
            <!-- 密码 -->
            <el-form-item class="input" prop="password">
                <el-input show-password v-model="loginFrom.password" prefix-icon="el-icon-lock" style="border-radius:10px" ></el-input>
            </el-form-item>
            <div class="text">这是一场试炼</div>
            <!-- 按钮 -->
            <el-button  round @click="login">登录</el-button>
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
    background-color: blanchedalmond;
}
.h3{
    color: transparent;
    background: url('../../assets/90648E8416A71D1C801AF85F12323E86.jpg');
    -webkit-background-clip: text;
    animation: moveImg 4s infinite alternate linear;
    margin-left: 500px;
    font-size: 80px;
    font-style: italic;
}

.login_box{
    width: 800px;
    height: 500px;
    border-radius: 10px;
    opacity: 0.8;
    position:absolute;
    left: 53%;
    top:60%;
    box-shadow: 0 5px 10px rgb(206, 151, 151);
    transform: translate(-50%,-50%);
}
.avatar_box{
    height: 500px;
    width: 400px;
    margin-top:-10px;
    margin-left: -11px;
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 0 10px white;
    border: 1px solid white;
    .img{
        background: url("../../assets/106449882_p0_master1200.jpg");
        animation: moveImg 7s infinite alternate linear;
        height: 100%;
        width: 100%;
    }
}
/deep/ .el-input__prefix{
    margin-left: -10px;
}
/deep/.el-input__inner{
    border-radius: 30px;
    border: 0px;
    box-shadow: 0 2px pink;
}
/deep/.el-input{
    height: 50px;
    outline: none;
    font-size: 35px;
    border: 0px;
}
.login_form{
    width: 300px;
    height: 200px;
    position: absolute;
    left: 450px;
    top: 100px;
    padding: 0px 20px;
}
bottom{
    font-size: 40px;
}
/deep/.el-button{
    margin-top: 20px;
    font-style: italic;
    font-size: 30px;
    color: pink;
    margin-left: 90px;
}

.text{
    text-align: center;
    font-size: 40px;
    font-style: italic;
    color: transparent;
    background: url('../../assets/A3E6E56333801E4640CA678F83321707.jpg');
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

.w{
    color: transparent;
    background: url('../../assets/A3E6E56333801E4640CA678F83321707.jpg');
    -webkit-background-clip: text;
    animation: moveImg 9s infinite alternate linear;
    font-size: 40px;
    margin-left: 20px;
    margin-top: -50px;
}
</style>>

</style>