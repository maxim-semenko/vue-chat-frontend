import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import NotFoundPage from "@/page/NotFoundPage.vue";
import MainPage from "@/page/MainPage.vue";
import MessengerPage from "@/page/messenger/MessengerPage.vue";
import LoginPage from "@/page/auth/LoginPage.vue";
import RegisterPage from "@/page/auth/RegisterPage.vue";
import { LocalStorageUtil } from "@/util/localStorageUtil";

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
        path: '/messenger',
        component: MessengerPage,
        meta: {requiresAuth: true}
    },
    {
        path: '/:pathMatch(.*)*',
        component: NotFoundPage
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    console.log("HELLO WORLD")
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const user = LocalStorageUtil.getAuthorizedUserFromStorage();

    if (requiresAuth && user === null) {
        next('/login');
    } else {
        next();
    }
});

export default router;
