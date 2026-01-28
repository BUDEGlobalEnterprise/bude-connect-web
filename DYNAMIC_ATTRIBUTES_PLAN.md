# Dynamic Attributes Implementation Plan

**Date:** 2026-01-28
**Goal:** Make post/add forms dynamic based on Shopify Product Taxonomy attributes
**File:** `packages/shared/src/data/taxonomy/en/taxonomy.json` (955k lines)

---

## 📋 Overview

Transform the static item posting form into a **dynamic, category-driven** form that shows relevant attributes based on the selected category from the Shopify taxonomy.

**Key Features:**
- ✅ Category selection shows relevant attributes
- ✅ Attributes rendered as appropriate input types (text, select, multi-select, etc.)
- ✅ Form validation based on attribute types
- ✅ Search/filter categories (955k lines → need efficient lookup)
- ✅ Mobile-friendly attribute input

---

## 🏗️ Architecture

### 1. Data Layer

**File:** `packages/shared/src/composables/useTaxonomy.ts` (already exists)

**Enhance with:**
```typescript
interface TaxonomyCategory {
  id: string;
  name: string;
  full_name: string;
  level: number;
  parent_id: string | null;
  attributes: TaxonomyAttribute[];
  children: { id: string; name: string }[];
  ancestors: { id: string; name: string }[];
}

interface TaxonomyAttribute {
  id: string;
  name: string;
  handle: string;
  description: string;
  extended: boolean;
  values?: string[];  // Pre-defined values if applicable
  input_type?: 'text' | 'select' | 'multi-select' | 'number' | 'boolean';
}

// New composable functions
export function useTaxonomy() {
  const categories = ref<Map<string, TaxonomyCategory>>(new Map());

  // Load taxonomy on mount (use lazy loading for large file)
  async function loadTaxonomy() { ... }

  // Get category by ID
  function getCategory(id: string): TaxonomyCategory | null { ... }

  // Get attributes for category
  function getAttributesForCategory(categoryId: string): TaxonomyAttribute[] { ... }

  // Search categories by name
  function searchCategories(query: string): TaxonomyCategory[] { ... }

  // Get breadcrumb path
  function getCategoryPath(categoryId: string): TaxonomyCategory[] { ... }

  return { categories, loadTaxonomy, getCategory, getAttributesForCategory, searchCategories, getCategoryPath };
}
```

---

### 2. UI Components

#### A. **CategoryPicker.vue** (Enhanced)

**Current:** `CascadingCategoryPicker.vue` exists but basic

**Enhance:**
```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTaxonomy } from '@bude/shared/composables';

const { categories, searchCategories, getCategoryPath } = useTaxonomy();

const searchQuery = ref('');
const selectedCategoryId = ref<string | null>(null);
const breadcrumb = computed(() =>
  selectedCategoryId.value ? getCategoryPath(selectedCategoryId.value) : []
);

// Search with debounce
const searchResults = computed(() =>
  searchQuery.value.length >= 2
    ? searchCategories(searchQuery.value).slice(0, 20)
    : []
);

function selectCategory(categoryId: string) {
  selectedCategoryId.value = categoryId;
  emit('select', categoryId);
}
</script>

<template>
  <div class="category-picker">
    <!-- Search Input -->
    <Input
      v-model="searchQuery"
      placeholder="Search categories (e.g., 'Pet Supplies', 'Electronics')..."
      class="mb-4"
    />

    <!-- Breadcrumb (selected path) -->
    <div v-if="breadcrumb.length" class="breadcrumb">
      <span v-for="(cat, i) in breadcrumb" :key="cat.id">
        {{ cat.name }}
        <span v-if="i < breadcrumb.length - 1"> > </span>
      </span>
    </div>

    <!-- Search Results -->
    <div v-if="searchResults.length" class="search-results">
      <div
        v-for="category in searchResults"
        :key="category.id"
        @click="selectCategory(category.id)"
        class="result-item"
      >
        <span class="full-name">{{ category.full_name }}</span>
        <span class="attr-count">{{ category.attributes.length }} attributes</span>
      </div>
    </div>
  </div>
</template>
```

---

#### B. **DynamicAttributeInput.vue** (New)

**Purpose:** Render appropriate input based on attribute type

```vue
<script setup lang="ts">
import { computed } from 'vue';
import type { TaxonomyAttribute } from '@bude/shared/types';

interface Props {
  attribute: TaxonomyAttribute;
  modelValue: any;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const inputComponent = computed(() => {
  switch (props.attribute.input_type) {
    case 'select':
      return 'Select';
    case 'multi-select':
      return 'MultiSelect';
    case 'number':
      return 'InputNumber';
    case 'boolean':
      return 'Checkbox';
    default:
      return 'Input';
  }
});
</script>

<template>
  <div class="attribute-field">
    <label class="font-medium">
      {{ attribute.name }}
      <span v-if="attribute.description" class="text-xs text-gray-500">
        ({{ attribute.description }})
      </span>
    </label>

    <!-- Text Input -->
    <Input
      v-if="attribute.input_type === 'text'"
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event)"
      :placeholder="`Enter ${attribute.name.toLowerCase()}`"
    />

    <!-- Select Dropdown -->
    <Select
      v-else-if="attribute.input_type === 'select' && attribute.values"
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <option value="">Select {{ attribute.name }}</option>
      <option v-for="value in attribute.values" :key="value" :value="value">
        {{ value }}
      </option>
    </Select>

    <!-- Multi-Select (Tags) -->
    <TagInput
      v-else-if="attribute.input_type === 'multi-select'"
      :model-value="modelValue || []"
      @update:model-value="emit('update:modelValue', $event)"
      :placeholder="`Add ${attribute.name.toLowerCase()}`"
    />

    <!-- Number Input -->
    <Input
      v-else-if="attribute.input_type === 'number'"
      type="number"
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <!-- Boolean Checkbox -->
    <Checkbox
      v-else-if="attribute.input_type === 'boolean'"
      :checked="!!modelValue"
      @update:checked="emit('update:modelValue', $event)"
    />
  </div>
</template>
```

---

#### C. **PostItemView.vue** (Enhanced)

**Current Location:** `packages/market/src/views/PostItemView.vue`

**New Structure:**
```vue
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useTaxonomy } from '@bude/shared/composables';
import CategoryPicker from '@bude/shared/components/CategoryPicker.vue';
import DynamicAttributeInput from '@bude/shared/components/DynamicAttributeInput.vue';

const { getAttributesForCategory } = useTaxonomy();

// Step 1: Basic Info
const formData = ref({
  title: '',
  description: '',
  price: null,
  condition: 'New',
  listingType: 'Sell',
  images: [],

  // Step 2: Category Selection
  categoryId: null,

  // Step 3: Dynamic Attributes
  attributes: {} as Record<string, any>
});

// Get attributes for selected category
const categoryAttributes = computed(() =>
  formData.value.categoryId
    ? getAttributesForCategory(formData.value.categoryId)
    : []
);

// Watch category change → reset attributes
watch(() => formData.value.categoryId, (newCat, oldCat) => {
  if (newCat !== oldCat) {
    formData.value.attributes = {};
  }
});

// Validation
const isStep1Valid = computed(() =>
  formData.value.title && formData.value.description && formData.value.price
);

const isStep2Valid = computed(() => !!formData.value.categoryId);

const isStep3Valid = computed(() => {
  // All required attributes filled
  return categoryAttributes.value
    .filter(attr => attr.required)
    .every(attr => formData.value.attributes[attr.handle]);
});

async function submitListing() {
  const payload = {
    item_name: formData.value.title,
    description: formData.value.description,
    standard_rate: formData.value.price,
    custom_condition: formData.value.condition,
    custom_listing_type: formData.value.listingType,

    // Taxonomy
    custom_taxonomy_category_id: formData.value.categoryId,
    custom_attributes: JSON.stringify(formData.value.attributes),

    images: formData.value.images
  };

  await marketApi.createListing(payload);
  // Redirect to listing page
}
</script>

<template>
  <div class="post-item-view">
    <h1>Post New Item</h1>

    <!-- Multi-Step Form -->
    <div class="steps-indicator">
      <Step :active="currentStep === 1" :complete="currentStep > 1">Basic Info</Step>
      <Step :active="currentStep === 2" :complete="currentStep > 2">Category</Step>
      <Step :active="currentStep === 3" :complete="currentStep > 3">Details</Step>
    </div>

    <!-- Step 1: Basic Info -->
    <div v-if="currentStep === 1" class="step-content">
      <Input v-model="formData.title" label="Title" required />
      <Textarea v-model="formData.description" label="Description" required />
      <Input v-model="formData.price" type="number" label="Price" required />
      <Select v-model="formData.condition" label="Condition">
        <option value="New">New</option>
        <option value="Like New">Like New</option>
        <option value="Good">Good</option>
        <option value="Fair">Fair</option>
      </Select>
      <FileUploadZone v-model="formData.images" :max-files="10" />

      <Button @click="currentStep = 2" :disabled="!isStep1Valid">
        Next: Select Category
      </Button>
    </div>

    <!-- Step 2: Category Selection -->
    <div v-else-if="currentStep === 2" class="step-content">
      <CategoryPicker
        v-model="formData.categoryId"
        @select="(id) => { formData.categoryId = id; currentStep = 3; }"
      />

      <div class="step-actions">
        <Button variant="outline" @click="currentStep = 1">Back</Button>
        <Button @click="currentStep = 3" :disabled="!isStep2Valid">
          Next: Add Details
        </Button>
      </div>
    </div>

    <!-- Step 3: Dynamic Attributes -->
    <div v-else-if="currentStep === 3" class="step-content">
      <h2>Product Details</h2>
      <p class="text-gray-600 mb-4">
        Fill in the details specific to your product category
      </p>

      <!-- Render Dynamic Attributes -->
      <div v-if="categoryAttributes.length" class="attributes-grid">
        <DynamicAttributeInput
          v-for="attribute in categoryAttributes"
          :key="attribute.id"
          :attribute="attribute"
          v-model="formData.attributes[attribute.handle]"
        />
      </div>

      <div v-else class="empty-state">
        <p>No additional attributes for this category</p>
      </div>

      <div class="step-actions">
        <Button variant="outline" @click="currentStep = 2">Back</Button>
        <Button
          variant="gradient"
          @click="submitListing"
          :disabled="!isStep3Valid"
          :loading="isSubmitting"
        >
          Publish Listing
        </Button>
      </div>
    </div>
  </div>
</template>
```

---

## 🗄️ Backend Changes

### 1. Add Taxonomy Fields to Item DocType

```json
{
  "doctype": "Item",
  "fields": [
    {
      "fieldname": "custom_taxonomy_category_id",
      "fieldtype": "Data",
      "label": "Taxonomy Category ID",
      "length": 200
    },
    {
      "fieldname": "custom_taxonomy_category_name",
      "fieldtype": "Data",
      "label": "Category Name",
      "length": 200,
      "read_only": 1
    },
    {
      "fieldname": "custom_attributes",
      "fieldtype": "Long Text",
      "label": "Product Attributes (JSON)"
    }
  ]
}
```

### 2. Backend Validation

```python
# backend/bude_core/bude_core/market/item.py
import json

@frappe.whitelist()
def create_listing(item_data: dict):
    """Create item with taxonomy validation"""

    # Parse taxonomy category
    category_id = item_data.get("custom_taxonomy_category_id")
    attributes_json = item_data.get("custom_attributes", "{}")
    attributes = json.loads(attributes_json)

    # Validate category exists in taxonomy
    # (In production, load taxonomy file or cache it)

    # Create Item doc
    item = frappe.get_doc({
        "doctype": "Item",
        "item_code": generate_item_code(),
        "item_name": item_data["item_name"],
        "description": item_data["description"],
        "standard_rate": item_data["standard_rate"],
        "custom_condition": item_data["custom_condition"],
        "custom_listing_type": item_data["custom_listing_type"],
        "custom_taxonomy_category_id": category_id,
        "custom_attributes": attributes_json,
        "owner": frappe.session.user
    })

    item.insert(ignore_permissions=True)
    return item.as_dict()
```

---

## 🔍 Search & Filter Integration

### 1. Attribute-Based Search

```python
@frappe.whitelist(allow_guest=True)
def search_items(filters: dict):
    """Search items by attributes"""

    query = """
        SELECT name, item_name, standard_rate, custom_attributes
        FROM `tabItem`
        WHERE custom_status = 'Published'
    """

    # Filter by category
    if filters.get("category_id"):
        query += " AND custom_taxonomy_category_id = %(category_id)s"

    # Filter by specific attributes (JSON query)
    if filters.get("attributes"):
        for attr_key, attr_value in filters["attributes"].items():
            query += f" AND JSON_EXTRACT(custom_attributes, '$.{attr_key}') = %(attr_{attr_key})s"

    results = frappe.db.sql(query, filters, as_dict=True)
    return results
```

### 2. Frontend Filter UI

```vue
<!-- In HomeView.vue -->
<template>
  <div class="filters-sidebar">
    <CategoryFilter v-model="selectedCategory" />

    <!-- Dynamic Attribute Filters -->
    <div v-if="selectedCategory" class="attribute-filters">
      <h3>Filter by Details</h3>

      <DynamicAttributeInput
        v-for="attribute in categoryAttributes"
        :key="attribute.id"
        :attribute="attribute"
        v-model="filters[attribute.handle]"
      />
    </div>

    <Button @click="applyFilters">Apply Filters</Button>
  </div>
</template>
```

---

## 📊 Performance Optimizations

### 1. Lazy Load Taxonomy (Large File)

```typescript
// packages/shared/src/composables/useTaxonomy.ts
import { ref } from 'vue';

const taxonomyCache = ref<Map<string, TaxonomyCategory>>(new Map());
let isLoaded = false;

export function useTaxonomy() {
  async function loadTaxonomy() {
    if (isLoaded) return;

    // Load in chunks or use Web Worker
    const response = await fetch('/data/taxonomy/en/taxonomy.json');
    const data = await response.json();

    // Index by ID for O(1) lookup
    data.verticals.forEach(vertical => {
      vertical.categories.forEach(category => {
        taxonomyCache.value.set(category.id, category);
      });
    });

    isLoaded = true;
  }

  return { loadTaxonomy, taxonomyCache };
}
```

### 2. Search Index

```typescript
// Build search index on load
const searchIndex = new Map<string, string[]>(); // term → category IDs

function buildSearchIndex() {
  taxonomyCache.value.forEach((category, id) => {
    const terms = category.full_name.toLowerCase().split(/[\s>]+/);
    terms.forEach(term => {
      if (!searchIndex.has(term)) {
        searchIndex.set(term, []);
      }
      searchIndex.get(term)!.push(id);
    });
  });
}

function searchCategories(query: string): TaxonomyCategory[] {
  const terms = query.toLowerCase().split(/\s+/);
  const resultIds = new Set<string>();

  terms.forEach(term => {
    const ids = searchIndex.get(term) || [];
    ids.forEach(id => resultIds.add(id));
  });

  return Array.from(resultIds)
    .map(id => taxonomyCache.value.get(id))
    .filter(Boolean)
    .slice(0, 20); // Top 20 results
}
```

---

## 🎯 Implementation Phases

### Phase 1: Data Layer (1-2 days)
- ✅ Parse taxonomy.json structure
- ✅ Create useTaxonomy composable
- ✅ Build search index
- ✅ Add caching mechanism

### Phase 2: UI Components (2-3 days)
- ✅ Enhance CategoryPicker with search
- ✅ Create DynamicAttributeInput
- ✅ Add breadcrumb navigation
- ✅ Mobile-responsive design

### Phase 3: Post Form (2 days)
- ✅ Refactor PostItemView to multi-step
- ✅ Integrate category picker
- ✅ Render dynamic attributes
- ✅ Form validation

### Phase 4: Backend (1-2 days)
- ✅ Add taxonomy fields to Item doctype
- ✅ Update create_listing endpoint
- ✅ Add attribute-based search

### Phase 5: Search/Filter (2 days)
- ✅ Attribute-based filtering in HomeView
- ✅ Category facets
- ✅ URL state management

### Phase 6: Testing & Polish (1 day)
- ✅ Test with various categories
- ✅ Performance testing (large taxonomy)
- ✅ Mobile testing
- ✅ Error handling

**Total Estimate:** 9-12 days

---

## 📦 Files to Create

```
packages/shared/src/
├── composables/
│   └── useTaxonomy.ts (enhance existing)
├── components/
│   ├── CategoryPicker.vue (enhance CascadingCategoryPicker)
│   └── DynamicAttributeInput.vue (new)
└── types/
    └── taxonomy.ts (new)

packages/market/src/views/
└── PostItemView.vue (refactor)

backend/bude_core/bude_core/
├── market/
│   └── item.py (update)
└── doctypes/item/
    └── item.json (add fields)
```

---

## 🚀 Quick Start (Step-by-Step)

1. **Parse taxonomy structure** → understand attribute types
2. **Create DynamicAttributeInput** → handles all input types
3. **Enhance CategoryPicker** → with search + breadcrumbs
4. **Refactor PostItemView** → 3-step wizard
5. **Backend fields** → add taxonomy columns
6. **Test with Pet Supplies** → (has 3 attributes: animal-type, color, pattern)
7. **Deploy** → test performance with large taxonomy

---

## 💡 Example: Pet Supplies Flow

**User Journey:**
1. Click "Post Item"
2. Step 1: Enter "Dog Collar" as title, $15 price, upload image
3. Step 2: Search "Pet Supplies" → Select "Pet Collars & Harnesses"
4. Step 3: Dynamic form shows:
   - **Animal Type:** Dropdown (Dog, Cat, Bird, etc.)
   - **Color:** Text input or color picker
   - **Pattern:** Text input (Striped, Floral, etc.)
5. Submit → Item stored with `custom_attributes: { "animal-type": "Dog", "color": "Blue", "pattern": "Striped" }`

**Search:**
- Filter by "Animal Type: Dog" → Shows only dog products
- Filter by "Color: Blue" → Shows only blue products

---

## 📝 Notes

- Taxonomy file is **955k lines** → use indexing + lazy loading
- Attributes are **category-specific** → dynamic form rendering required
- Some attributes have **pre-defined values** → use dropdowns
- Extended attributes exist but not visible initially
- Handle **no attributes** gracefully (some categories have 0 attributes)

---

**Status:** Ready to implement
**Next:** Create `DynamicAttributeInput.vue` first (smallest component)
