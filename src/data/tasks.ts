// Synthetic data. Fictional items, orders, and locations for demonstration only.

export type ItemKind = 'bottle' | 'cable' | 'notebook' | 'mug' | 'box' | 'can' | 'tube' | 'book';

export interface PickTask {
  id: string;
  sku: string;
  itemName: string; // full catalog name
  short: [string, string]; // [singular, plural] for plain-language instructions
  icon: ItemKind;
  quantity: number;
  bin: string; // shelf bin, e.g. "B3"
  tote: string; // order tote slot, e.g. "T2"
}

export const SAMPLE_TASKS: PickTask[] = [
  { id: 'TK-1041', sku: 'SKU-48213', itemName: 'Stainless water bottle, 24 oz', short: ['water bottle', 'water bottles'], icon: 'bottle', quantity: 1, bin: 'B3', tote: 'T2' },
  { id: 'TK-1042', sku: 'SKU-11907', itemName: 'USB-C charging cable, 6 ft', short: ['USB-C cable', 'USB-C cables'], icon: 'cable', quantity: 2, bin: 'C1', tote: 'T5' },
  { id: 'TK-1043', sku: 'SKU-70355', itemName: 'Paperback notebook, ruled', short: ['notebook', 'notebooks'], icon: 'notebook', quantity: 1, bin: 'A4', tote: 'T1' },
  { id: 'TK-1044', sku: 'SKU-23690', itemName: 'Ceramic coffee mug', short: ['coffee mug', 'coffee mugs'], icon: 'mug', quantity: 1, bin: 'D2', tote: 'T6' },
];

export const itemPhrase = (t: PickTask) => `${t.quantity} ${t.quantity === 1 ? t.short[0] : t.short[1]}`;

export const BIN_ROWS = ['A', 'B', 'C', 'D'];
export const BIN_COLS = [1, 2, 3, 4];
export const TOTE_SLOTS = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];

/** Each tote holds one customer's order. */
export const TOTE_ORDERS: Record<string, string> = {
  T1: '#40871', T2: '#40872', T3: '#40873', T4: '#40874', T5: '#40875', T6: '#40876',
};

/** What's stocked in every bin, so the shelf looks like a real, mixed shelf. */
const FILLER: ItemKind[] = ['box', 'can', 'tube', 'book', 'box', 'can', 'book', 'tube'];
export const BIN_STOCK: Record<string, ItemKind> = Object.fromEntries(
  BIN_ROWS.flatMap((r, ri) => BIN_COLS.map((c, ci) => [`${r}${c}`, FILLER[(ri * 3 + ci) % FILLER.length]])),
);
for (const t of SAMPLE_TASKS) BIN_STOCK[t.bin] = t.icon;

/**
 * Body zone for each pod row. The power zone (mid-thigh to mid-chest) is where
 * picks need no reaching or bending. Row A is above it, row D below it.
 */
export type BodyZone = 'reach' | 'zone' | 'bend';
export const rowZone = (bin: string): BodyZone => (bin.startsWith('A') ? 'reach' : bin.startsWith('D') ? 'bend' : 'zone');
export const ZONE_TIP: Record<BodyZone, string> = {
  reach: 'Top row: above your power zone. Use the step if you need it.',
  zone: '',
  bend: 'Bottom row: bend at the knees, not the back.',
};
