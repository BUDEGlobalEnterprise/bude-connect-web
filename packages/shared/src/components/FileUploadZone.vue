<template>
  <div
    class="relative border-2 border-dashed rounded-lg transition-colors"
    :class="[
      isDragging ? 'border-primary bg-primary/5' : 'border-gray-300',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50'
    ]"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
    @click="!disabled && fileInputRef?.click()"
  >
    <input
      ref="fileInputRef"
      type="file"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      class="hidden"
      @change="handleFileSelect"
    />

    <div class="p-8 text-center">
      <!-- Upload Icon -->
      <div class="mx-auto w-12 h-12 mb-4 text-gray-400">
        <slot name="icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </slot>
      </div>

      <!-- Text -->
      <p class="text-sm text-gray-600 mb-1">
        <span class="font-medium text-primary">Click to upload</span> or drag and drop
      </p>
      <p class="text-xs text-gray-500">
        {{ acceptText }} (max {{ formatFileSize(maxSize) }})
      </p>

      <!-- File List -->
      <div v-if="files.length > 0" class="mt-4 space-y-2" @click.stop>
        <div
          v-for="(file, index) in files"
          :key="index"
          class="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
        >
          <div class="flex items-center gap-2 flex-1 min-w-0">
            <FileIcon :fileType="getFileType(file)" class="w-4 h-4 flex-shrink-0" />
            <span class="truncate">{{ file.name }}</span>
            <span class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</span>
          </div>
          
          <button
            type="button"
            @click="removeFile(index)"
            class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <p v-if="error" class="mt-2 text-xs text-red-500">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  accept?: string;
  maxSize?: number; // in bytes
  multiple?: boolean;
  disabled?: boolean;
  modelValue?: File[];
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*,.pdf,.doc,.docx',
  maxSize: 5 * 1024 * 1024, // 5MB default
  multiple: true,
  disabled: false,
  modelValue: () => []
});

const emit = defineEmits<{
  'update:modelValue': [files: File[]];
  'error': [message: string];
}>();

const fileInputRef = ref<HTMLInputElement>();
const isDragging = ref(false);
const error = ref('');
const files = ref<File[]>([...props.modelValue]);

const acceptText = computed(() => {
  if (props.accept === 'image/*') return 'Images only';
  if (props.accept.includes('.pdf')) return 'PDF, images, and documents';
  return 'Supported files';
});

const handleDragOver = () => {
  if (!props.disabled) isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const handleDrop = (e: DragEvent) => {
  isDragging.value = false;
  if (props.disabled) return;

  const droppedFiles = Array.from(e.dataTransfer?.files || []);
  validateAndAddFiles(droppedFiles);
};

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const selectedFiles = Array.from(target.files || []);
  validateAndAddFiles(selectedFiles);
  target.value = ''; // Reset input
};

const validateAndAddFiles = (newFiles: File[]) => {
  error.value = '';

  for (const file of newFiles) {
    // Size validation
    if (file.size > props.maxSize) {
      error.value = `File "${file.name}" exceeds ${formatFileSize(props.maxSize)}`;
      emit('error', error.value);
      continue;
    }

    // Type validation (basic)
    const acceptTypes = props.accept.split(',').map(t => t.trim());
    const isValidType = acceptTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type);
      }
      if (type.includes('/*')) {
        const baseType = type.split('/')[0];
        return file.type.startsWith(baseType);
      }
      return file.type === type;
    });

    if (!isValidType) {
      error.value = `File type not supported for "${file.name}"`;
      emit('error', error.value);
      continue;
    }

    if (props.multiple) {
      files.value.push(file);
    } else {
      files.value = [file];
    }
  }

  emit('update:modelValue', files.value);
};

const removeFile = (index: number) => {
  files.value.splice(index, 1);
  emit('update:modelValue', files.value);
  error.value = '';
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const getFileType = (file: File): string => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type === 'application/pdf') return 'pdf';
  if (file.type.includes('document') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) return 'document';
  return 'file';
};

// Simple file icon component
const FileIcon = ({ fileType }: { fileType: string }) => {
  const icons = {
    image: '🖼️',
    pdf: '📄',
    document: '📝',
    file: '📎'
  };
  return icons[fileType as keyof typeof icons] || icons.file;
};
</script>
