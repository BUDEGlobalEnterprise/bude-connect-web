<script setup lang="ts">
import Icon from './Icon.vue';

defineProps<{
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
  iconBg?: string;
  trend?: 'up' | 'down' | 'neutral';
}>();
</script>

<template>
  <div class="bg-card border border-gray-100 rounded-xl p-6 hover:shadow-md transition-all duration-200">
    <div class="flex items-start justify-between">
      <div class="space-y-2">
        <p class="text-sm font-medium text-muted-foreground">{{ title }}</p>
        <p class="text-2xl font-bold text-foreground tracking-tight">{{ value }}</p>

        <!-- Change indicator -->
        <div v-if="change !== undefined" class="flex items-center gap-1.5">
          <span
            :class="[
              'inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-md',
              trend === 'up' && 'bg-success-50 text-success-600',
              trend === 'down' && 'bg-destructive/10 text-destructive',
              (!trend || trend === 'neutral') && 'bg-gray-100 text-gray-600',
            ]"
          >
            <Icon
              v-if="trend === 'up'"
              name="trending-up"
              size="xs"
            />
            <Icon
              v-else-if="trend === 'down'"
              name="trending-down"
              size="xs"
            />
            {{ change > 0 ? '+' : '' }}{{ change }}%
          </span>
          <span v-if="changeLabel" class="text-xs text-muted-foreground">
            {{ changeLabel }}
          </span>
        </div>
      </div>

      <!-- Icon -->
      <div
        v-if="icon"
        :class="[
          'p-3 rounded-xl',
          iconBg || 'bg-primary-50 text-primary-600',
        ]"
      >
        <Icon :name="icon" size="lg" />
      </div>
    </div>
  </div>
</template>
