export type HistoryFilter = 'all' | 'cooked' | 'ordered';

export type HistoryEntry = {
  id: string;
  date: string;
  kind: 'cooked' | 'ordered';
  label: string;
  detail: string;
  total?: number;
};

export const HISTORY_ENTRIES: HistoryEntry[] = [
  {
    id: '1',
    date: 'Today',
    kind: 'cooked',
    label: 'Dal tadka',
    detail: 'Cooked · 2 servings',
  },
  {
    id: '2',
    date: 'Mon',
    kind: 'ordered',
    label: 'Paneer roll',
    detail: 'Ordered · Saffron Spice',
    total: 180,
  },
  {
    id: '3',
    date: 'Sat',
    kind: 'cooked',
    label: 'Veg pulao',
    detail: 'Cooked · 3 servings',
  },
  {
    id: '4',
    date: 'Sat',
    kind: 'ordered',
    label: 'Masala dosa',
    detail: 'Ordered · South Kitchen',
    total: 120,
  },
];

export function filterHistory(filter: HistoryFilter): HistoryEntry[] {
  if (filter === 'all') return HISTORY_ENTRIES;
  return HISTORY_ENTRIES.filter((entry) => entry.kind === filter);
}

export function formatHistoryRow(entry: HistoryEntry): string {
  const prefix = entry.kind === 'cooked' ? 'Cooked' : 'Ordered';
  return `${entry.date} · ${prefix} · ${entry.label}`;
}
