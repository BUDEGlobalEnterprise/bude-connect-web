// User & Auth Types
export interface User {
  name: string;
  email: string;
  mobile_no: string;
  full_name: string;
  wallet_balance: number;
  user_type_category: "Individual" | "Company";
  company_name?: string;
  kyc_status: "Pending" | "Verified" | "Rejected";
  default_geo_location?: GeoLocation;
  roles: string[];
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

// Marketplace Types
export interface MarketItem {
  name: string;
  item_code: string;
  item_name: string;
  description: string;
  image: string;
  item_group: string;
  standard_rate: number;
  listing_type: "Sell" | "Rent" | "Surplus" | "Scrap";
  condition: "New" | "Open Box" | "Refurbished" | "Used";
  listing_expiry: string;
  listing_status: "Draft" | "Published" | "Sold" | "Expired";
  seller_contact_hidden: boolean;
  location_geo?: GeoLocation;
  min_order_qty?: number;
  owner: string;
  seller_name?: string;
  distance_km?: number;
  created: string;
  modified: string;
}

export interface MarketItemDetail extends MarketItem {
  images: string[];
  seller_info?: SellerInfo;
  contact_unlocked?: boolean;
  contact_info?: ContactInfo;
}

export interface SellerInfo {
  user_id: string;
  name: string;
  member_since: string;
  listing_count: number;
  is_verified: boolean;
}

export interface ContactInfo {
  phone: string;
  email: string;
}

// Talent Platform Types
export interface Freelancer {
  name: string;
  supplier_name: string;
  supplier_type: "Freelancer";
  skills: Skill[];
  hourly_rate: number;
  portfolio_links: PortfolioLink[];
  boost_score: number;
  is_verified_expert: boolean;
  image?: string;
  bio?: string;
  member_since: string;
  completed_jobs: number;
}

export interface Skill {
  skill_name: string;
  proficiency?: "Beginner" | "Intermediate" | "Expert";
}

export interface PortfolioLink {
  title: string;
  url: string;
}

export interface JobOpening {
  name: string;
  title: string;
  description: string;
  budget_range: string;
  status: "Open" | "Awarded" | "Closed";
  posted_by: string;
  poster_name?: string;
  skills_required: string[];
  bids_count: number;
  created: string;
  deadline?: string;
}

export interface Bid {
  name: string;
  job_opening: string;
  supplier: string;
  supplier_name: string;
  bid_amount: number;
  proposal_text: string;
  status: "Pending" | "Accepted" | "Rejected";
  created: string;
}

// Wallet Types
export interface WalletTransaction {
  name: string;
  user: string;
  transaction_type: "Credit" | "Debit";
  amount: number;
  reference_type: string;
  reference_id: string;
  description: string;
  timestamp: string;
}

// API Response Types
export interface ApiResponse<T> {
  message: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface ApiError {
  exc_type: string;
  exception: string;
  message: string;
}
