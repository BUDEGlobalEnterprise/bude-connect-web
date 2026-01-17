import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@bude/shared';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/listing/:id',
      name: 'listing',
      component: () => import('../views/ListingView.vue'),
    },
    {
      path: '/post',
      name: 'post-ad',
      component: () => import('../views/PostAdView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/my-ads',
      name: 'my-ads',
      component: () => import('../views/MyAdsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/seller/:id',
      name: 'seller',
      component: () => import('../views/SellerView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: () => import('../views/WalletView.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

// Navigation guard for auth
router.beforeEach((to, _from, next) => {
  const userStore = useUserStore();
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
