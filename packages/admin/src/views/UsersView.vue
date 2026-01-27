<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Badge, Button } from '@bude/shared/components';
import { adminApi } from '@bude/shared';

const users = ref<any[]>([]);
const loading = ref(true);
const search = ref('');

const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await adminApi.getUsersList(0, 20, search.value);
    if (res && res.data) {
      users.value = res.data;
    }
  } catch (error) {
    console.error('Failed to fetch users:', error);
  } finally {
    loading.value = false;
  }
};

const toggleStatus = async (user: any) => {
  const newStatus = !user.enabled;
  try {
    await adminApi.toggleUserStatus(user.name, newStatus);
    user.enabled = newStatus ? 1 : 0;
  } catch (error) {
    console.error('Failed to toggle user status:', error);
  }
};

onMounted(fetchUsers);
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">User Management</h1>
        <p class="text-slate-500">Monitor and manage platform users.</p>
      </div>
      <div class="flex items-center gap-4">
        <input 
          v-model="search" 
          @input="fetchUsers"
          type="text" 
          placeholder="Search by name..." 
          class="px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
        />
        <Button variant="primary">Add Admin</Button>
      </div>
    </div>

    <div class="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-slate-50 border-b text-xs font-bold text-slate-500 uppercase tracking-widest">
          <tr>
            <th class="px-6 py-4">User</th>
            <th class="px-6 py-4">Status</th>
            <th class="px-6 py-4">Created</th>
            <th class="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y text-sm">
          <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
            <td colspan="4" class="px-6 py-4 h-16 bg-slate-50/50"></td>
          </tr>
          <tr v-else v-for="user in users" :key="user.name" class="hover:bg-slate-50">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                  {{ user.full_name[0] }}
                </div>
                <div>
                  <p class="font-bold text-slate-900">{{ user.full_name }}</p>
                  <p class="text-xs text-slate-500">{{ user.email }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <Badge :variant="user.enabled ? 'success' : 'danger'">
                {{ user.enabled ? 'Active' : 'Disabled' }}
              </Badge>
            </td>
            <td class="px-6 py-4 text-slate-500">
              {{ new Date(user.creation).toLocaleDateString() }}
            </td>
            <td class="px-6 py-4 text-right">
              <Button 
                variant="outline" 
                size="sm"
                @click="toggleStatus(user)"
                :class="user.enabled ? 'text-red-500 border-red-100' : 'text-green-500 border-green-100'"
              >
                {{ user.enabled ? 'Disable' : 'Enable' }}
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && users.length === 0" class="p-12 text-center text-slate-400 italic">
        No users found.
      </div>
    </div>
  </div>
</template>
