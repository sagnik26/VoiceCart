export type HomePlan = {
  spent: number;
  limit: number;
  ordersUsed: number;
  ordersLimit: number;
  daysLeft: number;
};

export type SuggestedMeal = {
  title: string;
  restaurant: string;
  price: number;
  reason: string;
};

export type GroceryRoutine = {
  title: string;
  cadenceLabel: string;
  summary: string;
};

export type RecentOrder = {
  restaurant: string;
  date: string;
  summary: string;
  total: number;
};

export const HOME_USER = {
  firstName: 'Aarav',
  avatarInitial: 'A',
} as const;

export const HOME_PLAN: HomePlan = {
  spent: 2150,
  limit: 4000,
  ordersUsed: 3,
  ordersLimit: 6,
  daysLeft: 4,
};

export const HOME_SUGGESTED_MEAL: SuggestedMeal = {
  title: 'Butter Chicken Thali',
  restaurant: 'Saffron Table',
  price: 349,
  reason: 'You usually order dinner around now',
};

export const HOME_GROCERY_ROUTINE: GroceryRoutine = {
  title: 'Sunday grocery run',
  cadenceLabel: 'Every Sunday',
  summary: '8 usual items · milk, eggs, bread +5',
};

export const HOME_RECENT_ORDER: RecentOrder = {
  restaurant: 'Saffron Table',
  date: 'Aug 6',
  summary: 'Butter Chicken, Garlic Naan ×2',
  total: 487,
};


export function planPercent(plan: HomePlan): number {
  return Math.min(100, Math.round((plan.spent / plan.limit) * 100));
}

export function planOrdersLeft(plan: HomePlan): number {
  return Math.max(0, plan.ordersLimit - plan.ordersUsed);
}

export function greetingForHour(hour: number = new Date().getHours()): string {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
