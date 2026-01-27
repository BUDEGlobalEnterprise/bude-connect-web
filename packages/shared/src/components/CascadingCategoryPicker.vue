<script setup lang="ts">
/**
 * CascadingCategoryPicker
 *
 * Multi-level product category selector powered by Shopify Product Taxonomy.
 * Supports vertical selection, subcategory drilling, breadcrumb navigation, and search.
 *
 * Usage:
 *   <CascadingCategoryPicker v-model="categoryId" @update:selection="onSelect" />
 */
import { ref, watch, onMounted } from 'vue';
import { Search, ChevronRight, ChevronLeft, X } from 'lucide-vue-next';
import { useTaxonomy, type TaxonomySelection } from '../composables/useTaxonomy';

const props = defineProps<{
  modelValue?: string;       // category ID (e.g. "el-1-2")
  placeholder?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [id: string];
  'update:selection': [selection: TaxonomySelection | null];
}>();

const {
  verticals,
  levels,
  breadcrumb,
  isLoading,
  error,
  selectedVertical,
  selectedCategory,
  selection,
  searchQuery,
  searchResults,
  isSearching,
  isSearchMode,
  loadVerticals,
  selectVertical,
  selectSubcategory,
  navigateTo,
  goBack,
  clearSelection,
  setFromCategoryId,
  handleSearch,
  selectSearchResult,
} = useTaxonomy();

const searchInput = ref('');

// Load verticals on mount
onMounted(async () => {
  await loadVerticals();
  // If there's an existing value, load it
  if (props.modelValue) {
    await setFromCategoryId(props.modelValue);
  }
});

// Sync modelValue prop -> internal state
watch(() => props.modelValue, async (newVal) => {
  if (newVal && newVal !== selectedCategory.value?.id) {
    await setFromCategoryId(newVal);
  }
});

// Emit when selection changes
watch(selection, (sel) => {
  if (sel) {
    emit('update:modelValue', sel.id);
    emit('update:selection', sel);
  }
});

function onSearchInput(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  searchInput.value = val;
  handleSearch(val);
}

function onSearchResultClick(result: any) {
  searchInput.value = '';
  selectSearchResult(result);
}

function onClear() {
  clearSelection();
  searchInput.value = '';
  emit('update:modelValue', '');
  emit('update:selection', null);
}
</script>

<template>
  <div class="cascading-category-picker">
    <!-- Selected display / Search input -->
    <div class="relative">
      <div class="flex items-center gap-2 border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus-within:border-primary-400 transition-colors">
        <Search class="w-4 h-4 text-gray-400 shrink-0" />

        <!-- If we have a selection, show it -->
        <div v-if="selection && !searchInput" class="flex items-center gap-1 flex-1 min-w-0">
          <span class="text-sm text-gray-900 truncate">{{ selection.path }}</span>
          <button
            @click.stop="onClear"
            class="ml-auto shrink-0 p-0.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Search input -->
        <input
          v-else
          type="text"
          :value="searchInput"
          @input="onSearchInput"
          :placeholder="placeholder || 'Search or browse categories...'"
          class="flex-1 text-sm outline-none bg-transparent min-w-0"
        />
      </div>

      <!-- Search results dropdown -->
      <div
        v-if="isSearchMode && (searchResults.length > 0 || isSearching)"
        class="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
      >
        <div v-if="isSearching" class="px-4 py-3 text-sm text-gray-500">Searching...</div>
        <button
          v-for="result in searchResults"
          :key="result.id"
          @click="onSearchResultClick(result)"
          class="w-full text-left px-4 py-2.5 hover:bg-primary-50 text-sm transition-colors"
        >
          <span class="font-medium text-gray-900">{{ result.name }}</span>
          <span class="text-gray-400 text-xs block mt-0.5">{{ result.full_name }}</span>
        </button>
      </div>
    </div>

    <!-- Category browser -->
    <div v-if="!isSearchMode" class="mt-3">

      <!-- Breadcrumb -->
      <div v-if="breadcrumb.length > 0" class="flex items-center gap-1 mb-3 flex-wrap">
        <button
          @click="goBack"
          class="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
        >
          <ChevronLeft class="w-3.5 h-3.5" />
          All
        </button>
        <template v-for="(crumb, i) in breadcrumb" :key="crumb.id">
          <ChevronRight class="w-3 h-3 text-gray-300" />
          <button
            @click="navigateTo(i)"
            :class="[
              'text-xs font-medium transition-colors',
              i === breadcrumb.length - 1 ? 'text-gray-900' : 'text-primary-600 hover:text-primary-700'
            ]"
          >
            {{ crumb.name }}
          </button>
        </template>
      </div>

      <!-- Verticals grid (when no vertical selected) -->
      <div v-if="!selectedVertical" class="grid grid-cols-3 sm:grid-cols-4 gap-2">
        <button
          v-for="v in verticals"
          :key="v.id"
          @click="selectVertical(v)"
          class="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-gray-100 hover:border-primary-300 hover:bg-primary-50 transition-all text-center group"
        >
          <span class="text-2xl group-hover:scale-110 transition-transform">{{ v.icon }}</span>
          <span class="text-xs font-medium text-gray-700 leading-tight">{{ v.name }}</span>
        </button>
      </div>

      <!-- Subcategory lists (levels) -->
      <div v-else>
        <!-- Show latest level of children -->
        <div
          v-if="levels.length > 0"
          class="space-y-1 max-h-56 overflow-y-auto"
        >
          <button
            v-for="cat in levels[levels.length - 1]"
            :key="cat.id"
            @click="selectSubcategory(cat, levels.length - 1)"
            :class="[
              'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-left transition-all',
              selectedCategory?.id === cat.id
                ? 'bg-primary-50 text-primary-700 font-medium border border-primary-200'
                : 'hover:bg-gray-50 text-gray-700'
            ]"
          >
            <span class="truncate">{{ cat.name }}</span>
            <ChevronRight
              v-if="cat.children && cat.children.length > 0"
              class="w-4 h-4 text-gray-400 shrink-0"
            />
          </button>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="flex items-center justify-center py-6">
          <div class="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    </div>

    <!-- Error -->
    <p v-if="error" class="mt-2 text-xs text-red-500">{{ error }}</p>
  </div>
</template>
