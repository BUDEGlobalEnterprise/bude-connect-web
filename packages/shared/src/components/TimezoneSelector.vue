<template>
  <div class="space-y-2">
    <Label>{{ label }}</Label>
    <div class="relative">
      <Input
        :model-value="displayValue"
        type="text"
        :placeholder="placeholder"
        readonly
        @click="isOpen = !isOpen"
        class="cursor-pointer"
      />
      
      <div
        v-if="isOpen"
        class="absolute z-50 w-full mt-2 bg-background border rounded-md shadow-lg p-2 space-y-2"
        @click.stop
      >
        <Input
          v-model="searchQuery"
          placeholder="Search timezone..."
          class="mb-2"
        />
        
        <div class="max-h-60 overflow-y-auto space-y-1">
          <button
            v-for="tz in filteredTimezones"
            :key="tz.value"
            class="w-full text-left px-3 py-2 text-sm rounded hover:bg-accent"
            @click="selectTimezone(tz)"
          >
            <div class="font-medium">{{ tz.label }}</div>
            <div class="text-xs text-muted-foreground">{{ tz.offset }}</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Label } from './ui/label';
import { Input } from './ui/input';

export interface Timezone {
  label: string;
  value: string;
  offset: string;
}

interface Props {
  modelValue?: string;
  label?: string;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Timezone',
  placeholder: 'Select timezone...'
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const isOpen = ref(false);
const searchQuery = ref('');

const timezones: Timezone[] = [
  { label: 'Pacific Time (PT)', value: 'America/Los_Angeles', offset: 'UTC-8' },
  { label: 'Mountain Time (MT)', value: 'America/Denver', offset: 'UTC-7' },
  { label: 'Central Time (CT)', value: 'America/Chicago', offset: 'UTC-6' },
  { label: 'Eastern Time (ET)', value: 'America/New_York', offset: 'UTC-5' },
  { label: 'Greenwich Mean Time (GMT)', value: 'Europe/London', offset: 'UTC+0' },
  { label: 'Central European Time (CET)', value: 'Europe/Paris', offset: 'UTC+1' },
  { label: 'India Standard Time (IST)', value: 'Asia/Kolkata', offset: 'UTC+5:30' },
  { label: 'China Standard Time (CST)', value: 'Asia/Shanghai', offset: 'UTC+8' },
  { label: 'Japan Standard Time (JST)', value: 'Asia/Tokyo', offset: 'UTC+9' },
  { label: 'Australian Eastern Time (AEST)', value: 'Australia/Sydney', offset: 'UTC+10' }
];

const filteredTimezones = computed(() => {
  if (!searchQuery.value) return timezones;
  
  const query = searchQuery.value.toLowerCase();
  return timezones.filter(tz =>
    tz.label.toLowerCase().includes(query) ||
    tz.value.toLowerCase().includes(query)
  );
});

const displayValue = computed(() => {
  const selected = timezones.find(tz => tz.value === props.modelValue);
  return selected ? `${selected.label} (${selected.offset})` : '';
});

const selectTimezone = (tz: Timezone) => {
  emit('update:modelValue', tz.value);
  isOpen.value = false;
};
</script>
