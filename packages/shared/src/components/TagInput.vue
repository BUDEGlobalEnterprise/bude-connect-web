<template>
  <div class="space-y-2">
    <Label>{{ label }}</Label>
    
    <div class="flex flex-wrap gap-2 p-3 border rounded-md min-h-[42px]">
      <Badge
        v-for="(tag, index) in tags"
        :key="index"
        variant="secondary"
        class="gap-1"
      >
        {{ tag }}
        <button
          @click="removeTag(index)"
          class="hover:bg-destructive/20 rounded-full p-0.5"
        >
          <X class="h-3 w-3" />
        </button>
      </Badge>
      
      <input
        ref="inputRef"
        v-model="inputValue"
        type="text"
        :placeholder="tags.length === 0 ? placeholder : ''"
        class="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
        @keydown.enter.prevent="addTag"
        @keydown.backspace="handleBackspace"
      />
    </div>
    
    <p class="text-xs text-muted-foreground">
      Press Enter to add tags{{ separator && ` or use "${separator}" to separate` }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { X } from 'lucide-vue-next';

interface Props {
  modelValue?: string[];
  label?: string;
  placeholder?: string;
  separator?: string;
  maxTags?: number;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  label: 'Tags',
  placeholder: 'Add a tag...',
  separator: ',',
  maxTags: 20
});

const emit = defineEmits<{
  'update:modelValue': [tags: string[]];
}>();

const inputRef = ref<HTMLInputElement>();
const inputValue = ref('');
const tags = ref<string[]>([...props.modelValue]);

const addTag = () => {
  let newTags: string[] = [];
  
  if (props.separator) {
    newTags = inputValue.value
      .split(props.separator)
      .map(t => t.trim())
      .filter(t => t.length > 0);
  } else {
    newTags = [inputValue.value.trim()];
  }
  
  for (const tag of newTags) {
    if (tag && !tags.value.includes(tag) && tags.value.length < props.maxTags) {
      tags.value.push(tag);
    }
  }
  
  inputValue.value = '';
  emit('update:modelValue', tags.value);
};

const removeTag = (index: number) => {
  tags.value.splice(index, 1);
  emit('update:modelValue', tags.value);
};

const handleBackspace = (e: KeyboardEvent) => {
  if (inputValue.value === '' && tags.value.length > 0) {
    removeTag(tags.value.length - 1);
  }
};
</script>
