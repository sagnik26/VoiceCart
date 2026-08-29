export type IngredientItem = {
  name: string;
  qty: string;
  price: number;
};

export type DishSet = {
  items: IngredientItem[];
  serves: number;
};

export const DEFAULT_DISH = 'Dal Tadka';

export const DISH_SETS: Record<string, DishSet> = {
  'Dal Tadka': {
    serves: 2,
    items: [
      { name: 'Toor dal', qty: '200g', price: 42 },
      { name: 'Onion', qty: '1 medium', price: 8 },
      { name: 'Tomato', qty: '2', price: 18 },
      { name: 'Ghee', qty: '1 tbsp', price: 40 },
      { name: 'Cumin seeds', qty: '1 tsp', price: 10 },
    ],
  },
  'Aloo Paratha': {
    serves: 2,
    items: [
      { name: 'Potato', qty: '3 medium', price: 24 },
      { name: 'Atta', qty: '300g', price: 28 },
      { name: 'Ghee', qty: '2 tbsp', price: 40 },
      { name: 'Green chilli', qty: '2', price: 6 },
    ],
  },
  'Veg Pulao': {
    serves: 3,
    items: [
      { name: 'Basmati rice', qty: '400g', price: 68 },
      { name: 'Mixed vegetables', qty: '300g', price: 60 },
      { name: 'Ghee', qty: '2 tbsp', price: 40 },
      { name: 'Whole garam masala', qty: '1 set', price: 25 },
    ],
  },
  'Jeera Rice': {
    serves: 2,
    items: [
      { name: 'Basmati rice', qty: '250g', price: 45 },
      { name: 'Cumin seeds', qty: '1 tsp', price: 10 },
      { name: 'Ghee', qty: '1 tbsp', price: 40 },
    ],
  },
  'Tomato Rasam': {
    serves: 2,
    items: [
      { name: 'Tomato', qty: '3', price: 27 },
      { name: 'Tamarind', qty: 'small ball', price: 12 },
      { name: 'Rasam powder', qty: '2 tsp', price: 15 },
      { name: 'Curry leaves', qty: '1 sprig', price: 5 },
    ],
  },
};

export const RECENT_DISHES = ['Dal Tadka', 'Aloo Paratha', 'Veg Pulao', 'Chole'] as const;

export type IngredientSelection = IngredientItem & { need: boolean };

export type KitchenMode = 'cook' | 'reverse';

export type ReverseSuggestion = {
  dish: string;
  missingCount: number;
};

const SERVING_PATTERN = /(?:for|serves?)\s*(\d+)/i;

export function parseServings(input: string, fallback = 2): number {
  const match = input.match(SERVING_PATTERN);
  if (!match) return fallback;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function resolveDish(input: string): string {
  const trimmed = input.trim();
  const normalized = Object.keys(DISH_SETS).find(
    (name) => name.toLowerCase() === trimmed.toLowerCase()
  );
  if (normalized) return normalized;
  return DEFAULT_DISH;
}

export function getDishIngredients(dishName: string, staplesHave: string[] = []): IngredientSelection[] {
  const dish = DISH_SETS[resolveDish(dishName)] ?? DISH_SETS[DEFAULT_DISH];
  const stapleSet = new Set(staplesHave.map((s) => s.toLowerCase()));
  return dish.items.map((item) => ({
    ...item,
    need: !stapleSet.has(item.name.toLowerCase()),
  }));
}

export function getDishServes(dishName: string, input?: string): number {
  if (input) {
    const parsed = parseServings(input);
    if (parsed !== 2 || SERVING_PATTERN.test(input)) return parsed;
  }
  return (DISH_SETS[resolveDish(dishName)] ?? DISH_SETS[DEFAULT_DISH]).serves;
}

export function needCount(items: IngredientSelection[]): number {
  return items.filter((item) => item.need).length;
}

export function addToCartLabel(count: number): string {
  if (count === 0) return 'Nothing to add';
  return `Add ${count} item${count === 1 ? '' : 's'} to cart`;
}

export const PANTRY_STAPLES = ['Salt', 'Oil', 'Onion', 'Garlic paste', 'Rice', 'Turmeric'] as const;

export const RUNNING_LOW = ['Milk', 'Eggs'] as const;

export type PantryStaple = {
  name: string;
  enabled: boolean;
};

let pantryStaplesState: PantryStaple[] = PANTRY_STAPLES.map((name) => ({
  name,
  enabled: ['Onion', 'Rice', 'Turmeric'].includes(name),
}));

export function getPantryStaples(): PantryStaple[] {
  return pantryStaplesState.map((s) => ({ ...s }));
}

export function getEnabledPantryNames(): string[] {
  return pantryStaplesState.filter((s) => s.enabled).map((s) => s.name);
}

export function setPantryStapleEnabled(name: string, enabled: boolean): PantryStaple[] {
  pantryStaplesState = pantryStaplesState.map((s) =>
    s.name.toLowerCase() === name.toLowerCase() ? { ...s, enabled } : s
  );
  return getPantryStaples();
}

export function addPantryStaple(name: string): PantryStaple[] {
  const trimmed = name.trim();
  if (!trimmed) return getPantryStaples();
  if (pantryStaplesState.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
    return getPantryStaples();
  }
  pantryStaplesState = [...pantryStaplesState, { name: trimmed, enabled: true }];
  return getPantryStaples();
}

export function rankDishesFromPantry(pantryItems: string[]): ReverseSuggestion[] {
  const have = new Set(pantryItems.map((i) => i.toLowerCase()));
  return Object.keys(DISH_SETS)
    .map((dish) => {
      const items = DISH_SETS[dish].items;
      const missingCount = items.filter((item) => !have.has(item.name.toLowerCase())).length;
      return { dish, missingCount };
    })
    .sort((a, b) => a.missingCount - b.missingCount)
    .slice(0, 3);
}

export function parsePantryUtterance(text: string): string[] {
  return text
    .replace(/^i have\s+/i, '')
    .split(/,|\band\b/i)
    .map((s) => s.trim())
    .filter(Boolean);
}
