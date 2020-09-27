import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'

Vue.use(VueRouter)


const router = new VueRouter({
    routes: [

        {
            path: '/',
            component: Login
        }, {
            path: '/login',
            component: Login
        }, {
            path: '/home',
            component: Home
        }

    ]
})

// 权限控制
router.beforeEach((to, form, next) => {

    if (to.path === '/login') {
        return next()
    }
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) {
        return next('/Login')
    }

    next()
})
export default router