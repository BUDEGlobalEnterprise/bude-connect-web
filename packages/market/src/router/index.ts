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
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('../views/OnboardingView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/oauth/callback',
      name: 'oauth-callback',
      component: () => import('../views/OAuthCallbackView.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordView.vue'),
    },
  ],
});

// Navigation guard for auth and onboarding
router.beforeEach((to, _from, next) => {
  const userStore = useUserStore();
  
  // Check if route requires auth
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({ name: 'login', query: { redirect: to.fullPath } });
    return;
  }
  
  // Check if user needs onboarding (newly registered, no profile complete)
  const isOnboardingComplete = localStorage.getItem('onboarding_complete') === 'true';
  const isOnboardingSkipped = localStorage.getItem('onboarding_skipped') === 'true';
  
  if (
    userStore.isLoggedIn &&
    !isOnboardingComplete &&
    !isOnboardingSkipped &&
    !userStore.user?.full_name &&
    to.name !== 'onboarding' &&
    to.name !== 'login' &&
    to.name !== 'oauth-callback'
  ) {
    next({ name: 'onboarding' });
    return;
  }
  
  next();
});

export default router;
