
import { create } from 'zustand';
import { addProduct as apiAddProduct, updateProduct as apiUpdateProduct, deleteProduct as apiDeleteProduct, Product } from '../Api/Prductapi';
//import {fetchProducts, addProduct as apiAddProduct, updateProduct as apiUpdateProduct, deleteProduct as apiDeleteProduct, Product } from '../Api/Prductapi';
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
    try {
      const newProduct = await apiAddProduct(product);
      set({ products: [...get().products, newProduct] });
    } catch (error) {
      // Fallback: assign a unique id (using Date.now()) for manually added product.
      const newProduct = { ...product, id: Date.now() } as Product;
      set({ products: [...get().products, newProduct] });
    }
  },

  updateProduct: async (id: number, product: Partial<Product>) => {
    // If id > 30, assume it's a manually added product.
    if (id > 30) {
      set({ products: get().products.map(p => (p.id === id ? { ...p, ...product } : p)) });
      return;
    }
    try {
      const updated = await apiUpdateProduct(id, product);
      set({ products: get().products.map(p => (p.id === id ? updated : p)) });
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        // API update failed because the product doesn't exist on the server—update locally.
        set({ products: get().products.map(p => (p.id === id ? { ...p, ...product } : p)) });
      } else {
        throw error;
      }
    }
  },

  deleteProduct: async (id: number) => {
    // If id > 30, assume it's manually added—delete locally.
    if (id > 30) {
      set({ products: get().products.filter(p => p.id !== id) });
      return;
    }
    try {
      await apiDeleteProduct(id);
      set({ products: get().products.filter(p => p.id !== id) });
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        // API delete failed—delete locally.
        set({ products: get().products.filter(p => p.id !== id) });
      } else {
        throw error;
      }
    }
  },
}));
