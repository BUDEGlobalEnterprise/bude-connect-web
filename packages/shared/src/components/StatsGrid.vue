<template>
  <div class="grid gap-4" :class="gridClass">
    <Card
      v-for="(stat, index) in stats"
      :key="index"
      class="relative overflow-hidden transition-all hover:shadow-lg"
    >
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium text-muted-foreground">
          {{ stat.label }}
        </CardTitle>
        <component
          v-if="stat.icon"
          :is="stat.icon"
          :class="['h-4 w-4', stat.iconColor || 'text-muted-foreground']"
        />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{{ stat.value }}</div>
        <div v-if="stat.trend || stat.description" class="mt-1 flex items-center gap-2 text-xs">
          <span
            v-if="stat.trend"
            :class="[
              'flex items-center gap-1',
              stat.trend > 0 ? 'text-green-600' : stat.trend < 0 ? 'text-red-600' : 'text-gray-600'
            ]"
          >
            <TrendingUp v-if="stat.trend > 0" class="h-3 w-3" />
            <TrendingDown v-if="stat.trend < 0" class="h-3 w-3" />
            <span>{{ Math.abs(stat.trend) }}%</span>
          </span>
          <span class="text-muted-foreground">{{ stat.description }}</span>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, TrendingDown } from 'lucide-vue-next';
import type { Component } from 'vue';

export interface Stat {
  label: string;
  value: string | number;
  trend?: number;
  description?: string;
  icon?: Component;
  iconColor?: string;
}

interface Props {
  stats: Stat[];
  columns?: 1 | 2 | 3 | 4;
}

const props = withDefaults(defineProps<Props>(), {
  columns: 3
});

const gridClass = computed(() => {
  const cols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };
  return cols[props.columns];
});
</script>
