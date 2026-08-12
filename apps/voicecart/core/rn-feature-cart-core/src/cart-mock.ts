import { HOME_PLAN } from '@voicecart/rn-feature-home-core';
import { formatInr } from '@voicecart/rn-theme';
import { getDishIngredients, resolveDish } from '@voicecart/rn-feature-kitchen-core';

export type CartSource = 'food' | 'kitchen';

export type CartLineItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  editable: boolean;
};

export type CartSnapshot = {
  source: CartSource;
  restaurant: string;
  eta: string;
  distance: string;
  delivery: number;
  items: CartLineItem[];
};

export type CartTotals = {
  itemTotal: number;
  delivery: number;
  taxes: number;
  total: number;
};

export type PlacedOrder = {
  restaurant: string;
  eta: string;
  total: number;
  itemCount: number;
  source: CartSource;
};

export type OrderStageStatus = 'done' | 'current' | 'pending';

export type OrderStage = {
  label: string;
  sub: string;
  status: OrderStageStatus;
};

export const FOOD_DELIVERY = 29;
export const KITCHEN_DELIVERY = 19;
export const SWIGGY_TRACK_URL = 'https://www.swiggy.com';

export function buildFoodCart(): CartSnapshot {
  return {
    source: 'food',
    restaurant: 'Saffron Table',
    eta: '32–38 min',
    distance: '3.2 km',
    delivery: FOOD_DELIVERY,
    items: [
      { id: 'bc', name: 'Butter Chicken', price: 329, qty: 1, editable: true },
      { id: 'gn', name: 'Garlic Naan', price: 79, qty: 2, editable: true },
      { id: 'bir', name: 'Chicken Biryani', price: 249, qty: 1, editable: true },
    ],
  };
}

export function buildKitchenCart(dish?: string): CartSnapshot {
  const dishName = resolveDish(dish ?? '');
  const ingredients = getDishIngredients(dishName).filter((item) => item.need);

  return {
    source: 'kitchen',
    restaurant: 'Instamart',
    eta: '25–30 min',
    distance: '1.8 km',
    delivery: KITCHEN_DELIVERY,
    items: ingredients.map((item) => ({
      id: item.name,
      name: `${item.name} · ${item.qty}`,
      price: item.price,
      qty: 1,
      editable: false,
    })),
  };
}

export function resolveCartSource(raw?: string | string[]): CartSource {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === 'kitchen' ? 'kitchen' : 'food';
}

export function buildCart(source: CartSource, dish?: string): CartSnapshot {
  return source === 'kitchen' ? buildKitchenCart(dish) : buildFoodCart();
}

export function computeTotals(items: CartLineItem[], delivery: number): CartTotals {
  const itemTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const taxes = Math.round(itemTotal * 0.055);
  return {
    itemTotal,
    delivery,
    taxes,
    total: itemTotal + delivery + taxes,
  };
}

export function planImpactLine(source: CartSource, total: number): string {
  if (source === 'kitchen') {
    return "Instamart orders don't count toward your weekly plan.";
  }
  const remaining = Math.max(0, HOME_PLAN.limit - (HOME_PLAN.spent + total));
  return `This order adds ₹${formatInr(total)} to your weekly plan — ₹${formatInr(remaining)} left.`;
}

export function orderPlanNote(source: CartSource, total: number): string {
  if (source === 'kitchen') {
    return "Instamart spend is tracked separately from your weekly food plan.";
  }
  return `₹${formatInr(total)} added to this week's plan.`;
}

export function placeOrderLabel(total: number): string {
  return `Place order · ₹${formatInr(total)}`;
}

export function toPlacedOrder(cart: CartSnapshot, totals: CartTotals): PlacedOrder {
  return {
    restaurant: cart.restaurant,
    eta: cart.eta,
    total: totals.total,
    itemCount: cart.items.reduce((sum, item) => sum + item.qty, 0),
    source: cart.source,
  };
}

export function defaultPlacedOrder(): PlacedOrder {
  const cart = buildFoodCart();
  const totals = computeTotals(cart.items, cart.delivery);
  return toPlacedOrder(cart, totals);
}

export function parsePlacedOrder(params: {
  restaurant?: string | string[];
  eta?: string | string[];
  total?: string | string[];
  itemCount?: string | string[];
  source?: string | string[];
}): PlacedOrder {
  const fallback = defaultPlacedOrder();
  const str = (value?: string | string[]) => {
    if (Array.isArray(value)) return value[0];
    return value;
  };

  const totalRaw = str(params.total);
  const countRaw = str(params.itemCount);
  const total = totalRaw != null ? Number(totalRaw) : NaN;
  const itemCount = countRaw != null ? Number(countRaw) : NaN;

  return {
    restaurant: str(params.restaurant) || fallback.restaurant,
    eta: str(params.eta) || fallback.eta,
    total: Number.isFinite(total) ? total : fallback.total,
    itemCount: Number.isFinite(itemCount) ? itemCount : fallback.itemCount,
    source: resolveCartSource(params.source),
  };
}

export const ORDER_STAGES: OrderStage[] = [
  { label: 'Order confirmed', sub: 'Restaurant has accepted', status: 'done' },
  { label: 'Preparing', sub: 'Your food is being cooked', status: 'current' },
  { label: 'Out for delivery', sub: 'On the way to you', status: 'pending' },
  { label: 'Delivered', sub: 'Enjoy your meal', status: 'pending' },
];

export function changeQty(items: CartLineItem[], id: string, delta: number): CartLineItem[] {
  return items.map((item) => {
    if (item.id !== id || !item.editable) return item;
    return { ...item, qty: Math.max(1, item.qty + delta) };
  });
}
