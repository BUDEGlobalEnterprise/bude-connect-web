<script setup lang="ts">
import { formatPrice } from "@bude/shared/utils";
import { Button, Badge } from "@bude/shared/components";

const props = defineProps<{
  package: {
    id: string;
    name: string;
    credits: number;
    price: number;
    discount_percent?: number;
  };
}>();

const emit = defineEmits<{ buy: [id: string] }>();
</script>

<template>
  <div class="card p-4 flex items-center justify-between">
    <div>
      <h3 class="font-medium text-gray-900">{{ package.name }}</h3>
      <p class="text-2xl font-bold text-primary-600">
        {{ package.credits }} Credits
      </p>
      <Badge v-if="package.discount_percent" variant="success" size="sm">
        Save {{ package.discount_percent }}%
      </Badge>
    </div>
    <Button @click="emit('buy', package.id)">{{
      formatPrice(package.price)
    }}</Button>
  </div>
</template>
