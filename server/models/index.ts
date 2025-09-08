import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'CLIENT', enum: ['SUPER_ADMIN', 'CLIENT'] },
}, { 
  timestamps: true,
  collection: 'users'
});

// Plan Schema
const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  billing: { type: String, required: true, default: 'MONTHLY', enum: ['MONTHLY', 'YEARLY'] },
  features: [{ type: String }],
  maxUsers: { type: Number, required: true },
  storageGB: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  isFreeTrial: { type: Boolean, default: false },
  trialDays: { type: Number, default: 0 },
}, { 
  timestamps: true,
  collection: 'plans'
});

// Client Schema
const clientSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  businessAddress: { type: String },
  industry: { type: String },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  status: { type: String, required: true, default: 'TRIAL', enum: ['TRIAL', 'ACTIVE', 'INACTIVE', 'CANCELLED'] },
  monthlyRevenue: { type: Number, default: 0 },
  lastLogin: { type: Date },
}, { 
  timestamps: true,
  collection: 'clients'
});

// Onboarding Session Schema
const onboardingSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  currentStep: { type: Number, default: 1 },
  isCompleted: { type: Boolean, default: false },
  businessData: { type: String }, // JSON string
  completedAt: { type: Date },
}, { 
  timestamps: true,
  collection: 'onboarding_sessions'
});

// Review Platform Schema
const reviewPlatformSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 10 },
  maxRating: { type: Number, required: true, min: 1, max: 10 },
  reviewCount: { type: Number, default: 0 },
  logoUrl: { type: String },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { 
  timestamps: true,
  collection: 'review_platforms'
});

// Export models
export const User = mongoose.model('User', userSchema);
export const Plan = mongoose.model('Plan', planSchema);
export const Client = mongoose.model('Client', clientSchema);
export const OnboardingSession = mongoose.model('OnboardingSession', onboardingSessionSchema);
export const ReviewPlatform = mongoose.model('ReviewPlatform', reviewPlatformSchema);

// Types
export interface IUser {
  _id?: string;
  email: string;
  password: string;
  role: 'SUPER_ADMIN' | 'CLIENT';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPlan {
  _id?: string;
  name: string;
  price: number;
  billing: 'MONTHLY' | 'YEARLY';
  features: string[];
  maxUsers: number;
  storageGB: number;
  isActive?: boolean;
  isFreeTrial?: boolean;
  trialDays?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IClient {
  _id?: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  businessAddress?: string;
  industry?: string;
  planId?: string;
  status: 'TRIAL' | 'ACTIVE' | 'INACTIVE' | 'CANCELLED';
  monthlyRevenue?: number;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReviewPlatform {
  _id?: string;
  name: string;
  displayName: string;
  rating: number;
  maxRating: number;
  reviewCount?: number;
  logoUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
}