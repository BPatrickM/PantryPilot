// ─────────────────────────────────────────────────────────────────────────────
// PantryPilot — Shared Types
// ─────────────────────────────────────────────────────────────────────────────

// ── Enums ─────────────────────────────────────────────────────────────────────

export type Retailer = 'shoprite' | 'walmart';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type CourseType = 'main' | 'side' | 'dessert';

export type StockLevel = 'just_a_little' | 'about_half' | 'almost_full' | 'plenty';

export type CartStatus = 'pending' | 'added' | 'not_found' | 'error';

export type CartSessionStatus = 'queued' | 'in_progress' | 'completed' | 'failed';

export type ShoppingListStatus = 'draft' | 'sent_to_cart' | 'completed';

export type IconType = 'jar' | 'bottle' | 'bunch' | 'box' | 'bag';

export type IngredientCategory =
  | 'Produce'
  | 'Meat & Seafood'
  | 'Dairy & Eggs'
  | 'Pantry & Dry Goods'
  | 'Frozen'
  | 'Beverages'
  | 'Other';

export type ShoppingPreference = 'cheapest' | 'organic' | 'generic';

export type AIAssistant = 'chatgpt' | 'gemini' | 'both';

// ── Meal Card Visual State ────────────────────────────────────────────────────

export type MealCardState = 'standard' | 'most_used' | 'favorite' | 'selected' | 'in_plan';

// ── Domain Models ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  displayName: string;
  preferredRetailer: Retailer;
  storeZip: string;
  preferredAI: AIAssistant;
  createdAt: string;
}

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  defaultUnit: string;
  standardPackageQty: number;
  standardPackageUnit: string;
  iconType: IconType;
  shopRiteSearchTerm?: string;
  walmartSearchTerm?: string;
  isStaple: boolean;
}

export interface RecipeIngredient {
  id: string;
  mealId: string;
  ingredientId: string;
  ingredient?: Ingredient;
  quantityBase: number;
  unit: string;
  prepNote?: string;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  yieldServings: number;
  prepTimeMins: number;
  mealType: MealType;
  imageUrl?: string;
  isUserCreated: boolean;
  createdBy?: string;
  recipeIngredients?: RecipeIngredient[];
  // UI-only fields
  cardState?: MealCardState;
  usageCount?: number;
  isFavorite?: boolean;
}

export interface PantryItem {
  id: string;
  userId: string;
  ingredientId: string;
  ingredient?: Ingredient;
  stockLevel: StockLevel;
  quantityOnHand: number;
  unit: string;
  isExact: boolean;
  isLowFlagged: boolean;
  updatedAt: string;
}

export interface ShoppingList {
  id: string;
  userId: string;
  mealPlanId?: string;
  status: ShoppingListStatus;
  items: ShoppingListItem[];
  createdAt: string;
}

export interface ShoppingListItem {
  id: string;
  listId: string;
  ingredientId: string;
  ingredient?: Ingredient;
  quantityNeeded: number;
  unit: string;
  isLowFlagged: boolean;
  isManuallyAdded: boolean;
  cartStatus: CartStatus;
  retailerProductId?: string;
}

export interface CartSession {
  id: string;
  userId: string;
  listId: string;
  retailer: Retailer;
  status: CartSessionStatus;
  itemsAdded: number;
  itemsFailed: number;
  estimatedTotal?: number;
  checkoutUrl?: string;
  startedAt?: string;
  completedAt?: string;
}

// ── Plan Templates ────────────────────────────────────────────────────────────

export interface PlanTemplate {
  id: string;
  name: string;
  description: string;
  createdBy?: string;
  isCurated: boolean;
  isPublic: boolean;
  seasonTag?: string;
  thumbnailUrl?: string;
  meals?: PlanTemplateMeal[];
  createdAt: string;
}

export interface PlanTemplateMeal {
  id: string;
  planId: string;
  mealId: string;
  meal?: Meal;
  dayOfWeek: number; // 1 = Mon, 7 = Sun
  mealSlot: MealType;
  courseType: CourseType;
}

// ── Weekly Planner ────────────────────────────────────────────────────────────

export interface DayPlan {
  dayOfWeek: number;
  date?: string;
  main?: Meal;
  sides: Meal[];
  dessert?: Meal;
}

export interface WeekPlan {
  days: DayPlan[];
  nDiners: number;
  templateId?: string;
}

// ── Scaling ───────────────────────────────────────────────────────────────────

export interface ScaledIngredient {
  ingredientId: string;
  ingredient?: Ingredient;
  quantityFinal: number;
  unit: string;
  sources: { mealId: string; mealName: string; quantity: number }[];
}

// ── NLP Parser ────────────────────────────────────────────────────────────────

export type ParseConfidence = 'high' | 'medium' | 'low';

export interface ParsedIngredientLine {
  raw: string;
  quantity?: number;
  unit?: string;
  name: string;
  prepNote?: string;
  catalogMatch?: {
    id: string;
    name: string;
    confidence: number;
  };
  confidence: number;
  confidenceLevel: ParseConfidence;
}

export interface ParsedRecipe {
  name: string;
  yieldServings: number;
  ingredients: ParsedIngredientLine[];
  parseConfidence: number;
}

// ── Retailer Product ──────────────────────────────────────────────────────────

export interface RetailerProduct {
  id: string;
  name: string;
  brand?: string;
  category: string;
  price: number;
  size?: string;
  unit?: string;
  isOrganic: boolean;
  isGeneric: boolean;
  imageUrl?: string;
  retailer: Retailer;
  score?: number;
}

// ── User Preferences ──────────────────────────────────────────────────────────

export interface UserMealPreference {
  userId: string;
  mealId: string;
  isFavorite: boolean;
  usageCount: number;
  mostUsedRank?: number;
  lastUsedAt?: string;
}

export interface MealUsageEvent {
  id: string;
  userId: string;
  mealId: string;
  usedAt: string;
  planExecutionId: string;
}
