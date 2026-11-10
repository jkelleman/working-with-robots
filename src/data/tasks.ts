// Synthetic data. Fictional items and locations for demonstration only.

export interface PickTask {
  id: string;
  sku: string;
  itemName: string;
  quantity: number;
  bin: string; // pod bin, e.g. "B3"
  tote: string; // destination tote slot, e.g. "T2"
}

export const SAMPLE_TASKS: PickTask[] = [
  { id: 'TK-1041', sku: 'SKU-48213', itemName: 'Stainless water bottle, 24 oz', quantity: 1, bin: 'B3', tote: 'T2' },
  { id: 'TK-1042', sku: 'SKU-11907', itemName: 'USB-C charging cable, 6 ft', quantity: 2, bin: 'C1', tote: 'T5' },
  { id: 'TK-1043', sku: 'SKU-70355', itemName: 'Paperback notebook, ruled', quantity: 1, bin: 'A4', tote: 'T1' },
  { id: 'TK-1044', sku: 'SKU-23690', itemName: 'Ceramic coffee mug', quantity: 1, bin: 'D2', tote: 'T6' },
];

export const BIN_ROWS = ['A', 'B', 'C', 'D'];
export const BIN_COLS = [1, 2, 3, 4];
export const TOTE_SLOTS = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
