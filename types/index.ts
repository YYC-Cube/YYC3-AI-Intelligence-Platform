/**
 * @fileoverview YYC3 AI Intelligence Platform - Core Type Definitions
 * @description Centralized type definitions for the entire application.
 *              This file serves as the single source of truth for all TypeScript
 *              interfaces and types used across the project.
 * @audit-fix [C4-FIX] — Extended AppData to eliminate all `as any` type escapes
 * @audit-phase P1
 * @audit-date 2026-04-21
 * @version 1.1.0
 * @author YYC3 Team
 * @license MIT
 */

/**
 * Represents application data structure with core properties.
 * Used throughout the app to standardize how application information is passed between components.
 *
 * @interface AppData
 * @property {string} [id] - Unique identifier for the application (optional for flexibility)
 * @property {string} name - Display name of the application
 * @property {string} [icon] - URL or path to application icon
 * @property {string} [category] - Application category/genre
 * @property {number} [rating] - User rating score (typically 0-5)
 * @property {number} [downloads] - Total download count
 * @property {number} [revenue] - Revenue figures in USD
 * @example
 * const app: AppData = {
 *   id: 'app-123',
 *   name: 'My Awesome App',
 *   category: 'Productivity',
 *   rating: 4.5,
 *   downloads: 1000000
 * };
 */
export interface AppData {
  id?: string | number;
  name: string;
  icon?: string;
  category?: string;
  rating?: number;
  downloads?: number | { from: string; to: string };
  revenue?: number;
  rank?: number | { from: number; to: number };
  growth?: number;
  primaryColor?: string;
  [key: string]: unknown;
}

export interface WelcomeCompleteData {
  genre?: string;
  competitors?: AppData[];
  analysisResults?: Record<string, unknown>;
  reportData?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface AppContextData {
  selectedApp: AppData | null;
  market?: string;
  genre?: string;
  subcategory?: string;
  competitors?: AppData[];
  analysisResults?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Application context object containing global state.
 * Passed down through component tree to provide shared data access.
 *
 * @interface AppContext
 * @property {AppData | null} selectedApp - Currently selected application
 * @property {string} [market] - Target market/region
 * @property {string} [genre] - Application genre/category
 * @property {string} [subcategory] - Sub-category within genre
 * @property {AppData[]} [competitors] - List of competitor applications
 * @property {Record<string, unknown>} [analysisResults] - Analysis data from various modules
 */
export interface AppContext {
  selectedApp: AppData | null;
  market?: string;
  genre?: string;
  subcategory?: string;
  competitors?: AppData[];
  analysisResults?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Context data specific to welcome/onboarding flow.
 * Contains user selections during initial setup.
 *
 * @interface WelcomeContext
 * @property {string} [selectedGenre] - Selected app genre
 * @property {AppData[]} [competitors] - Identified competitors
 * @property {Record<string, unknown>} [analysisResults] - Market analysis results
 * @property {Record<string, unknown>} [reportData] - Generated report data
 */
export interface WelcomeContext {
  selectedGenre?: string;
  competitors?: AppData[];
  analysisResults?: Record<string, unknown>;
  reportData?: Record<string, unknown>;
}

/**
 * Navigation data structure for page transitions.
 * Used when navigating between different sections of the app.
 *
 * @interface NavigationData
 * @property {string} page - Target page identifier
 * @property {AppData} [appData] - Optional application context for navigation
 */
export interface NavigationData {
  page: string;
  appData?: AppData;
  [key: string]: unknown;
}

/**
 * Session data for collaboration or chat features.
 * Tracks ongoing user sessions with message history.
 *
 * @interface SessionData
 * @property {string} id - Unique session identifier
 * @property {string} title - Session display title
 * @property {'chat' | 'collaboration' | 'analysis'} type - Session type classification
 * @property {MessageData[]} [messages] - Array of messages in session
 * @property {string[]} [participants] - List of participant identifiers
 * @property {Date} createdAt - Session creation timestamp
 * @property {Date} updatedAt - Last activity timestamp
 */
export interface SessionData {
  id: string;
  title: string;
  type: 'chat' | 'collaboration' | 'analysis';
  messages?: MessageData[];
  participants?: string[];
  createdAt: Date;
  updatedAt: Date;
  [key: string]: unknown;
}

/**
 * Individual message within a session.
 *
 * @interface MessageData
 * @property {string} id - Unique message identifier
 * @property {'user' | 'assistant' | 'system'} role - Message sender role
 * @property {string} content - Message text content
 * @property {Date} timestamp - When message was sent
 */
export interface MessageData {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  [key: string]: unknown;
}

/**
 * Investment/funding opportunity data.
 *
 * @interface InvestmentData
 * @property {string} id - Investment identifier
 * @property {string} name - Investment/fund name
 * @property {'venture' | 'grant' | 'loan'} type - Type of investment
 * @property {number} amount - Available amount in USD
 * @property {string} stage - Target startup stage
 * @property {string} description - Detailed description
 * @property {string[]} requirements - List of requirements/eligibility criteria
 * @property {Date} [deadline] - Application deadline
 */
export interface InvestmentData {
  id: string;
  name: string;
  type: 'venture' | 'grant' | 'loan';
  amount: number;
  stage: string;
  description: string;
  requirements: string[];
  deadline?: Date;
  [key: string]: unknown;
}

/**
 * A/B test configuration and results.
 *
 * @interface TestData
 * @property {string} id - Test identifier
 * @property {string} name - Test display name
 * @property {'running' | 'completed' | 'draft'} status - Current test status
 * @property {TestVariantData[]} variants - Array of test variants
 * @property {Date} startDate - When test started
 * @property {Date} [endDate] - When test ended (if completed)
 * @property {Record<string, unknown>} [results] - Test results data
 */
export interface TestData {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'draft';
  variants: TestVariantData[];
  startDate: Date;
  endDate?: Date;
  results?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Individual variant within an A/B test.
 *
 * @interface TestVariantData
 * @property {string} id - Variant identifier
 * @property {string} name - Variant display name
 * @property {number} traffic - Traffic percentage allocated
 * @property {number} conversion - Conversion rate
 * @property {number} revenue - Revenue generated
 */
export interface TestVariantData {
  id: string;
  name: string;
  traffic: number;
  conversion: number;
  revenue: number;
  [key: string]: unknown;
}

/**
 * Ad creative performance data for marketing analysis.
 *
 * @interface AdCreativeData
 * @property {string} id - Creative identifier
 * @property {'image' | 'video' | 'carousel'} type - Creative format type
 * @property {string} platform - Advertising platform (Facebook, Google, etc.)
 * @property {object} performance - Performance metrics
 * @property {number} performance.impressions - Total impressions
 * @property {number} performance.clicks - Total clicks
 * @property {number} performance.ctr - Click-through rate (%)
 * @property {number} performance.conversions - Number of conversions
 * @property {number} performance.roas - Return on ad spend
 * @property {RetentionSegment[]} [retentionBreakdown] - Retention by time period
 */
export interface AdCreativeData {
  id?: string;
  type?: 'image' | 'video' | 'carousel';
  platform?: string;
  performance?: {
    impressions: number;
    clicks: number;
    ctr: number;
    conversions: number;
    roas: number;
  };
  retentionBreakdown?: RetentionSegment[];
  [key: string]: unknown;
}

/**
 * Retention data segment for a specific time period.
 *
 * @interface RetentionSegment
 * @property {string} period - Time period label (e.g., "0-3s", "Day 1")
 * @property {number} rate - Retention rate as percentage
 * @property {number} users - Number of users in this segment
 */
export interface RetentionSegment {
  period: string;
  time?: string;
  action?: string;
  impact?: string;
  retention?: number;
  rate: number;
  users: number;
}

/**
 * Machine learning model metadata.
 *
 * @interface ModelData
 * @property {string} id - Model identifier
 * @property {string} name - Model display name
 * @property {'classification' | 'regression' | 'clustering'} type - ML model type
 * @property {number} accuracy - Model accuracy score (0-1)
 * @property {string} description - Model purpose description
 */
export interface ModelData {
  id: string;
  name: string;
  type: 'classification' | 'regression' | 'clustering';
  accuracy: number;
  description: string;
  [key: string]: unknown;
}

/**
 * Pattern recognition result from ML analysis.
 *
 * @interface PatternData
 * @property {string} id - Pattern identifier
 * @property {string} name - Pattern display name
 * @property {string} type - Pattern category/type
 * @property {number} confidence - Confidence score (0-1)
 * @property {Record<string, unknown>} data - Additional pattern data
 */
export interface PatternData {
  id: string;
  name: string;
  type: string;
  confidence: number;
  data: Record<string, unknown>;
}

/**
 * Idea or feature suggestion data.
 *
 * @interface IdeaData
 * @property {string} id - Idea identifier
 * @property {string} title - Idea title
 * @property {string} description - Detailed description
 * @property {string} category - Idea category
 * @property {'high' | 'medium' | 'low'} potential - Potential impact assessment
 * @property {'idea' | 'validated' | 'implementing'} status - Current validation status
 * @property {Date} createdAt - When idea was created
 */
export interface IdeaData {
  id: string;
  title: string;
  description: string;
  category: string;
  potential: 'high' | 'medium' | 'low';
  status: 'idea' | 'validated' | 'implementing';
  createdAt: Date;
  [key: string]: unknown;
}

/**
 * Navigation item structure for menus and sidebars.
 *
 * @interface NavItem
 * @property {string} id - Unique item identifier
 * @property {string} label - Display label
 * @property {string} path - Navigation route/path
 * @property {React.ComponentType<{ className?: string }>} [icon] - Optional icon component
 * @property {number | string} [badge] - Optional badge count or indicator
 * @property {NavItem[]} [children] - Child navigation items (for nested menus)
 */
export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  children?: NavItem[];
}

/**
 * Data point for chart visualizations.
 *
 * @interface ChartDataPoint
 * @property {string} name - Point label/name
 * @property {number} value - Primary numeric value
 */
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: number | string;
}

/**
 * Genre/Category data for app classification.
 * Used in the welcome flow for genre selection.
 *
 * @interface GenreData
 * @property {string} id - Unique genre identifier
 * @property {string} name - Display name of the genre
 * @property {React.ComponentType} icon - Icon component for the genre
 * @property {string} marketSize - Total market size (e.g., '$2.3B')
 * @property {string | number} appCount - Number of apps in this genre
 * @property {string} growth - Growth rate (e.g., '+34%')
 * @property {string} avgRpd - Average revenue per download
 * @property {string[]} topApps - List of top apps in this genre
 * @property {string} description - Genre description
 * @property {boolean} [isCustom] - Whether this is a custom user-defined genre
 */
export interface GenreData {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  marketSize: string;
  appCount: string | number;
  growth: string;
  avgRpd: string;
  topApps: string[];
  description: string;
  isCustom?: boolean;
}
