// src/pages/ProductList.tsx
import React, { useState, useReducer, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, Product } from '../Api/Prductapi'
import { useProductStore } from '../stores/Productstore'
import { Box, Input, Select, SimpleGrid, Spinner } from '@chakra-ui/react';
import ProductCard from './ProductCard'

enum SortActionType {
  PRICE_ASC = 'PRICE_ASC',
  PRICE_DESC = 'PRICE_DESC',
}

type SortAction = { type: SortActionType };

const sortReducer = (state: Product[], action: SortAction): Product[] => {
  switch (action.type) {
    case SortActionType.PRICE_ASC:
      return [...state].sort((a, b) => a.price - b.price);
    case SortActionType.PRICE_DESC:
      return [...state].sort((a, b) => b.price - a.price);
    default:
      return state;
  }
};

const ProductList: React.FC = () => {
  const { setProducts, products } = useProductStore();

  // Fetch products without onSuccess in the query options.
  const { data, isLoading } = useQuery<Product[], Error>({
    queryKey: ['products'] as readonly string[],
    queryFn: fetchProducts,
  });

  // Update global store when data is fetched.
  useEffect(() => {
    if (data && data.length > 0) {
      setProducts(data);
    }
  }, [data, setProducts]);

  // Local state for search and category filter.
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Local sorting state using useReducer (initial state from global products).
  const [sortedProducts, dispatch] = useReducer(sortReducer, products);

  // Update sortedProducts when global products change (default sort: PRICE_ASC).
  useEffect(() => {
    dispatch({ type: SortActionType.PRICE_ASC });
  }, [products]);

  // Filter products by search term and selected category.
  const filteredProducts = sortedProducts.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || p.category === selectedCategory)
  );

  // Derive unique categories from global products.
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  if (isLoading) return <Spinner />;

  return (
    <Box p={5}>
      <Input
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
      />
      <Select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        mb={4}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </Select>
      <Select onChange={(e) => dispatch({ type: e.target.value as SortActionType })} mb={4}>
        <option value="">Sort by</option>
        <option value="PRICE_ASC">Price: Low to High</option>
        <option value="PRICE_DESC">Price: High to Low</option>
      </Select>
      <SimpleGrid columns={3} spacing={4}>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ProductList;
