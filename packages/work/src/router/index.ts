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
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore();
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
