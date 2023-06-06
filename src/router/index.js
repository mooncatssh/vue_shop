import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/users/login.vue'
import home from '../components/users/home.vue'
import welcome from '../components/users/welcome.vue'
import users from '../components/users/users.vue'
import rights from '../components/power/rights.vue'
import roles from '../components/power/roles.vue'
import cate from '../components/goods/cate.vue'
import params from '../components/goods/params.vue'
import list from '../components/goods/list.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  routes:[
  {path:'/',redirect:'/login'},
  {path:'/login',component: login},
  {
    path:'/home',
    component:home,
    redirect:'/wlcome',
    children:[{path:'/wlcome',component:welcome},
    {path:'/users',component:users,},
    {path:'/rights',component:rights},
    {path:'/roles',component:roles},
    {path:'/categories',component:cate},
    {path:'/params',component:params},
    {path:'/goods',component:list}
  ]
  },
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
