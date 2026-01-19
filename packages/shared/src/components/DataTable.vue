<script setup lang="ts" generic="T">
import { computed } from 'vue';
import Icon from './Icon.vue';
import LoadingSkeleton from './LoadingSkeleton.vue';

interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => string;
}

const props = defineProps<{
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  selectable?: boolean;
  selectedRows?: T[];
  emptyMessage?: string;
  emptyIcon?: string;
}>();

const emit = defineEmits<{
  sort: [key: string];
  'row-click': [row: T];
  'selection-change': [rows: T[]];
}>();

const getCellValue = (row: T, column: Column<T>) => {
  if (column.render) return column.render(row);
  const keys = String(column.key).split('.');
  let value: any = row;
  for (const key of keys) {
    value = value?.[key];
  }
  return value ?? '-';
};
</script>

<template>
  <div class="bg-card border border-gray-100 rounded-xl overflow-hidden">
    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50/50">
            <th
              v-if="selectable"
              class="w-12 px-4 py-3"
            >
              <input
                type="checkbox"
                class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </th>
            <th
              v-for="column in columns"
              :key="String(column.key)"
              :style="{ width: column.width }"
              :class="[
                'px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider',
                column.align === 'center' && 'text-center',
                column.align === 'right' && 'text-right',
                column.sortable && 'cursor-pointer hover:text-foreground transition-colors',
              ]"
              @click="column.sortable && emit('sort', String(column.key))"
            >
              <div class="flex items-center gap-1.5">
                {{ column.label }}
                <template v-if="column.sortable && sortBy === column.key">
                  <Icon
                    :name="sortOrder === 'asc' ? 'chevron-up' : 'chevron-down'"
                    size="xs"
                    class="text-primary"
                  />
                </template>
              </div>
            </th>
          </tr>
        </thead>

        <tbody v-if="!loading && data.length > 0">
          <tr
            v-for="(row, index) in data"
            :key="index"
            class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer"
            @click="emit('row-click', row)"
          >
            <td v-if="selectable" class="px-4 py-4">
              <input
                type="checkbox"
                class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                @click.stop
              />
            </td>
            <td
              v-for="column in columns"
              :key="String(column.key)"
              :class="[
                'px-4 py-4 text-sm',
                column.align === 'center' && 'text-center',
                column.align === 'right' && 'text-right',
              ]"
            >
              <slot :name="`cell-${String(column.key)}`" :row="row" :value="getCellValue(row, column)">
                {{ getCellValue(row, column) }}
              </slot>
            </td>
          </tr>
        </tbody>

        <!-- Loading State -->
        <tbody v-else-if="loading">
          <tr v-for="i in 5" :key="i" class="border-b border-gray-50">
            <td v-if="selectable" class="px-4 py-4">
              <div class="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            </td>
            <td v-for="column in columns" :key="String(column.key)" class="px-4 py-4">
              <div class="h-4 bg-gray-200 rounded animate-pulse" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && data.length === 0"
      class="flex flex-col items-center justify-center py-12 text-center"
    >
      <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon :name="emptyIcon || 'folder'" size="lg" class="text-gray-400" />
      </div>
      <p class="text-sm text-muted-foreground">
        {{ emptyMessage || 'No data available' }}
      </p>
    </div>
  </div>
</template>
