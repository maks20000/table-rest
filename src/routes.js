import VueRouter from 'vue-router'
import Table from './components/table.vue'
export default new VueRouter({
    routes:[
        {
            path: '/',
            component: Table
        }
    ]
})

