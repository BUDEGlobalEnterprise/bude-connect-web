<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import Icon from './Icon.vue';
import Avatar from './Avatar.vue';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  badge?: string | number;
  children?: NavItem[];
}

const props = defineProps<{
  items: NavItem[];
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  collapsed?: boolean;
  logo?: string;
  logoText?: string;
}>();

const emit = defineEmits<{
  'toggle': [collapsed: boolean];
  'logout': [];
}>();

const route = useRoute();
const isCollapsed = ref(props.collapsed ?? false);
const expandedItems = ref<string[]>([]);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
  emit('toggle', isCollapsed.value);
};

const toggleExpanded = (label: string) => {
  const index = expandedItems.value.indexOf(label);
  if (index > -1) {
    expandedItems.value.splice(index, 1);
  } else {
    expandedItems.value.push(label);
  }
};

const isActive = (item: NavItem) => {
  if (item.route) {
    return route.path === item.route || route.path.startsWith(item.route + '/');
  }
  return false;
};

const isExpanded = (label: string) => expandedItems.value.includes(label);
</script>

<template>
  <aside
    :class="[
      'flex flex-col h-screen bg-gray-900 text-gray-100 transition-all duration-300 ease-in-out',
      isCollapsed ? 'w-16' : 'w-64',
    ]"
  >
    <!-- Logo Section -->
    <div class="flex items-center justify-between h-16 px-4 border-b border-gray-800">
      <router-link to="/" class="flex items-center gap-3 overflow-hidden">
        <img v-if="logo" :src="logo" alt="Logo" class="w-8 h-8 rounded-lg" />
        <div v-else class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
          B
        </div>
        <span v-if="!isCollapsed" class="font-semibold text-lg whitespace-nowrap">
          {{ logoText || 'BudeGlobal' }}
        </span>
      </router-link>
      <button
        @click="toggleSidebar"
        class="p-1.5 rounded-md hover:bg-gray-800 transition-colors lg:flex hidden"
      >
        <Icon :name="isCollapsed ? 'chevron-right' : 'chevron-left'" size="sm" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4 px-2">
      <ul class="space-y-1">
        <li v-for="item in items" :key="item.label">
          <!-- Item with children -->
          <template v-if="item.children?.length">
            <button
              @click="toggleExpanded(item.label)"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                'hover:bg-gray-800',
                isExpanded(item.label) && 'bg-gray-800',
              ]"
            >
              <Icon :name="item.icon" size="sm" class="flex-shrink-0" />
              <span v-if="!isCollapsed" class="flex-1 text-left text-sm">{{ item.label }}</span>
              <Icon
                v-if="!isCollapsed"
                name="chevron-down"
                size="xs"
                :class="['transition-transform', isExpanded(item.label) && 'rotate-180']"
              />
            </button>

            <!-- Children -->
            <ul
              v-if="!isCollapsed && isExpanded(item.label)"
              class="mt-1 ml-4 pl-4 border-l border-gray-700 space-y-1"
            >
              <li v-for="child in item.children" :key="child.label">
                <router-link
                  :to="child.route || '#'"
                  :class="[
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                    isActive(child)
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800',
                  ]"
                >
                  <Icon :name="child.icon" size="xs" class="flex-shrink-0" />
                  <span>{{ child.label }}</span>
                </router-link>
              </li>
            </ul>
          </template>

          <!-- Simple item -->
          <template v-else>
            <router-link
              :to="item.route || '#'"
              :class="[
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                isActive(item)
                  ? 'bg-primary text-white shadow-glow'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800',
              ]"
            >
              <Icon :name="item.icon" size="sm" class="flex-shrink-0" />
              <span v-if="!isCollapsed" class="flex-1 text-sm">{{ item.label }}</span>
              <span
                v-if="!isCollapsed && item.badge"
                class="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-500 text-white"
              >
                {{ item.badge }}
              </span>
            </router-link>
          </template>
        </li>
      </ul>
    </nav>

    <!-- User Section -->
    <div v-if="user" class="border-t border-gray-800 p-4">
      <div :class="['flex items-center gap-3', isCollapsed && 'justify-center']">
        <Avatar :src="user.avatar" :name="user.name" size="sm" />
        <div v-if="!isCollapsed" class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">{{ user.name }}</p>
          <p class="text-xs text-gray-400 truncate">{{ user.email }}</p>
        </div>
        <button
          v-if="!isCollapsed"
          @click="emit('logout')"
          class="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          title="Logout"
        >
          <Icon name="logout" size="sm" />
        </button>
      </div>
    </div>
  </aside>
</template>
