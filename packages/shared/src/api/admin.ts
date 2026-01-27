import { frappe } from './index';

export interface AdminStat {
  label: string;
  value: string;
  change: string;
  icon: string;
  urgent?: boolean;
}

export interface ActivityItem {
  user: string;
  action: string;
  time: string;
  type: 'market' | 'work' | 'kyc';
}

export interface GrowthData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

export const adminApi = {
  getStats() {
    return frappe.call<AdminStat[]>('bude_core.admin.dashboard.get_dashboard_stats');
  },
  
  getRecentActivity() {
    return frappe.call<ActivityItem[]>('bude_core.admin.dashboard.get_recent_activity');
  },
  
  getGrowthData(days = 30) {
    return frappe.call<GrowthData>('bude_core.admin.dashboard.get_growth_data', { days });
  },
  
  // Moderation
  getPendingKYC(page = 0, pageSize = 20) {
    return frappe.call<any>('bude_core.admin.moderation.get_pending_kyc', { page, page_size: pageSize });
  },
  
  approveKYC(profileId: string) {
    return frappe.call<any>('bude_core.admin.moderation.approve_kyc', { profile_id: profileId });
  },
  
  rejectKYC(profileId: string, reason: string) {
    return frappe.call<any>('bude_core.admin.moderation.reject_kyc', { profile_id: profileId, reason });
  },

  getUsersList(page = 0, pageSize = 20, search?: string) {
    return frappe.call<any>('bude_core.admin.moderation.get_users_list', { page, page_size: pageSize, search });
  },

  toggleUserStatus(user: string, enabled: boolean) {
    return frappe.call<any>('bude_core.admin.moderation.toggle_user_status', { user, enabled: enabled ? 1 : 0 });
  },

  getListingsList(page = 0, pageSize = 20, search?: string) {
    return frappe.call<any>('bude_core.admin.moderation.get_listings_list', { page, page_size: pageSize, search });
  },

  disableListing(itemId: string, reason: string) {
    return frappe.call<any>('bude_core.admin.moderation.disable_listing', { item_id: itemId, reason });
  }
};
