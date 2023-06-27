import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js' 
/* 导入全局样式表 */
import './assets/css/global.css'
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
/* 导入富文本编辑器 */
import VueQuillEditor from 'vue-quill-editor'
/* 导入富文本编辑器对应的样式 */
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
/* 导入NProgress 包对应的js和css */
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
/* 配置请求的根路径 */
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
/* 在request 拦截器中，展示进度条 */
axios.interceptors.request.use(config=>{
 /*  console.log(config) */
 NProgress.start()
  config.headers.Authorization =window.sessionStorage.getItem('token')
  /* 最后必须return config */
  return config
})
axios.interceptors.response.use(config=>{
  NProgress.done()
  return config
})
/* 在response 拦截器中，隐藏进度条 */
Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)
/* 将富文本注册为全局可用的组件 */
Vue.use(VueQuillEditor)
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
