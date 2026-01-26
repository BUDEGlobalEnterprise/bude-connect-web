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

// ============================================
// New Feature Components (Built on shadcn/ui)
// ============================================

// File & Media
export { default as FileUploadZone } from './FileUploadZone.vue';

// Advanced Form Inputs
export { default as ComboboxMultiSelect } from './ComboboxMultiSelect.vue';
export { default as RatingInput } from './RatingInput.vue';
export { default as TagInput } from './TagInput.vue';
export { default as SkillSelector } from './SkillSelector.vue';
export { default as TimezoneSelector } from './TimezoneSelector.vue';
export { default as ColorPicker } from './ColorPicker.vue';

// Data Display & Visualization
export { default as TimelineView } from './TimelineView.vue';
export { default as DataTable } from './DataTable.vue';
export { default as StatCard } from './StatCard.vue';
export { default as StatsGrid } from './StatsGrid.vue';
export { default as EmptyState } from './EmptyState.vue';
export { default as LoadingSkeleton } from './LoadingSkeleton.vue';
export { default as ProgressBar } from './ProgressBar.vue';
export { default as TestimonialCard } from './TestimonialCard.vue';

// Navigation & Notifications
export { default as NotificationDropdown } from './NotificationDropdown.vue';
export { default as BreadcrumbNav } from './BreadcrumbNav.vue';
export { default as BottomNav } from './BottomNav.vue';
export { default as Sidebar } from './Sidebar.vue';
export { default as SearchBar } from './SearchBar.vue';
export * from './SearchInput.vue';
export { default as SearchInput } from './SearchInput.vue';
export { default as MultiSearchInput } from './MultiSearchInput.vue';
export { default as ScrollToTop } from './ScrollToTop.vue';

// Layout & Dialogs
export { default as SidePanel } from './SidePanel.vue';
export { default as ConfirmDialog } from './ConfirmDialog.vue';
export { default as PricingCard } from './PricingCard.vue';

// Marketplace-Specific
export { default as ProposalCard } from './ProposalCard.vue';
export { default as ProjectMilestoneTracker } from './ProjectMilestoneTracker.vue';
export { default as AvailabilityCalendar } from './AvailabilityCalendar.vue';
export { default as ChatBubble } from './ChatBubble.vue';
export { default as CommentBox } from './CommentBox.vue';

// Utilities
export { default as CopyToClipboard } from './CopyToClipboard.vue';
export { default as ShareButton } from './ShareButton.vue';
export { default as VirtualScrollList } from './VirtualScrollList.vue';

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
