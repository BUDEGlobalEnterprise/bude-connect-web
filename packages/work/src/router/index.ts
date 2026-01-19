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
      path: '/talent',
      name: 'talent-search',
      component: () => import('../views/TalentSearchView.vue'),
    },
    {
      path: '/freelancer/:id',
      name: 'freelancer',
      component: () => import('../views/FreelancerView.vue'),
    },
    {
      path: '/jobs',
      name: 'job-board',
      component: () => import('../views/JobBoardView.vue'),
    },
    {
      path: '/jobs/:id',
      name: 'job-detail',
      component: () => import('../views/JobDetailView.vue'),
    },
    {
      path: '/post-job',
      name: 'post-job',
      component: () => import('../views/PostJobView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/my-jobs',
      name: 'my-jobs',
      component: () => import('../views/MyJobsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/my-bids',
      name: 'my-bids',
      component: () => import('../views/MyBidsView.vue'),
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
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
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
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('../views/ResetPasswordView.vue'),
    },
    {
      path: '/messages',
      name: 'messages',
      component: () => import('../views/MessagesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/kyc',
      name: 'kyc',
      component: () => import('../views/KycView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/verify-email',
      name: 'verify-email',
      component: () => import('../views/VerifyEmailView.vue'),
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
