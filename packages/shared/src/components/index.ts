// Shared UI Components - Enterprise Design System
// Built with shadcn-vue (Radix Vue + Tailwind CSS)

// ============================================
// shadcn-vue UI Components (Standard Library)
// ============================================
export * from './ui';

// ============================================
// Legacy/Custom Components (for backwards compatibility)
// ============================================

// Custom Icon component (Lucide-style SVGs)
export { default as Icon } from './Icon.vue';

// Data Display
export { default as DataTable } from './DataTable.vue';
export { default as StatCard } from './StatCard.vue';
export { default as EmptyState } from './EmptyState.vue';
export { default as LoadingSkeleton } from './LoadingSkeleton.vue';

// Navigation
export { default as BottomNav } from './BottomNav.vue';
export { default as Sidebar } from './Sidebar.vue';
export { default as SearchBar } from './SearchBar.vue';

// Media
export { default as LazyImage } from './LazyImage.vue';

// Layout
export { default as Footer } from './Footer.vue';
export { default as VirtualList } from './VirtualList.vue';

// Forms & Validation
export { default as PasswordStrengthMeter } from './PasswordStrengthMeter.vue';

// Features
export { default as ChatWindow } from './ChatWindow.vue';
export { default as NotificationBell } from './NotificationBell.vue';
export { default as OnboardingWizard } from './OnboardingWizard.vue';
export { default as ProfileCompletenessMeter } from './ProfileCompletenessMeter.vue';
export { default as ReviewSection } from './ReviewSection.vue';

// ============================================
// Legacy Aliases (Deprecated - use ui/* instead)
// ============================================
export { default as Avatar } from './Avatar.vue';
export { default as Badge } from './Badge.vue';
export { default as Button } from './Button.vue';
export { default as Card } from './Card.vue';
export { default as Input } from './Input.vue';
export { default as Modal } from './Modal.vue';
export { default as Toast } from './Toast.vue';
