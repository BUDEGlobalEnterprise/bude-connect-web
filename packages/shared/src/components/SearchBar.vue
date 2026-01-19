<template>
  <div class="search-bar" :class="{ focused: isFocused }">
    <div class="search-input-container">
      <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        ref="inputRef"
        v-model="query"
        type="text"
        :placeholder="placeholder"
        class="search-input"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter="handleEnter"
        @keydown.escape="closeSuggestions"
        @keydown.down.prevent="navigateSuggestions(1)"
        @keydown.up.prevent="navigateSuggestions(-1)"
      />
      <button
        v-if="query"
        class="clear-button"
        @mousedown.prevent="clearQuery"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Suggestions Dropdown -->
    <div
      v-if="showSuggestions && (suggestions.length > 0 || isLoading || recentSearches.length > 0)"
      class="suggestions-dropdown"
    >
      <!-- Loading -->
      <div v-if="isLoading" class="suggestion-loading">
        <div class="loading-spinner"></div>
        <span>Searching...</span>
      </div>

      <!-- Suggestions -->
      <template v-else-if="suggestions.length > 0">
        <div
          v-for="(suggestion, index) in suggestions"
          :key="suggestion.name"
          class="suggestion-item"
          :class="{ active: selectedIndex === index }"
          @mousedown.prevent="selectSuggestion(suggestion)"
          @mouseenter="selectedIndex = index"
        >
          <img
            v-if="suggestion.image"
            :src="suggestion.image"
            :alt="suggestion.item_name"
            class="suggestion-image"
          />
          <div v-else class="suggestion-image-placeholder">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="suggestion-info">
            <h4 class="suggestion-name">{{ suggestion.item_name }}</h4>
            <p class="suggestion-category">{{ suggestion.item_group }}</p>
          </div>
          <span v-if="suggestion.standard_rate" class="suggestion-price">
            {{ formatPrice(suggestion.standard_rate) }}
          </span>
        </div>
      </template>

      <!-- Recent Searches (when no query) -->
      <template v-else-if="!query && recentSearches.length > 0">
        <div class="suggestions-header">
          <span>Recent Searches</span>
          <button @mousedown.prevent="clearRecentSearches" class="text-xs text-primary-600">
            Clear
          </button>
        </div>
        <div
          v-for="(search, index) in recentSearches"
          :key="search"
          class="suggestion-item recent"
          :class="{ active: selectedIndex === index }"
          @mousedown.prevent="useRecentSearch(search)"
          @mouseenter="selectedIndex = index"
        >
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ search }}</span>
        </div>
      </template>

      <!-- No Results -->
      <div v-else-if="query && !isLoading" class="suggestion-empty">
        No results found for "{{ query }}"
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { frappe } from '../api/client';

interface SearchSuggestion {
  name: string;
  item_name: string;
  item_group: string;
  image?: string;
  standard_rate?: number;
}

const props = withDefaults(defineProps<{
  placeholder?: string;
  autofocus?: boolean;
}>(), {
  placeholder: 'Search items...',
  autofocus: false,
});

const emit = defineEmits<{
  (e: 'search', query: string): void;
  (e: 'select', item: SearchSuggestion): void;
}>();

const router = useRouter();
const inputRef = ref<HTMLInputElement | null>(null);

// State
const query = ref('');
const suggestions = ref<SearchSuggestion[]>([]);
const isLoading = ref(false);
const isFocused = ref(false);
const showSuggestions = ref(false);
const selectedIndex = ref(-1);
const recentSearches = ref<string[]>([]);

// Debounce timer
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

// Load recent searches from localStorage
function loadRecentSearches() {
  try {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      recentSearches.value = JSON.parse(saved).slice(0, 5);
    }
  } catch (e) {
    // Ignore
  }
}

function saveRecentSearch(search: string) {
  if (!search.trim()) return;

  const searches = recentSearches.value.filter(s => s !== search);
  searches.unshift(search);
  recentSearches.value = searches.slice(0, 5);

  try {
    localStorage.setItem('recent_searches', JSON.stringify(recentSearches.value));
  } catch (e) {
    // Ignore
  }
}

function clearRecentSearches() {
  recentSearches.value = [];
  localStorage.removeItem('recent_searches');
}

function useRecentSearch(search: string) {
  query.value = search;
  handleSearch();
}

async function fetchSuggestions() {
  if (!query.value || query.value.length < 2) {
    suggestions.value = [];
    return;
  }

  isLoading.value = true;

  try {
    // Use Frappe's built-in search
    const results = await frappe.call<SearchSuggestion[]>(
      'frappe.client.get_list',
      {
        doctype: 'Item',
        filters: {
          custom_status: 'Published',
          item_name: ['like', `%${query.value}%`]
        },
        fields: ['name', 'item_name', 'item_group', 'image', 'standard_rate'],
        order_by: 'modified desc',
        limit: 8
      }
    );

    suggestions.value = results || [];
  } catch (e) {
    console.error('Search failed:', e);
    suggestions.value = [];
  } finally {
    isLoading.value = false;
  }
}

function handleInput() {
  selectedIndex.value = -1;

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    fetchSuggestions();
  }, 300);
}

function handleFocus() {
  isFocused.value = true;
  showSuggestions.value = true;
}

function handleBlur() {
  isFocused.value = false;
  // Delay hiding to allow click on suggestions
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
}

function handleEnter() {
  if (selectedIndex.value >= 0 && suggestions.value[selectedIndex.value]) {
    selectSuggestion(suggestions.value[selectedIndex.value]);
  } else if (query.value.trim()) {
    handleSearch();
  }
}

function handleSearch() {
  if (!query.value.trim()) return;

  saveRecentSearch(query.value.trim());
  emit('search', query.value.trim());
  closeSuggestions();

  // Navigate to search results
  router.push({ path: '/', query: { search: query.value.trim() } });
}

function selectSuggestion(item: SearchSuggestion) {
  saveRecentSearch(item.item_name);
  emit('select', item);
  closeSuggestions();

  // Navigate to listing
  router.push(`/listing/${item.name}`);
}

function closeSuggestions() {
  showSuggestions.value = false;
  selectedIndex.value = -1;
}

function clearQuery() {
  query.value = '';
  suggestions.value = [];
  inputRef.value?.focus();
}

function navigateSuggestions(direction: number) {
  const items = suggestions.value.length > 0
    ? suggestions.value
    : (query.value ? [] : recentSearches.value);

  if (items.length === 0) return;

  selectedIndex.value += direction;

  if (selectedIndex.value < 0) {
    selectedIndex.value = items.length - 1;
  } else if (selectedIndex.value >= items.length) {
    selectedIndex.value = 0;
  }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

onMounted(() => {
  loadRecentSearches();
  if (props.autofocus) {
    inputRef.value?.focus();
  }
});

onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
});
</script>

<style scoped>
.search-bar {
  position: relative;
  width: 100%;
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.625rem 2.5rem 0.625rem 2.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  background: #fff;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
  color: #9ca3af;
}

.clear-button {
  position: absolute;
  right: 0.75rem;
  padding: 0.25rem;
  color: #9ca3af;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  transition: color 0.15s, background 0.15s;
}

.clear-button:hover {
  color: #6b7280;
  background: #f3f4f6;
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 50;
  max-height: 400px;
  overflow-y: auto;
}

.suggestions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  border-bottom: 1px solid #f3f4f6;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.15s;
}

.suggestion-item:hover,
.suggestion-item.active {
  background: #f9fafb;
}

.suggestion-item.recent {
  font-size: 0.875rem;
  color: #4b5563;
}

.suggestion-image {
  width: 3rem;
  height: 3rem;
  object-fit: cover;
  border-radius: 0.5rem;
  flex-shrink: 0;
}

.suggestion-image-placeholder {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 0.5rem;
  flex-shrink: 0;
}

.suggestion-info {
  flex: 1;
  min-width: 0;
}

.suggestion-name {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestion-category {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.125rem;
}

.suggestion-price {
  font-size: 0.875rem;
  font-weight: 600;
  color: #3b82f6;
  flex-shrink: 0;
}

.suggestion-loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.suggestion-empty {
  padding: 1.5rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
}
</style>
