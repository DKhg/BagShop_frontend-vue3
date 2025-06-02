import Home from '@/pages/Home.vue'
import Login from '@/pages/Login.vue'
import Cart from '@/pages/Cart.vue'
import Order from '@/pages/Order.vue'
import Orders from '@/pages/Orders.vue'
import Join from '@/pages/Join.vue'
import Profile from '@/pages/Profile.vue'
import {createRouter, createWebHistory} from 'vue-router';

//route 설정 배열
const routes = [
    {path:'/', component: Home},
    {path:'/login', component: Login},
    {path:'/cart', component: Cart},
    {path:'/order', component: Order},
    {path:'/orders', component: Orders},
    {path:'/join', component: Join},
    {path:'/profile', component: Profile},
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;