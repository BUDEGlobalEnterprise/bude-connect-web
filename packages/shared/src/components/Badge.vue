<script setup lang="ts">
defineProps<{
  variant?: "success" | "warning" | "info" | "error" | "default";
  size?: "sm" | "md";
}>();

const variantClasses = {
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  info: "bg-blue-100 text-blue-800",
  error: "bg-red-100 text-red-800",
  default: "bg-gray-100 text-gray-700",
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};
</script>

<template>
  <span
    :class="[
      'inline-flex items-center font-medium rounded-full',
      variantClasses[variant || 'default'],
      sizeClasses[size || 'sm'],
    ]"
  >
    <slot />
  </span>
</template>
