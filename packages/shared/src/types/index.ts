// User & Auth Types
export interface User {
  name: string;
  email: string;
  mobile_no: string;
  full_name: string;
  user_image?: string;
  location?: string; // Generic location from User.location
  wallet_balance: number;
  user_type_category: "Individual" | "Company";
  company_name?: string;
  kyc_status: "Pending" | "Verified" | "Rejected";
  default_geo_location?: GeoLocation;
  roles: string[];
  profile?: UserProfile; // Extended profile data
}

export interface UserProfile {
  slug?: string;
  profile_type?: "freelancer" | "client" | "buyer" | "seller" | "both";
  cover_image?: string;
  tagline?: string;
  headline?: string;
  bio?: string;
  description?: string;
  primary_role?: string;
  // Location fields (structured)
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  // Business info
  business_name?: string;
  gst_number?: string;
  pan_number?: string;
  // Freelancer fields
  hourly_rate?: number;
  availability?: "available" | "busy" | "away" | "not_available";
  hours_per_week?: number;
  // Settings
  role?: "buyer" | "seller" | "freelancer" | "client" | "both";
  onboarding_complete?: boolean;
  onboarding_step?: number;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

// Marketplace Types
export interface MarketItem {
  name: string;
  itemCode: string;
  itemName: string;
  description: string;
  image: string;
  itemGroup: string;
  standardRate: number;
  listingType: "Sell" | "Rent" | "Surplus" | "Scrap";
  condition: "New" | "Open Box" | "Refurbished" | "Used";
  listingExpiry?: string;
  listingStatus: "Draft" | "Published" | "Sold" | "Expired";
  sellerContactHidden: boolean;
  locationGeo?: GeoLocation;
  minOrderQty?: number;
  owner: string;
  sellerName?: string;
  distanceKm?: number;
  createdAt: string;
  modifiedAt: string;
}

export interface MarketItemDetail extends MarketItem {
  images: string[];
  sellerInfo?: SellerInfo;
  contactUnlocked?: boolean;
  contactInfo?: ContactInfo;
}

export interface SellerInfo {
  userId: string;
  name: string;
  userImage?: string;
  memberSince: string;
  listingCount: number;
  isVerified: boolean;
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
  description?: string;
}

export interface PortfolioProject {
  title: string;
  url: string;
  description?: string;
}

export interface JobOpening {
  name: string;
  title: string;
  description: string;
  budgetRange: string;
  budgetMin?: number;
  budgetMax?: number;
  status: "Open" | "Awarded" | "Closed" | "Filled";
  postedBy: string;
  posterName?: string;
  clientName?: string;
  skillsRequired: string[];
  skills?: Skill[];
  bidsCount: number;
  totalBids?: number;
  created: string;
  createdAt?: string;
  deadline?: string;
  duration?: string;
  experienceLevel?: string;
  isRemote?: boolean;
}

// Alias for convenience
export type Job = JobOpening;

export interface Bid {
  name: string;
  jobOpening: string;
  applicantName?: string;
  emailId?: string;
  bidAmount: number;
  proposalText: string;
  status: "Open" | "Replied" | "Rejected" | "Hired";
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
