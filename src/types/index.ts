export type UserRole = 'guest' | 'reader' | 'pending_poet' | 'approved_poet' | 'editor' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  password?: string;
  accountStatus: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export type LiterarySchool = 
  | 'كلاسيكي عمودي'
  | 'رومانسي وجداني'
  | 'واقعي وتفعيلة'
  | 'حر حديث'
  | 'فلسفي وصوفي';

export interface PoetProfile {
  id: string;
  userId?: string; // If registered user; historical poets may not have a user account
  literaryName: string;
  fullName?: string;
  biography: string;
  profileImage: string;
  birthYear?: number;
  deathYear?: number;
  city: string;
  literarySchool: LiterarySchool;
  verificationStatus: boolean;
  profileSlug: string;
  isHistorical: boolean;
  sources?: string;
  quotes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PoemVerse {
  first: string; // الصدر
  second: string; // العجز
}

export type PoemForm = 'عمودي' | 'تفعيلة' | 'حر';

export interface Poem {
  id: string;
  poetId: string;
  poetName: string;
  title: string;
  slug: string;
  poemText: string;
  verses: PoemVerse[];
  form: PoemForm;
  categoryId: string;
  categoryName: string;
  literarySchool: LiterarySchool;
  writtenAt?: string;
  source: string;
  copyrightStatus: string;
  publicationStatus: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'needs_revision';
  viewsCount: number;
  isFeatured: boolean;
  isPoemOfTheDay: boolean;
  adminFeedback?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName?: string;
}

export interface Collection {
  id: string;
  poetId: string;
  poetName: string;
  title: string;
  description: string;
  publicationYear: number;
  coverImage?: string;
  publisher?: string;
  poemsCount: number;
  poemIds: string[];
  createdAt: string;
}

export interface PoemSample {
  title: string;
  poemText: string;
  poemType: PoemForm;
  source?: string;
}

export interface PoetApplication {
  id: string;
  userId: string;
  userEmail: string;
  fullName: string;
  literaryName: string;
  phone?: string;
  biography: string;
  city: string;
  birthYear?: number;
  literarySchool: LiterarySchool;
  socialLinks?: string;
  publishedWorksLinks?: string;
  profileImage?: string;
  literarySamples: PoemSample[];
  agreedToTerms: boolean;
  agreedToOriginality: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteItem {
  id: string;
  userId: string;
  poemId: string;
  createdAt: string;
}

export interface FollowItem {
  id: string;
  userId: string;
  poetId: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  isRead: boolean;
  createdAt: string;
}

export interface ContentReport {
  id: string;
  userId?: string;
  userEmail?: string;
  contentType: 'poem' | 'poet';
  contentId: string;
  contentTitle: string;
  reason: 'copyright' | 'misattribution' | 'typo_error' | 'inappropriate' | 'other';
  details: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  entityType: 'poet_application' | 'poem' | 'poet' | 'category' | 'user' | 'report';
  entityId: string;
  details: string;
  createdAt: string;
}
