export type HomeActivity = {
  kind: 'cooked' | 'ordered';
  label: string;
  date: string;
};

export type PantryChip = {
  name: string;
  status: 'have' | 'low';
};

export type TonightsPick = {
  dish: string;
  cookCost: number;
  orderCost: number;
  servings: number;
};

export const HOME_USER = {
  firstName: 'Aisha',
  avatarInitial: 'A',
} as const;

export const HOME_TONIGHTS_PICK: TonightsPick = {
  dish: 'Dal tadka',
  cookCost: 140,
  orderCost: 380,
  servings: 2,
};

export const HOME_RECENT_ACTIVITY: HomeActivity[] = [
  { kind: 'cooked', label: 'Rajma chawal', date: 'Yesterday' },
  { kind: 'ordered', label: 'Paneer roll', date: 'Mon' },
  { kind: 'cooked', label: 'Aloo paratha', date: 'Sat' },
];

export const HOME_PANTRY_CHIPS: PantryChip[] = [
  { name: 'Rice', status: 'have' },
  { name: 'Onion', status: 'have' },
  { name: 'Milk', status: 'low' },
  { name: 'Eggs', status: 'have' },
];

export function greetingForHour(hour: number = new Date().getHours()): string {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function formatActivityRow(activity: HomeActivity): string {
  const prefix = activity.kind === 'cooked' ? 'Cooked' : 'Ordered';
  return `${prefix} · ${activity.label}`;
}

export function pantryChipLabel(chip: PantryChip): string {
  if (chip.status === 'low') return `${chip.name} low`;
  return `${chip.name} ✓`;
}
