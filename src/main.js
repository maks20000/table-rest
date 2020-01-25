import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueRouter from "vue-router"
import store from './store'
import router from './routes'


Vue.use(VueRouter, VueAxios, axios); 
new Vue({
  el: '#app',
  store, router,
  render: h => h(App)
})
