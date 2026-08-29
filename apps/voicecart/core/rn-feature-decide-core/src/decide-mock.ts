export type DecideComparison = {
  dish: string;
  servings: number;
  cook: {
    missingCount: number;
    cost: number;
    readyMinutes: number;
    calorieNote: string;
  };
  order: {
    restaurant: string;
    cost: number;
    etaMinutes: number;
  };
};

const COMPARISONS: Record<string, DecideComparison> = {
  'Dal Tadka': {
    dish: 'Dal Tadka',
    servings: 2,
    cook: {
      missingCount: 3,
      cost: 140,
      readyMinutes: 25,
      calorieNote: 'Home-cooked is roughly 30% lighter',
    },
    order: {
      restaurant: 'Saffron Spice',
      cost: 380,
      etaMinutes: 32,
    },
  },
};

export function getDecideComparison(dishInput?: string): DecideComparison {
  const dish = dishInput?.trim() || 'Dal Tadka';
  const normalized = Object.keys(COMPARISONS).find(
    (key) => key.toLowerCase() === dish.toLowerCase()
  );
  return COMPARISONS[normalized ?? 'Dal Tadka'] ?? COMPARISONS['Dal Tadka'];
}
