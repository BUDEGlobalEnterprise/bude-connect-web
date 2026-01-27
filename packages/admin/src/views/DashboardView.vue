<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Badge } from '@bude/shared/components';
import { adminApi, type AdminStat, type ActivityItem, type GrowthData } from '@bude/shared';
import { Line as LineChart } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  type ChartData,
  type ChartOptions
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);

const stats = ref<AdminStat[]>([]);
const recentActivities = ref<ActivityItem[]>([]);
const growthData = ref<GrowthData | null>(null);
const loading = ref(true);

const chartData = computed<ChartData<'line'>>(() => {
  if (!growthData.value) return { labels: [], datasets: [] };
  
  return {
    labels: growthData.value.labels,
    datasets: growthData.value.datasets.map((ds, i) => ({
      label: ds.label,
      data: ds.data,
      borderColor: i === 0 ? '#3b82f6' : '#10b981',
      backgroundColor: i === 0 ? '#3b82f644' : '#10b98144',
      tension: 0.4,
      fill: true
    }))
  };
});

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' }
  },
  scales: {
    y: { beginAtZero: true }
  }
};

onMounted(async () => {
  try {
    const [statsRes, activityRes, growthRes] = await Promise.all([
      adminApi.getStats(),
      adminApi.getRecentActivity(),
      adminApi.getGrowthData()
    ]);
    
    if (statsRes) stats.value = statsRes;
    if (activityRes) recentActivities.value = activityRes;
    if (growthRes) growthData.value = growthRes;
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Platform Overview</h1>
      <p class="text-slate-500">Real-time performance metrics for BudeConnect.</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      <div v-for="i in 4" :key="i" class="h-32 bg-slate-200 rounded-2xl"></div>
    </div>

    <!-- Stats Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        v-for="stat in stats" 
        :key="stat.label"
        class="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between mb-4">
          <span class="text-2xl">{{ stat.icon }}</span>
          <Badge :variant="stat.change.startsWith('+') ? 'success' : 'danger'">
            {{ stat.change }}
          </Badge>
        </div>
        <div class="space-y-1">
          <p class="text-sm font-medium text-slate-500">{{ stat.label }}</p>
          <p class="text-3xl font-bold text-slate-900" :class="stat.urgent ? 'text-orange-500' : ''">
            {{ stat.value }}
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Activity Feed -->
      <div class="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div class="p-6 border-b flex items-center justify-between">
          <h3 class="font-bold text-slate-800">Live Activity Feed</h3>
          <button class="text-sm text-primary-500 font-medium">View All</button>
        </div>
        <div v-if="loading" class="p-8 space-y-4">
          <div v-for="i in 3" :key="i" class="h-12 bg-slate-100 rounded-xl animate-pulse"></div>
        </div>
        <div v-else class="divide-y">
          <div v-for="(act, index) in recentActivities" :key="index" class="p-4 flex items-center justify-between hover:bg-slate-50">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 capitalize">
                {{ act.user[0] }}
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-800">{{ act.user }}</p>
                <p class="text-xs text-slate-500">{{ act.action }}</p>
              </div>
            </div>
            <span class="text-xs text-slate-400 font-mono">{{ act.time }}</span>
          </div>
          <div v-if="recentActivities.length === 0" class="p-12 text-center text-slate-400 italic">
            No recent activity recorded.
          </div>
        </div>
      </div>

      <!-- Growth Chart -->
      <div class="bg-white rounded-2xl border shadow-sm p-6 min-h-[400px] flex flex-col">
        <h3 class="font-bold text-slate-800 mb-6">Platform Growth (30 Days)</h3>
        <div class="flex-1 relative">
          <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-slate-50 rounded-xl">
             <div class="animate-pulse text-slate-400">Loading charts...</div>
          </div>
          <LineChart v-else :data="chartData" :options="chartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>
