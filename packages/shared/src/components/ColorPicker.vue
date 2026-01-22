<template>
  <div class="space-y-2">
    <Label v-if="label">{{ label }}</Label>
    
    <div class="grid grid-cols-4 gap-2">
      <button
        v-for="color in colorPalette"
        :key="color"
        :class="[
          'h-10 rounded border-2 transition-all',
          selectedColor === color
            ? 'border-foreground ring-2 ring-primary ring-offset-2'
            : 'border-border hover:border-foreground'
        ]"
        :style="{ backgroundColor: color }"
        @click="selectColor(color)"
        :title="color"
      />
    </div>
    
    <div class="flex gap-2">
      <Input
        :model-value="selectedColor"
        type="text"
        placeholder="#000000"
        @update:model-value="handleManualInput"
        class="flex-1"
      />
      <input
        :value="selectedColor"
        type="color"
        @input="handleColorPicker"
        class="w-12 h-10 rounded border cursor-pointer"
      />
    </div>
    
    <div v-if="presets.length > 0" class="pt-2 border-t">
      <p class="text-xs text-muted-foreground mb-2">Presets</p>
      <div class="flex flex-wrap gap-1">
        <button
          v-for="preset in presets"
          :key="preset.name"
          class="px-2 py-1 text-xs rounded border hover:bg-accent"
          @click="selectColor(preset.color)"
        >
          {{ preset.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Label } from './ui/label';
import { Input } from './ui/input';

export interface ColorPreset {
  name: string;
  color: string;
}

interface Props {
  modelValue?: string;
  label?: string;
  presets?: ColorPreset[];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '#000000',
  presets: () => [
    { name: 'Primary', color: '#3b82f6' },
    { name: 'Success', color: '#22c55e' },
    { name: 'Warning', color: '#f59e0b' },
    { name: 'Danger', color: '#ef4444' }
  ]
});

const emit = defineEmits<{
  'update:modelValue': [color: string];
}>();

const colorPalette = [
  '#000000', '#ffffff', '#f3f4f6', '#e5e7eb',
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6',
  '#6366f1', '#8b5cf6', '#ec4899', '#06b6d4',
  '#14b8a6', '#84cc16', '#f97316', '#737373'
];

const selectedColor = ref(props.modelValue);

const selectColor = (color: string) => {
  selectedColor.value = color;
  emit('update:modelValue', color);
};

const handleManualInput = (value: string) => {
  if (/^#[0-9A-F]{6}$/i.test(value)) {
    selectColor(value);
  }
};

const handleColorPicker = (e: Event) => {
  const target = e.target as HTMLInputElement;
  selectColor(target.value);
};
</script>
