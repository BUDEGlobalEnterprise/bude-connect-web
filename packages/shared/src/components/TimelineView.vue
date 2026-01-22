<template>
  <div class="relative">
    <!-- Timeline Line -->
    <div
      :class="[
        'absolute top-0 bottom-0',
        orientation === 'vertical' ? 'left-4 w-0.5' : 'top-4 left-0 right-0 h-0.5',
        'bg-border'
      ]"
    />

    <!-- Timeline Items -->
    <div
      :class="[
        'space-y-8',
        orientation === 'horizontal' && 'flex gap-8'
      ]"
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        class="relative"
      >
        <!-- Icon/Marker -->
        <div
          :class="[
            'absolute z-10 flex items-center justify-center rounded-full bg-background border-2',
            orientation === 'vertical' ? 'left-0 w-8 h-8' : 'top-0 w-8 h-8',
            item.variant === 'primary' ? 'border-primary bg-primary/10' : 'border-border'
          ]"
        >
          <component
            v-if="item.icon"
            :is="item.icon"
            :class="[
              'w-4 h-4',
              item.variant === 'primary' ? 'text-primary' : 'text-muted-foreground'
            ]"
          />
          <div
            v-else
            :class="[
              'w-2 h-2 rounded-full',
              item.variant === 'primary' ? 'bg-primary' : 'bg-muted-foreground'
            ]"
          />
        </div>

        <!-- Content Card -->
        <div
          :class="[
            orientation === 'vertical' ? 'ml-12' : 'mt-12',
            'group'
          ]"
        >
          <Card :class="['transition-shadow', item.variant === 'primary' && 'border-primary']">
            <CardHeader class="pb-3">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <CardTitle class="text-base">{{ item.title }}</CardTitle>
                  <p v-if="item.subtitle" class="text-sm text-muted-foreground mt-1">
                    {{ item.subtitle }}
                  </p>
                </div>
                <Badge v-if="item.badge" :variant="item.variant === 'primary' ? 'default' : 'secondary'">
                  {{ item.badge }}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent v-if="item.description || item.details" class="pt-0">
              <p v-if="item.description" class="text-sm">{{ item.description }}</p>
              
              <ul v-if="item.details && item.details.length > 0" class="mt-2 space-y-1">
                <li
                  v-for="(detail, i) in item.details"
                  :key="i"
                  class="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span class="text-primary mt-1">•</span>
                  <span>{{ detail }}</span>
                </li>
              </ul>
            </CardContent>
            
            <CardContent v-if="item.date || item.location" class="pt-2 border-t">
              <div class="flex gap-4 text-xs text-muted-foreground">
                <span v-if="item.date" class="flex items-center gap-1">
                  <Calendar class="w-3 h-3" />
                  {{ item.date }}
                </span>
                <span v-if="item.location" class="flex items-center gap-1">
                  <MapPin class="w-3 h-3" />
                  {{ item.location }}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, MapPin } from 'lucide-vue-next';
import type { Component } from 'vue';

export interface TimelineItem {
  title: string;
  subtitle?: string;
  description?: string;
  details?: string[];
  date?: string;
  location?: string;
  badge?: string;
  icon?: Component;
  variant?: 'default' | 'primary';
}

interface Props {
  items: TimelineItem[];
  orientation?: 'vertical' | 'horizontal';
}

withDefaults(defineProps<Props>(), {
  orientation: 'vertical'
});
</script>
