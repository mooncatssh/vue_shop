import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  routes:[
  {path:'/',redirect:'/login'},
  {path:'/login',component: login},
  {path:'/home',component:home}
  ]
})

/* 挂载路由守卫 */
router.beforeEach((to,from,next)=>{
  //to 将要访问的路径
  //from 从哪个路径来的
  // next 是个函数，表示放行
  // next() 放行     next('/login') 强制跳转
  if(to.path =='/login') return next();
  //获取token
  const tokenStr=window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login');
  next();

})
export default router
