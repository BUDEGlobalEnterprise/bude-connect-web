import { createRouter, createWebHistory } from 'vue-router';
import AdminLayout from '../layouts/AdminLayout.vue';
import DashboardView from '../views/DashboardView.vue';
import KYCView from '../views/KYCView.vue';
import UsersView from '../views/UsersView.vue';
import MarketModerationView from '../views/MarketModerationView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AdminLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView,
        },
        {
          path: 'kyc',
          name: 'kyc-auditor',
          component: KYCView,
        },
        {
          path: 'users',
          name: 'user-management',
          component: UsersView,
        },
        {
          path: 'market',
          name: 'market-moderation',
          component: MarketModerationView,
        },
      ],
    },
  ],
});

export default router;
