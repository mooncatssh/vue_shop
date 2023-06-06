import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
/* 导入全局样式表 */
import './assets/css/global.css'
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
/* 配置请求的根路径 */
axios.defaults.baseURL='http://43.143.0.76:8889/api/private/v1'
axios.interceptors.request.use(config=>{
  console.log(config)
  config.headers.Authorization =window.sessionStorage.getItem('token')
  /* 最后必须return config */
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table',TreeTable)
/* 过滤器 */
Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 +'').padStart(2,'0')
  const d =(dt.getDate() + '').padStart(2, '0')

  const hh =(dt.getHours() + '').padStart(2, '0')
  const mm =(dt.getMinutes() + '').padStart(2, '0')
  const ss =(dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  el:'#app',
  router,
  render: h => h(App),
  beforeCreate() {
    //此时这个this就是vm，只不过这个时候还并没有去解析模版
    Vue.prototype.$bus = this;
  }
})
