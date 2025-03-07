// src/store/productStore.ts
import { create } from 'zustand';
import { fetchProducts, addProduct as apiAddProduct, updateProduct as apiUpdateProduct, deleteProduct as apiDeleteProduct, Product } from '../Api/Prductapi'

interface ProductState {
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Partial<Product>) => Promise<void>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  setProducts: (products: Product[]) => set({ products }),
  
  addProduct: async (product: Partial<Product>) => {
    const newProduct = await apiAddProduct(product);
    set({ products: [...get().products, newProduct] });
  },

  updateProduct: async (id: number, product: Partial<Product>) => {
    const updated = await apiUpdateProduct(id, product);
    set({ products: get().products.map(p => (p.id === id ? updated : p)) });
  },

  deleteProduct: async (id: number) => {
    await apiDeleteProduct(id);
    set({ products: get().products.filter(p => p.id !== id) });
  },
}));
