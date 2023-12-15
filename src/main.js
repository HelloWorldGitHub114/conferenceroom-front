import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "./axios"
import './assets/icon/iconfont.css'
import "./permission"
import "./assets/blur_el-dialog__wrapper.css"

import VueParticles from 'vue-particles'
Vue.use(VueParticles)

Vue.use(VueAxios, axios)
Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
