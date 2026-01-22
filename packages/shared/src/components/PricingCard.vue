<template>
  <Card :class="['relative', featured && 'border-primary border-2']">
    <div v-if="featured" class="absolute -top-3 left-1/2 -translate-x-1/2">
      <Badge class="bg-primary">{{ featuredLabel }}</Badge>
    </div>
    
    <CardHeader class="text-center pb-4">
      <CardTitle class="text-2xl">{{ title }}</CardTitle>
      <div class="mt-2">
        <span class="text-4xl font-bold">{{ price }}</span>
        <span class="text-muted-foreground">{{ period }}</span>
      </div>
      <p v-if="description" class="text-sm text-muted-foreground mt-2">
        {{ description }}
      </p>
    </CardHeader>
    
    <CardContent class="space-y-4">
      <ul class="space-y-2">
        <li
          v-for="(feature, index) in features"
          :key="index"
          class="flex items-start gap-2 text-sm"
        >
          <Check :class="['h-4 w-4 mt-0.5 flex-shrink-0', feature.included ? 'text-primary' : 'text-muted-foreground']" />
          <span :class="!feature.included && 'text-muted-foreground line-through'">
            {{ feature.text }}
          </span>
        </li>
      </ul>
      
      <Button
        :variant="featured ? 'default' : 'outline'"
        class="w-full"
        @click="$emit('select')"
      >
        {{ ctaText }}
      </Button>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Check } from 'lucide-vue-next';

export interface PricingFeature {
  text: string;
  included: boolean;
}

interface Props {
  title: string;
  price: string | number;
  period?: string;
  description?: string;
  features: PricingFeature[];
  featured?: boolean;
  featuredLabel?: string;
  ctaText?: string;
}

withDefaults(defineProps<Props>(), {
  period: '/month',
  featured: false,
  featuredLabel: 'Popular',
  ctaText: 'Get Started'
});

defineEmits<{
  select: [];
}>();
</script>
