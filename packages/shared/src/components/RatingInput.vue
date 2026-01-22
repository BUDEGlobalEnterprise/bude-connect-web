<template>
  <div class="flex items-center gap-1">
    <button
      v-for="star in maxRating"
      :key="star"
      type="button"
      :disabled="readonly"
      :class="[
        'transition-all',
        readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded'
      ]"
      @click="!readonly && setRating(star)"
      @mouseenter="!readonly && setHoverRating(star)"
      @mouseleave="!readonly && setHoverRating(0)"
    >
      <Star
        :class="[
          'transition-colors',
          getStarClass(star)
        ]"
        :fill="shouldFillStar(star) ? 'currentColor' : 'none'"
        :size="size === 'sm' ? 16 : size === 'lg' ? 32 : 20"
      />
    </button>
    
    <span v-if="showValue" class="ml-2 text-sm text-muted-foreground">
      {{ displayValue }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Star } from 'lucide-vue-next';

interface Props {
  modelValue?: number;
  maxRating?: number;
  readonly?: boolean;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  precision?: number; // 0.5 for half stars, 1 for full stars
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  maxRating: 5,
  readonly: false,
  showValue: false,
  size: 'md',
  precision: 1
});

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

const hoverRating = ref(0);

const displayValue = computed(() => {
  const value = hoverRating.value || props.modelValue;
  return `${value.toFixed(1)} / ${props.maxRating}`;
});

const setRating = (star: number) => {
  let newRating = star;
  
  // If precision is 0.5, allow half stars
  if (props.precision === 0.5) {
    // If clicking same star, toggle to half
    if (Math.ceil(props.modelValue) === star && props.modelValue !== star) {
      newRating = star;
    } else if (props.modelValue === star) {
      newRating = star - 0.5;
    } else {
      newRating = star;
    }
  }
  
  emit('update:modelValue', newRating);
};

const setHoverRating = (star: number) => {
  hoverRating.value = star;
};

const shouldFillStar = (star: number): boolean => {
  const rating = hoverRating.value || props.modelValue;
  return star <= rating;
};

const getStarClass = (star: number): string => {
  const rating = hoverRating.value || props.modelValue;
  
  if (star <= rating) {
    return 'text-yellow-400';
  }
  
  if (props.readonly) {
    return 'text-gray-300';
  }
  
  return 'text-gray-300 hover:text-yellow-400';
};
</script>
