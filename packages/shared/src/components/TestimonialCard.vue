<template>
  <Card>
    <CardHeader>
      <div class="flex items-start gap-3">
        <img v-if="avatar" :src="avatar" :alt="author" class="h-12 w-12 rounded-full" />
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <h4 class="font-semibold">{{ author }}</h4>
            <Badge v-if="verified" variant="default" class="text-xs">
              <Check class="h-3 w-3 mr-1" />
              Verified
            </Badge>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <RatingInput :model-value="rating" readonly size="sm" />
            <span class="text-sm text-muted-foreground">
              {{ formatDate(date) }}
            </span>
          </div>
        </div>
      </div>
    </CardHeader>
    
    <CardContent>
      <blockquote class="border-l-2 border-primary pl-4 italic">
        "{{ quote }}"
      </blockquote>
      
      <p v-if="project" class="text-sm text-muted-foreground mt-3">
        Project: <span class="font-medium">{{ project }}</span>
      </p>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { RatingInput } from './';
import { Check } from 'lucide-vue-next';

interface Props {
  author: string;
  avatar?: string;
  rating: number;
  quote: string;
  date: Date;
  project?: string;
  verified?: boolean;
}

defineProps<Props>();

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};
</script>
