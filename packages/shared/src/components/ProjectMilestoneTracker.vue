<template>
  <Card class="relative overflow-hidden">
    <div class="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" :style="{ width: `${progress}%` }" />
    
    <CardHeader class="pb-3">
      <CardTitle class="text-sm font-medium">Milestones</CardTitle>
    </CardHeader>
    
    <CardContent>
      <div class="space-y-6">
        <div
          v-for="(milestone, index) in milestones"
          :key="index"
          class="relative"
        >
          <!-- Timeline connector -->
          <div
            v-if="index < milestones.length - 1"
            class="absolute left-3 top-8 h-full w-0.5 bg-border"
          />
          
          <div class="flex gap-3">
            <!-- Icon/Status -->
            <div
              :class="[
                'relative z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2',
                milestone.completed
                  ? 'bg-primary border-primary'
                  : milestone.current
                  ? 'bg-background border-primary'
                  : 'bg-background border-border'
              ]"
            >
              <Check v-if="milestone.completed" class="h-3 w-3 text-primary-foreground" />
              <div v-else-if="milestone.current" class="h-2 w-2 rounded-full bg-primary animate-pulse" />
            </div>
            
            <!-- Content -->
            <div class="flex-1 pb-6">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h4 :class="['font-medium', milestone.current && 'text-primary']">
                    {{ milestone.title }}
                  </h4>
                  <p class="text-sm text-muted-foreground mt-0.5">
                    {{ milestone.description }}
                  </p>
                </div>
                
                <Badge v-if="milestone.amount" variant="secondary">
                  ${{ milestone.amount }}
                </Badge>
              </div>
              
              <p v-if="milestone.date" class="text-xs text-muted-foreground mt-2">
                {{ formatDate(milestone.date) }}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-4 pt-4 border-t">
        <div class="flex justify-between text-sm">
          <span class="text-muted-foreground">Overall Progress</span>
          <span class="font-medium">{{ progress }}%</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Check } from 'lucide-vue-next';

export interface Milestone {
  title: string;
  description: string;
  date?: Date;
  amount?: number;
  completed: boolean;
  current?: boolean;
}

interface Props {
  milestones: Milestone[];
}

const props = defineProps<Props>();

const progress = computed(() => {
  const completed = props.milestones.filter(m => m.completed).length;
  return Math.round((completed / props.milestones.length) * 100);
});

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
</script>
