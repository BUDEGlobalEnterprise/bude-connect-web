<template>
  <div class="flex items-start gap-3">
    <!-- Avatar -->
    <img
      v-if="avatarUrl"
      :src="avatarUrl"
      :alt="userName"
      class="h-10 w-10 rounded-full flex-shrink-0"
    />
    <div v-else class="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
      <span class="text-sm font-medium">{{ userInitials }}</span>
    </div>
    
    <!-- Content -->
    <div class="flex-1 space-y-2">
      <Textarea
        v-model="comment"
        :placeholder="placeholder"
        :rows="rows"
        class="min-h-[80px]"
      />
      
      <div class="flex items-center justify-between gap-2">
        <div class="flex gap-1">
          <Button variant="ghost" size="icon" title="Add emoji">
            <Smile class="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Attach file">
            <Paperclip class="h-4 w-4" />
          </Button>
        </div>
        
        <div class="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            @click="$emit('cancel')"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            :disabled="!comment.trim() || isSubmitting"
            @click="handleSubmit"
          >
            {{ isSubmitting ? 'Posting...' : submitLabel }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,computed } from 'vue';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Smile, Paperclip } from 'lucide-vue-next';

interface Props {
  userName: string;
  avatarUrl?: string;
  placeholder?: string;
  rows?: number;
  submitLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Write a comment...',
  rows: 3,
  submitLabel: 'Post'
});

const emit = defineEmits<{
  submit: [comment: string];
  cancel: [];
}>();

const comment = ref('');
const isSubmitting = ref(false);

const userInitials = computed(() => {
  return props.userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const handleSubmit = async () => {
  if (!comment.value.trim()) return;
  
  isSubmitting.value = true;
  try {
    emit('submit', comment.value);
    comment.value = '';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
