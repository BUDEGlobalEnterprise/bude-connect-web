<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFavoritesStore } from '../stores/favorites';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

const props = withDefaults(defineProps<{
  referenceDoctype: string;
  referenceName: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'overlay' | 'inline';
}>(), {
  size: 'md',
  variant: 'overlay',
});

const emit = defineEmits<{
  (e: 'toggled', isFavorited: boolean): void;
}>();

const favoritesStore = useFavoritesStore();
const userStore = useUserStore();
const router = useRouter();

const isToggling = ref(false);

const isFavorited = computed(() =>
  favoritesStore.isFavorited(props.referenceDoctype, props.referenceName)
);

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'w-7 h-7';
    case 'lg': return 'w-10 h-10';
    default: return 'w-8 h-8';
  }
});

const iconSize = computed(() => {
  switch (props.size) {
    case 'sm': return 'w-3.5 h-3.5';
    case 'lg': return 'w-5 h-5';
    default: return 'w-4 h-4';
  }
});

async function handleToggle() {
  if (!userStore.isLoggedIn) {
    router.push('/login');
    return;
  }

  if (isToggling.value) return;
  isToggling.value = true;

  try {
    const result = await favoritesStore.toggleFavorite(
      props.referenceDoctype,
      props.referenceName
    );
    emit('toggled', result);
  } catch {
    // Store handles rollback
  } finally {
    isToggling.value = false;
  }
}
</script>

<template>
  <button
    type="button"
    :class="[
      sizeClasses,
      'rounded-full flex items-center justify-center transition-all duration-200',
      variant === 'overlay'
        ? 'bg-white/90 backdrop-blur-sm shadow-md hover:bg-white hover:scale-110'
        : 'hover:bg-gray-100',
      isToggling ? 'opacity-60 pointer-events-none' : '',
    ]"
    :aria-label="isFavorited ? 'Remove from favorites' : 'Add to favorites'"
    @click.prevent.stop="handleToggle"
  >
    <!-- Filled heart (favorited) -->
    <svg
      v-if="isFavorited"
      :class="[iconSize, 'text-red-500']"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
    <!-- Outline heart (not favorited) -->
    <svg
      v-else
      :class="[iconSize, 'text-gray-400 hover:text-red-500 transition-colors']"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  </button>
</template>
