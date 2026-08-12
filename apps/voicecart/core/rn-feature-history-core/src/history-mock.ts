export type HistoryOrder = {
  date: string;
  restaurant: string;
  summary: string;
  total: number;
};

export const HISTORY_ORDERS: HistoryOrder[] = [
  {
    date: 'Aug 6',
    restaurant: 'Saffron Table',
    summary: 'Butter Chicken, Garlic Naan ×2',
    total: 487,
  },
  {
    date: 'Aug 3',
    restaurant: 'Rasoi Express',
    summary: 'Veg Hakka Noodles, Manchurian',
    total: 356,
  },
  {
    date: 'Jul 30',
    restaurant: 'Nawabi Handi',
    summary: 'Mutton Rogan Josh, Jeera Rice',
    total: 612,
  },
];
