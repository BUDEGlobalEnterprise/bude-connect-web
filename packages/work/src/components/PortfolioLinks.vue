<script setup lang="ts">
defineProps<{
  links: { url: string; title: string }[];
}>();
</script>

<template>
  <div class="card p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Portfolio</h2>
    <ul class="space-y-3">
      <li v-for="link in links" :key="link.url">
        <a
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 text-primary-600 hover:underline"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          {{ link.title }}
        </a>
      </li>
    </ul>
  </div>
</template>
