import { create } from 'zustand';

import { persist } from 'zustand/middleware';


export const useCartStore = create(persist((set, get) => ({
items: [],
add: (item) => {
set((state) => {
const existing = state.items.find((i) => i.id === item.id && JSON.stringify(i.opts) === JSON.stringify(item.opts));
if (existing) {
return { items: state.items.map((i) => (i.id === item.id && JSON.stringify(i.opts) === JSON.stringify(item.opts) ? { ...i, qty: i.qty + item.qty } : i)) };
}
return { items: [...state.items, item] };
});
},
remove: (id, opts = {}) => set((s) => ({ items: s.items.filter((i) => !(i.id === id && JSON.stringify(i.opts) === JSON.stringify(opts))) })),
inc: (id, opts = {}) => set((s) => ({ items: s.items.map((i) => (i.id === id && JSON.stringify(i.opts) === JSON.stringify(opts) ? { ...i, qty: i.qty + 1 } : i)) })),
dec: (id, opts = {}) => set((s) => ({ items: s.items.map((i) => (i.id === id && JSON.stringify(i.opts) === JSON.stringify(opts) ? { ...i, qty: Math.max(1, i.qty - 1) } : i)) })),
clear: () => set({ items: [] }),
totalCount: () => get().items.reduce((s, i) => s + i.qty, 0),
totalPrice: () => get().items.reduce((s, i) => s + i.qty * i.price, 0),
}), { name: 'ray-cafe-cart' }));