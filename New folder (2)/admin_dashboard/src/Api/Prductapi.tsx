// // src/api/productApi.ts
// import axios from 'axios';

// export interface Product {
//   id: number;
//   title: string;
//   price: number;
//   description: string;
//   category: string;
//   thumbnail?: string;
//   images?: string[];
// }

// const API_URL = 'https://dummyjson.com/products';

// export const fetchProducts = async (): Promise<Product[]> => {
//   const response = await axios.get(API_URL);
//   // DummyJSON returns an object with a "products" property.
//   return response.data.products;
// };

// export const fetchProductById = async (id: number): Promise<Product> => {
//   const response = await axios.get(`${API_URL}/${id}`);
//   return response.data;
// };

// export const addProduct = async (product: Partial<Product>): Promise<Product> => {
//   const response = await axios.post(`${API_URL}/add`, product);
//   return response.data;
// };

// export const updateProduct = async (id: number, product: Partial<Product>): Promise<Product> => {
//   const response = await axios.put(`${API_URL}/${id}`, product);
//   return response.data;
// };

// export const deleteProduct = async (id: number): Promise<Product> => {
//   const response = await axios.delete(`${API_URL}/${id}`);
//   return response.data;
// };
import axios from 'axios';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  thumbnail?: string;
  images?: string[];
}

const API_URL = 'https://dummyjson.com/products';

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await axios.get(API_URL);
  // DummyJSON returns an object with a "products" property.
  return response.data.products;
};

export const fetchProductById = async (id: number): Promise<Product> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const addProduct = async (product: Partial<Product>): Promise<Product> => {
  const response = await axios.post(`${API_URL}/add`, product);
  return response.data;
};

// export const updateProduct = async (id: number, product: Partial<Product>): Promise<Product> => {
//   const response = await axios.put(`${API_URL}/${id}`, product);
//   return response.data;
// };

export const updateProduct = async (id: number, product: Partial<Product>): Promise<Product> => {
  // Exclude the id field from the payload.
  const { id: _, ...updateData } = product;
  const response = await axios.put(`${API_URL}/${id}`, updateData);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<Product> => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
