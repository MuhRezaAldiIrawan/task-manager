import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
// import './style.css'

// Import components
import LoginPage from './components/LoginPage.vue'
import TasksPage from './components/TasksPage.vue'

// Router setup
const routes = [
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
        meta: { requiresGuest: true }
    },
    {
        path: '/',
        name: 'Tasks',
        component: TasksPage,
        meta: { requiresAuth: true }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')

    if (to.meta.requiresAuth && !token) {
        next('/login')
    } else if (to.meta.requiresGuest && token) {
        next('/')
    } else {
        next()
    }
})

const app = createApp(App)
app.use(router)
app.mount('#app')