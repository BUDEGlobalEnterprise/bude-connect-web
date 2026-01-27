<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Badge, Button } from '@bude/shared/components';
import { adminApi } from '@bude/shared';

const items = ref<any[]>([]);
const loading = ref(true);
const search = ref('');

const fetchItems = async () => {
  loading.value = true;
  try {
    const res = await adminApi.getListingsList(0, 20, search.value);
    if (res && res.data) {
      items.value = res.data;
    }
  } catch (error) {
    console.error('Failed to fetch items:', error);
  } finally {
    loading.value = false;
  }
};

const disableItem = async (item: any) => {
  const reason = window.prompt("Reason for disabling this listing?");
  if (!reason) return;
  
  try {
    await adminApi.disableListing(item.name, reason);
    item.disabled = 1;
  } catch (error) {
    console.error('Failed to disable listing:', error);
  }
};

onMounted(fetchItems);
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Market Moderation</h1>
        <p class="text-slate-500">Manage marketplace listings and content safety.</p>
      </div>
      <div class="flex items-center gap-4">
        <input 
          v-model="search" 
          @input="fetchItems"
          type="text" 
          placeholder="Search items..." 
          class="px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
    </div>

    <div class="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-slate-50 border-b text-xs font-bold text-slate-500 uppercase tracking-widest">
          <tr>
            <th class="px-6 py-4">Item</th>
            <th class="px-6 py-4">Price</th>
            <th class="px-6 py-4">Owner</th>
            <th class="px-6 py-4">Status</th>
            <th class="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y text-sm">
          <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
            <td colspan="5" class="px-6 py-4 h-16 bg-slate-50/50"></td>
          </tr>
          <tr v-else v-for="item in items" :key="item.name" class="hover:bg-slate-50">
            <td class="px-6 py-4">
              <p class="font-bold text-slate-900">{{ item.item_name }}</p>
              <p class="text-xs text-slate-500 uppercase">{{ item.name }}</p>
            </td>
            <td class="px-6 py-4 font-mono text-slate-700">
              ₹{{ item.standard_rate.toLocaleString() }}
            </td>
            <td class="px-6 py-4 text-slate-500">
              {{ item.owner }}
            </td>
            <td class="px-6 py-4">
              <Badge :variant="item.disabled ? 'danger' : 'success'">
                {{ item.disabled ? 'Disabled' : 'Live' }}
              </Badge>
            </td>
            <td class="px-6 py-4 text-right">
              <Button 
                variant="outline" 
                size="sm"
                @click="disableItem(item)"
                :disabled="item.disabled"
                :class="item.disabled ? 'opacity-50' : 'text-red-500 border-red-100'"
              >
                {{ item.disabled ? 'Moderated' : 'Disable' }}
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && items.length === 0" class="p-12 text-center text-slate-400 italic">
        No listings found.
      </div>
    </div>
  </div>
</template>
