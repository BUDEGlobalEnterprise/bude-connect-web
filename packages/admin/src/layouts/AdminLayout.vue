<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { Button } from '@bude/shared/components';

const sidebarOpen = ref(true);

const navItems = [
  { name: 'Dashboard', path: '/', icon: '📊' },
  { name: 'KYC Auditor', path: '/kyc', icon: '🆔' },
  { name: 'User Management', path: '/users', icon: '👥' },
  { name: 'Market Moderation', path: '/market', icon: '🛍️' },
];
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <aside 
      class="bg-slate-900 text-white transition-all duration-300 flex flex-col"
      :class="sidebarOpen ? 'w-64' : 'w-20'"
    >
      <div class="p-6 flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center font-bold text-lg">B</div>
        <span v-if="sidebarOpen" class="font-bold text-xl tracking-tight">Admin Portal</span>
      </div>

      <nav class="flex-1 px-4 py-4 space-y-2">
        <RouterLink 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-4 px-4 py-3 rounded-xl transition-all hover:bg-white/10"
          active-class="bg-primary-500/20 text-primary-400 border-l-4 border-primary-500"
        >
          <span class="text-xl">{{ item.icon }}</span>
          <span v-if="sidebarOpen" class="font-medium">{{ item.name }}</span>
        </RouterLink>
      </nav>

      <div class="p-4 border-t border-white/10">
        <button @click="sidebarOpen = !sidebarOpen" class="w-full text-center py-2 text-white/50 hover:text-white">
          {{ sidebarOpen ? '← Collapse' : '→' }}
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Header -->
      <header class="h-16 bg-white border-b flex items-center justify-between px-8 shrink-0">
        <h2 class="text-lg font-semibold text-slate-800 uppercase tracking-widest text-xs">Platform Oversight</h2>
        <div class="flex items-center gap-4">
          <span class="text-sm text-slate-500">System Administrator</span>
          <div class="w-8 h-8 rounded-full bg-slate-200"></div>
        </div>
      </header>

      <!-- Scrollable Area -->
      <div class="flex-1 overflow-y-auto p-8">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.router-link-active {
  background-color: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
}
</style>
