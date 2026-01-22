<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent>
      <div class="space-y-4">
        <div class="flex items-start gap-4">
          <div
            :class="[
              'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full',
              variant === 'danger' ? 'bg-red-100' : 'bg-yellow-100'
            ]"
          >
            <AlertTriangle :class="['h-5 w-5', variant === 'danger' ? 'text-red-600' : 'text-yellow-600']" />
          </div>
          
          <div class="flex-1">
            <h3 class="text-lg font-semibold">
              {{ title }}
            </h3>
            <p class="text-sm text-muted-foreground mt-1">
              {{ description }}
            </p>
          </div>
        </div>
        
        <div class="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            @click="handleCancel"
            :disabled="loading"
          >
            {{ cancelText }}
          </Button>
          <Button
            :variant="variant === 'danger' ? 'destructive' : 'default'"
            @click="handleConfirm"
            :disabled="loading"
          >
            {{ loading ? 'Processing...' : confirmText }}
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { AlertTriangle } from 'lucide-vue-next';

interface Props {
  open?: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
  onConfirm?: () => void | Promise<void>;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  title: 'Are you sure?',
  description: 'This action cannot be undone.',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'default'
});

const emit = defineEmits<{
  'update:open': [value: boolean];
  'confirm': [];
  'cancel': [];
}>();

const loading = ref(false);

const handleOpenChange = (value: boolean) => {
  if (!loading.value) {
    emit('update:open', value);
  }
};

const handleConfirm = async () => {
  if (props.onConfirm) {
    loading.value = true;
    try {
      await props.onConfirm();
      emit('confirm');
      emit('update:open', false);
    } finally {
      loading.value = false;
    }
  } else {
    emit('confirm');
    emit('update:open', false);
  }
};

const handleCancel = () => {
  emit('cancel');
  emit('update:open', false);
};
</script>
