/**
 * useTaxonomy - Vue composable for product taxonomy navigation.
 *
 * Manages multi-level category selection with lazy-loaded children,
 * breadcrumb tracking, and search.
 */

import { ref, computed, watch } from 'vue';
import {
  getTaxonomyVerticals,
  getTaxonomyChildren,
  getTaxonomyCategory,
  searchTaxonomy,
  type TaxonomyVertical,
  type TaxonomyCategory,
} from '../api/taxonomy';

export interface TaxonomySelection {
  id: string;
  name: string;
  path: string;        // "Electronics > Computers > Laptops"
  verticalId: string;  // "el"
  verticalName: string; // "Electronics"
}

export function useTaxonomy() {
  // ── State ─────────────────────────────────────────────────────────
  const verticals = ref<TaxonomyVertical[]>([]);
  const levels = ref<TaxonomyCategory[][]>([]);  // levels[0] = vertical children, levels[1] = next level, etc.
  const breadcrumb = ref<{ id: string; name: string }[]>([]);
  const isLoading = ref(false);
  const searchQuery = ref('');
  const searchResults = ref<TaxonomyCategory[]>([]);
  const isSearching = ref(false);
  const error = ref('');

  // Current selection state
  const selectedVertical = ref<TaxonomyVertical | null>(null);
  const selectedCategory = ref<TaxonomyCategory | null>(null);

  // ── Computed ──────────────────────────────────────────────────────
  const selection = computed<TaxonomySelection | null>(() => {
    if (!selectedCategory.value) return null;

    const cat = selectedCategory.value;
    return {
      id: cat.id,
      name: cat.name,
      path: cat.full_name,
      verticalId: selectedVertical.value?.id || '',
      verticalName: selectedVertical.value?.name || '',
    };
  });

  const hasSelection = computed(() => !!selectedCategory.value);
  const isSearchMode = computed(() => searchQuery.value.length >= 2);

  // ── Methods ───────────────────────────────────────────────────────

  /** Load top-level verticals */
  async function loadVerticals() {
    if (verticals.value.length > 0) return;

    isLoading.value = true;
    error.value = '';
    try {
      verticals.value = await getTaxonomyVerticals();
    } catch (e: any) {
      error.value = e.message || 'Failed to load categories';
    } finally {
      isLoading.value = false;
    }
  }

  /** Select a vertical and load its children */
  async function selectVertical(vertical: TaxonomyVertical) {
    selectedVertical.value = vertical;
    selectedCategory.value = null;
    breadcrumb.value = [{ id: vertical.id, name: vertical.name }];
    levels.value = [];
    searchQuery.value = '';

    isLoading.value = true;
    try {
      const children = await getTaxonomyChildren(vertical.id);
      if (children.length > 0) {
        levels.value = [children];
      } else {
        // Vertical has no subcategories - select it directly
        selectedCategory.value = {
          id: vertical.id,
          name: vertical.name,
          full_name: vertical.name,
          level: 0,
          parent_id: null,
          children: [],
        };
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to load subcategories';
    } finally {
      isLoading.value = false;
    }
  }

  /** Select a subcategory at a given depth level */
  async function selectSubcategory(category: TaxonomyCategory, levelIndex: number) {
    // Trim breadcrumb and levels to current depth
    breadcrumb.value = breadcrumb.value.slice(0, levelIndex + 1);
    breadcrumb.value.push({ id: category.id, name: category.name });
    levels.value = levels.value.slice(0, levelIndex + 1);

    // Always set selected category to the latest click
    selectedCategory.value = category;

    // Load children if this category has any
    if (category.children && category.children.length > 0) {
      isLoading.value = true;
      try {
        const children = await getTaxonomyChildren(category.id);
        if (children.length > 0) {
          levels.value.push(children);
        }
      } catch (e: any) {
        error.value = e.message || 'Failed to load subcategories';
      } finally {
        isLoading.value = false;
      }
    }
  }

  /** Navigate back to a breadcrumb level */
  function navigateTo(index: number) {
    if (index === 0 && selectedVertical.value) {
      // Going back to vertical level - reload children
      selectVertical(selectedVertical.value);
    } else {
      breadcrumb.value = breadcrumb.value.slice(0, index + 1);
      levels.value = levels.value.slice(0, index);
      selectedCategory.value = null;
    }
  }

  /** Go back to vertical selection */
  function goBack() {
    if (levels.value.length > 0 || selectedVertical.value) {
      selectedVertical.value = null;
      selectedCategory.value = null;
      breadcrumb.value = [];
      levels.value = [];
      searchQuery.value = '';
    }
  }

  /** Clear entire selection */
  function clearSelection() {
    selectedVertical.value = null;
    selectedCategory.value = null;
    breadcrumb.value = [];
    levels.value = [];
    searchQuery.value = '';
    searchResults.value = [];
  }

  /** Set selection from a known category ID (for loading existing data) */
  async function setFromCategoryId(categoryId: string) {
    if (!categoryId) return;

    isLoading.value = true;
    try {
      const cat = await getTaxonomyCategory(categoryId);
      if (!cat) return;

      selectedCategory.value = cat;

      // Set vertical from prefix
      const prefix = categoryId.split('-')[0];
      await loadVerticals();
      const vertical = verticals.value.find(v => v.id === prefix);
      if (vertical) {
        selectedVertical.value = vertical;
      }

      // Set breadcrumb
      breadcrumb.value = cat.breadcrumb || [{ id: cat.id, name: cat.name }];
    } catch (e: any) {
      error.value = e.message || 'Failed to load category';
    } finally {
      isLoading.value = false;
    }
  }

  /** Search categories */
  let searchTimeout: ReturnType<typeof setTimeout>;
  async function handleSearch(query: string) {
    searchQuery.value = query;
    clearTimeout(searchTimeout);

    if (query.length < 2) {
      searchResults.value = [];
      isSearching.value = false;
      return;
    }

    isSearching.value = true;
    searchTimeout = setTimeout(async () => {
      try {
        searchResults.value = await searchTaxonomy(query, 10);
      } catch {
        searchResults.value = [];
      } finally {
        isSearching.value = false;
      }
    }, 300);
  }

  /** Select a search result */
  async function selectSearchResult(category: TaxonomyCategory) {
    searchQuery.value = '';
    searchResults.value = [];
    await setFromCategoryId(category.id);
  }

  return {
    // State
    verticals,
    levels,
    breadcrumb,
    isLoading,
    error,
    selectedVertical,
    selectedCategory,
    searchQuery,
    searchResults,
    isSearching,
    isSearchMode,

    // Computed
    selection,
    hasSelection,

    // Methods
    loadVerticals,
    selectVertical,
    selectSubcategory,
    navigateTo,
    goBack,
    clearSelection,
    setFromCategoryId,
    handleSearch,
    selectSearchResult,
  };
}
