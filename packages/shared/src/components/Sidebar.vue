<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { 
  Avatar, AvatarImage, AvatarFallback,
  Button,
  Badge,
  ScrollArea
} from './ui';
import { 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown, 
  LogOut,
  LayoutDashboard,
  Circle
} from 'lucide-vue-next';
import * as LucideIcons from 'lucide-vue-next';

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

// Helper to get Lucide icon component
const getIcon = (name: string) => {
  // Map some common legacy icon names to Lucide props
  const iconMap: Record<string, any> = {
    'dashboard': LayoutDashboard,
    'home': LucideIcons.Home,
    'shopping-bag': LucideIcons.ShoppingBag,
    'users': LucideIcons.Users,
    'settings': LucideIcons.Settings,
    'file-text': LucideIcons.FileText,
    'briefcase': LucideIcons.Briefcase,
    'message-square': LucideIcons.MessageSquare,
    'wallet': LucideIcons.Wallet,
  };

  // Try map first, then try PascalCase version of name, then fallback to Circle
  if (iconMap[name]) return iconMap[name];
  
  const pascalName = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  return (LucideIcons as any)[pascalName] || Circle;
};
</script>

<template>
  <aside
    :class="[
      'flex flex-col h-screen bg-slate-950 text-slate-100 border-r border-slate-800 transition-all duration-300 ease-in-out z-20',
      isCollapsed ? 'w-20' : 'w-72',
    ]"
  >
    <!-- Logo Section -->
    <div class="flex items-center justify-between h-20 px-6 border-b border-slate-800/50">
      <router-link to="/" class="flex items-center gap-3 overflow-hidden group">
        <div class="relative">
          <img v-if="logo" :src="logo" alt="Logo" class="w-10 h-10 rounded-xl object-contain transition-transform group-hover:scale-110" />
          <div v-else class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">
            B
          </div>
          <div class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950" />
        </div>
        <div v-if="!isCollapsed" class="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
          <span class="font-bold text-lg leading-tight tracking-tight whitespace-nowrap">
            {{ logoText || 'BudeGlobal' }}
          </span>
          <span class="text-[10px] uppercase tracking-widest font-black text-slate-500">Connect</span>
        </div>
      </router-link>
      <Button
        v-if="!isCollapsed"
        variant="ghost" 
        size="icon"
        @click="toggleSidebar"
        class="h-8 w-8 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 lg:flex hidden"
      >
        <ChevronLeft class="h-4 w-4" />
      </Button>
    </div>

    <!-- Navigation Area -->
    <ScrollArea class="flex-1 px-4 py-6">
      <ul class="space-y-1.5">
        <li v-for="item in items" :key="item.label">
          <!-- Item with children -->
          <template v-if="item.children?.length">
            <button
              @click="toggleExpanded(item.label)"
              :class="[
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group',
                isExpanded(item.label) ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-900/50 hover:text-white',
                isCollapsed && 'justify-center px-0'
              ]"
            >
              <component :is="getIcon(item.icon)" :size="20" class="flex-shrink-0 transition-transform group-hover:scale-110" />
              <span v-if="!isCollapsed" class="flex-1 text-left text-sm font-semibold tracking-tight">{{ item.label }}</span>
              <ChevronDown
                v-if="!isCollapsed"
                :size="16"
                :class="['text-slate-600 transition-transform duration-300', isExpanded(item.label) && 'rotate-180 text-primary']"
              />
            </button>

            <!-- Children Dropdown -->
            <ul
              v-if="!isCollapsed && isExpanded(item.label)"
              class="mt-1 ml-6 pl-4 border-l border-slate-800 space-y-1 animate-in slide-in-from-top-2 duration-300"
            >
              <li v-for="child in item.children" :key="child.label">
                <router-link
                  :to="child.route || '#'"
                  :class="[
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                    isActive(child)
                      ? 'text-primary bg-primary/5'
                      : 'text-slate-500 hover:text-white hover:bg-slate-900/30',
                  ]"
                >
                  <component :is="getIcon(child.icon)" :size="16" class="flex-shrink-0 opacity-70 group-hover:opacity-100" />
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
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group',
                isActive(item)
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-slate-400 hover:bg-slate-900/50 hover:text-white',
                isCollapsed && 'justify-center px-0'
              ]"
            >
              <component :is="getIcon(item.icon)" :size="20" class="flex-shrink-0 transition-transform group-hover:scale-110" />
              <span v-if="!isCollapsed" class="flex-1 text-sm font-semibold tracking-tight">{{ item.label }}</span>
              <Badge
                v-if="!isCollapsed && item.badge"
                variant="secondary"
                class="bg-primary/20 text-primary hover:bg-primary/30 border-none font-bold text-[10px]"
              >
                {{ item.badge }}
              </Badge>
            </router-link>
          </template>
        </li>
      </ul>
    </ScrollArea>

    <div class="px-4 py-4 space-y-4">
       <!-- Toggle button for collapsed state when it's small -->
       <Button
        v-if="isCollapsed"
        variant="ghost" 
        size="icon"
        @click="toggleSidebar"
        class="w-full h-10 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
      >
        <ChevronRight class="h-5 w-5" />
      </Button>

      <!-- User Profile Card -->
      <div v-if="user" class="border-t border-slate-800/50 pt-4 pb-2">
        <div :class="['flex items-center gap-3 p-2 rounded-xl bg-slate-900/30 border border-slate-800/30', isCollapsed && 'justify-center border-none bg-transparent p-0']">
          <Avatar class="h-10 w-10 border-2 border-slate-800 ring-2 ring-slate-950 transition-transform hover:scale-105">
            <AvatarImage v-if="user.avatar" :src="user.avatar" />
            <AvatarFallback class="bg-slate-800 text-slate-300 font-bold uppercase">
              {{ user.name?.charAt(0) || 'U' }}
            </AvatarFallback>
          </Avatar>
          
          <div v-if="!isCollapsed" class="flex-1 min-w-0 flex flex-col">
            <p class="text-sm font-bold text-white leading-none truncate">{{ user.name }}</p>
            <p class="text-[10px] text-slate-500 font-medium truncate mt-1 uppercase tracking-tighter">{{ user.email }}</p>
          </div>
          
          <Button
            v-if="!isCollapsed"
            variant="ghost"
            size="icon"
            @click="emit('logout')"
            class="h-8 w-8 text-slate-500 hover:text-destructive hover:bg-destructive/10 rounded-full shrink-0"
            title="Logout"
          >
            <LogOut class="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.shadow-glow {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
}
</style>
