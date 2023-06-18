import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import MainPage from "@/page/MainPage.vue";
import ChatPage from "@/page/chat/ChatPage.vue";
import LoginPage from "@/page/auth/LoginPage.vue";
import RegisterPage from "@/page/auth/RegisterPage.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: MainPage
    },
    {
        path: '/login',
        component: LoginPage
    },
    {
        path: '/register',
        component: RegisterPage
    },
    {
        path: '/chat',
        component: ChatPage
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;