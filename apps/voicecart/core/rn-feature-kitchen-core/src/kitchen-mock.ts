export type IngredientItem = {
  name: string;
  qty: string;
  price: number;
};

export type DishSet = {
  items: IngredientItem[];
  serves: number;
};

export const DEFAULT_DISH = 'Paneer Butter Masala';

export const DISH_SETS: Record<string, DishSet> = {
  'Paneer Butter Masala': {
    serves: 3,
    items: [
      { name: 'Paneer', qty: '400g', price: 140 },
      { name: 'Butter', qty: '50g', price: 55 },
      { name: 'Tomato purée', qty: '250g', price: 45 },
      { name: 'Cashews', qty: '20g', price: 90 },
      { name: 'Fresh cream', qty: '100ml', price: 48 },
      { name: 'Kasuri methi', qty: '1 tsp', price: 15 },
    ],
  },
  'Dal Tadka': {
    serves: 3,
    items: [
      { name: 'Toor dal', qty: '300g', price: 54 },
      { name: 'Ghee', qty: '2 tbsp', price: 40 },
      { name: 'Cumin seeds', qty: '1 tsp', price: 10 },
      { name: 'Garlic', qty: '6 cloves', price: 12 },
      { name: 'Dried red chilli', qty: '2', price: 8 },
      { name: 'Tomato', qty: '2', price: 16 },
    ],
  },
  'Veg Pulao': {
    serves: 3,
    items: [
      { name: 'Basmati rice', qty: '400g', price: 68 },
      { name: 'Mixed vegetables', qty: '300g', price: 60 },
      { name: 'Whole garam masala', qty: '1 set', price: 25 },
      { name: 'Ghee', qty: '2 tbsp', price: 40 },
      { name: 'Fried onions', qty: '50g', price: 35 },
      { name: 'Mint leaves', qty: '1 handful', price: 10 },
    ],
  },
};

export const RECENT_DISHES = ['Dal Tadka', 'Veg Pulao', 'Paneer Butter Masala'] as const;

export type IngredientSelection = IngredientItem & { need: boolean };

export function resolveDish(input: string): string {
  const trimmed = input.trim();
  if (trimmed && DISH_SETS[trimmed]) {
    return trimmed;
  }
  return DEFAULT_DISH;
}

export function getDishIngredients(dishName: string): IngredientSelection[] {
  const dish = DISH_SETS[resolveDish(dishName)] ?? DISH_SETS[DEFAULT_DISH];
  return dish.items.map((item) => ({ ...item, need: true }));
}

export function getDishServes(dishName: string): number {
  return (DISH_SETS[resolveDish(dishName)] ?? DISH_SETS[DEFAULT_DISH]).serves;
}

export function needCount(items: IngredientSelection[]): number {
  return items.filter((item) => item.need).length;
}

export function addToCartLabel(count: number): string {
  if (count === 0) return 'Nothing to add';
  return `Add ${count} item${count === 1 ? '' : 's'} to cart`;
}
