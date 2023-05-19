<template>
    <!-- 头部区域 -->
    <div class="beijin">
  <el-container class="home-container">
      <el-header style="height: 130px;">
        <div>
          <div class="header-left1">
            <span>cxy</span>
          </div>
          <div class="header-left2">
            <span><a href="http://localhost:8080/#/home" style="color:rgb(205, 221, 221); text-decoration:none"><i class="el-icon-s-home"></i> 首页</a></span>
            <br>
            <span><a href="#" style="color:rgb(205, 221, 221); text-decoration:none"><i class="el-icon-s-cooperation"></i> ..</a></span>
          </div>
        </div>
        <span class="h1">首先我不是萝莉控</span>
        <el-button type="info" @click="logout">登出</el-button>
      </el-header>
      <!-- 页面主题区域 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px':'200px'">
          <div class="toggle-button" @click="toggleCollapse">S S S</div>
          <!-- 侧边栏菜单区域 -->
          <div v-show="imgopen" class="img1">
            <img src="../assets/QQ图片20230515185419.png">
            <br>
            <div @click="miao"><span class="h2">喵酱</span></div>
          </div>
      <el-menu  active-text-color="pink" :unique-opened="true" :collapse="isCollapse" 
      :collapse-transition="false" :router="true">
        <el-submenu  v-for="item in menulist" :key="item.id" 
        :index="'/'+item.path" :default-active="activePath">
          <!-- 一级菜单 -->
          <template slot="title">
           <!--图标 -->
          <i :class="iconsObej[item.id]"></i>
          <!-- 文本 -->
          <span class="h3">{{ item.authName}}</span>
          </template>
          <!--二级菜单 -->
          <el-menu-item v-for="subitem in item.children" :key="subitem.id"  
          :index="'/'+subitem.path" @click="saveNavState('/'+subitem.path )">
            <template slot="title">
           <!--图标 -->
          <i class="el-icon-s-help"></i>
          <!-- 文本 -->
          <span class="h3">{{ subitem.authName }}</span>
            </template>

          </el-menu-item>
        
      </el-submenu>
    </el-menu>
        </el-aside>
        <!-- 中间栏 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
</el-container>
    </div>
</template>

<script>
export default {
    name:'home',
    data(){
        return{
          //左侧菜单赋值
          menulist:[],
          iconsObej:{
            '125':'el-icon-s-custom',
            '103':'el-icon-s-cooperation',
            '101':'el-icon-s-goods',
            '102':'el-icon-s-order',
            '145':'el-icon-s-marketing'
          },
          imgopen:true,
          isCollapse:false,
          //未被激活的链接
          activePath:''
        }
    },
    created(){
      this.getMenuList();
      this.activePath =window.sessionStorage.getItem('activePath');
    },
    methods:{
        logout(){
            window.sessionStorage.clear();
            this.$router.push('/login');
        },
        /* 获取所有的菜单 */
        async getMenuList(){
            const {data:res}= await this.$http.get('menus')
            if(res.meta.status!==200) return this.$message.error('res.meta.msg')
            this.menulist =res.data
            console.log(res) 

        },
        toggleCollapse(){
          this.imgopen=!this.imgopen
          this.isCollapse= !this.isCollapse
        },
        //保存链接的激活状态
        saveNavState(activePath){
          window.sessionStorage.setItem('activePath',activePath);
          this.activePath =activePath
        },
        miao(){
          this.$router.push('')
        }
    }
}
</script>

<style lang="less" scoped>
.beijin{
  height: 100%;
  background-image: url('../assets/D1D9BAE0A3A57FA1DE014A57D52E9990.jpg');
  background-size: cover;
  overflow:auto;
}
.home-container{
  margin: 0 auto;
  width: 80%;
  height: 100%;
}
.el-header{
  display: flex;
  justify-content: space-between;
  background-image: url('../assets/106449882_p0_master1200.jpg');
  background-size: cover;
  padding-left: 30px;
  align-items: center;
}
.header-left1{
  width: 150px;
  height: 65px;
  background-color: rgb(168, 77, 77);
  color:white;
  span{
    position: relative;
    left: 20px;
    top:-25px;
    padding-top:10px;
    font-style: italic;
    font-size: 70px;
  }
}
.header-left2{
  width: 150px;
  height: 65px;
  background-color: rgb(78, 57, 57);
  span{
    position: relative;
    left: 10px;
    top:5px;
    padding-top:10px;
    font-size: 20px;
  }
}
.h1{
  width: 1000px;
  margin-right: 400px;
  font-size: 60px;
  float:left;
  color: rgb(73, 95, 128);
}
.img1{
  margin: 0 auto;
  width: 200px;
  height: 250px;
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
img{
  width: 150px;
  height: 200px;
  margin: 0 auto;
  /* background-image: url('../assets/QQ图片20230515185419.png');
  background-size: cover; */
}
.h2{
  font-size: 40px;
  color: rgb(188, 109, 147);
  cursor: pointer;
}
/deep/ .el-submenu{
  border-radius: 20px;
}
.el-submenu :hover{
  background-color: pink;
}
/deep/ .el-menu{
  border-right: none;
  active-text-color:"pink";
  overflow:hidden;//去掉滚动条
  border-radius: 20px;
  position: relative;
  margin: 0 auto;
  opacity: 0.44;//透明度
}
.h3{
  font-style: italic;
  font-size: 30px;
  color:aqua;
}
.el-aside{
  z-index: 0;
  background-image: url('../assets/E396051FBDDC7132E0F665EF14BE939E.png');
  background-size: cover;
}
.toggle-button{
  font-size: 40px;
  line-height: 20px;
  color: aqua;
  text-align: center;
  height: 20px;
  border-radius: 30px;
  background-color: yellow;
  cursor: pointer;//鼠标小手
}
.el-main{
  background-color: antiquewhite;
}
</style>