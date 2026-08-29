export type CartSource = 'food' | 'instamart';

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
  substitutionNote?: string;
  cookItCostNote?: string;
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
export const INSTAMART_DELIVERY = 19;
export const SWIGGY_TRACK_URL = 'https://www.swiggy.com';

export function buildFoodCart(restaurant?: string): CartSnapshot {
  return {
    source: 'food',
    restaurant: restaurant ?? 'Saffron Spice',
    eta: '32–38 min',
    distance: '3.2 km',
    delivery: FOOD_DELIVERY,
    cookItCostNote: 'Cooking this would cost roughly ₹140',
    items: [
      { id: 'dt', name: 'Dal tadka', price: 160, qty: 1, editable: true },
      { id: 'bn', name: 'Butter naan', price: 45, qty: 2, editable: true },
    ],
  };
}

export function buildInstamartCart(dish?: string): CartSnapshot {
  void dish;
  return {
    source: 'instamart',
    restaurant: 'Instamart',
    eta: '14–20 min',
    distance: '1.8 km',
    delivery: INSTAMART_DELIVERY,
    substitutionNote: 'Ghee out of stock — substituted with Amul butter',
    items: [
      { id: 'dal', name: 'Toor dal 200g', price: 42, qty: 1, editable: false },
      { id: 'tomato', name: 'Tomato ×2', price: 18, qty: 1, editable: false },
    ],
  };
}

export function resolveCartSource(raw?: string | string[]): CartSource {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === 'instamart' || value === 'kitchen') return 'instamart';
  return 'food';
}

export function buildCart(source: CartSource, dish?: string, restaurant?: string): CartSnapshot {
  return source === 'instamart' ? buildInstamartCart(dish) : buildFoodCart(restaurant);
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

export function placeOrderLabel(total: number): string {
  return `Place order · ₹${total.toLocaleString('en-IN')}`;
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

export const FOOD_ORDER_STAGES: OrderStage[] = [
  { label: 'Confirmed', sub: 'Restaurant has accepted', status: 'done' },
  { label: 'Preparing', sub: 'Your food is being cooked', status: 'current' },
  { label: 'Picked up', sub: 'On the way to you', status: 'pending' },
  { label: 'Delivered', sub: 'Enjoy your meal', status: 'pending' },
];

export const INSTAMART_ORDER_STAGES: OrderStage[] = [
  { label: 'Order placed', sub: 'Instamart received your order', status: 'done' },
  { label: 'Packed', sub: 'Items are being packed', status: 'current' },
  { label: 'Out for delivery', sub: 'On the way to you', status: 'pending' },
  { label: 'Delivered', sub: 'Ingredients at your door', status: 'pending' },
];

export function orderStagesForSource(source: CartSource): OrderStage[] {
  return source === 'instamart' ? INSTAMART_ORDER_STAGES : FOOD_ORDER_STAGES;
}

export function orderStatusNote(source: CartSource, total: number): string {
  if (source === 'instamart') {
    return `Instamart · ₹${total.toLocaleString('en-IN')}`;
  }
  return `Restaurant order · ₹${total.toLocaleString('en-IN')}`;
}

export function changeQty(items: CartLineItem[], id: string, delta: number): CartLineItem[] {
  return items.map((item) => {
    if (item.id !== id || !item.editable) return item;
    return { ...item, qty: Math.max(1, item.qty + delta) };
  });
}
