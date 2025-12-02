import create from 'zustand';


export const useMenuStore = create((set) => ({
items: [],
setItems: (items) => set({ items }),
// simple popularity map for recommendations
increments: {},
incView: (id) => set((s) => ({ increments: { ...s.increments, [id]: (s.increments[id] || 0) + 1 } })),
getMostViewed: () => {
return Object.entries(get().increments || {}).sort((a,b) => b[1]-a[1]).map(([id])=>id);
}
}));