export type Restaurant = {
  id: string;
  name: string;
  priceForTwo: number;
  rating: number;
  etaMinutes: number;
  tags: string[];
};

export type MenuSection = {
  title: string;
  items: { id: string; name: string; price: number }[];
};

export const RESTAURANT_FILTERS = ['Under ₹300', 'Rated 4+', 'Veg only', '< 30 min'] as const;

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'saffron-spice',
    name: 'Saffron Spice',
    priceForTwo: 380,
    rating: 4.3,
    etaMinutes: 32,
    tags: ['North Indian'],
  },
  {
    id: 'punjab-grill',
    name: 'Punjab Grill Express',
    priceForTwo: 420,
    rating: 4.5,
    etaMinutes: 28,
    tags: ['Punjabi'],
  },
  {
    id: 'south-kitchen',
    name: 'South Kitchen',
    priceForTwo: 250,
    rating: 4.1,
    etaMinutes: 25,
    tags: ['South Indian'],
  },
];

export function getRestaurant(id?: string): Restaurant {
  return RESTAURANTS.find((r) => r.id === id) ?? RESTAURANTS[0];
}

export function getMenu(restaurantId?: string): MenuSection[] {
  void restaurantId;
  return [
    {
      title: 'Popular',
      items: [
        { id: 'pr', name: 'Paneer roll', price: 180 },
        { id: 'dt', name: 'Dal tadka', price: 160 },
        { id: 'bn', name: 'Butter naan', price: 45 },
      ],
    },
    {
      title: 'Mains',
      items: [
        { id: 'cb', name: 'Chole bhature', price: 190 },
        { id: 'rc', name: 'Rajma chawal', price: 170 },
      ],
    },
  ];
}
