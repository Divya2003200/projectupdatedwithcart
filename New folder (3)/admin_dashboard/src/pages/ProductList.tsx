
import React, { useState, useReducer, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, Product } from '../Api/Prductapi'
import { useProductStore } from '../stores/Productstore'
import { Box, Input, Select, SimpleGrid, Spinner, Button } from '@chakra-ui/react';
import ProductCard from './ProductCard'
import { useNavigate } from 'react-router-dom';

enum SortActionType {
  PRICE_ASC = 'PRICE_ASC',
  PRICE_DESC = 'PRICE_DESC',
}

type SortAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: SortActionType };

const sortReducer = (state: Product[], action: SortAction): Product[] => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return action.payload;
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
  const navigate = useNavigate();

  // Fetch products using TanStack Query.
  const { data, isLoading } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // Initialize global store only if it's empty.
  useEffect(() => {
    if (data && data.length > 0 && products.length === 0) {
      setProducts(data);
    }
  }, [data, setProducts, products.length]);

  // Local state for search and filter.
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Local sorting state using useReducer (initialized with global products).
  const [sortedProducts, dispatch] = useReducer(sortReducer, products);

  // Update local sortedProducts when global products change.
  useEffect(() => {
    dispatch({ type: 'SET_PRODUCTS', payload: products });
    dispatch({ type: SortActionType.PRICE_ASC });
  }, [products]);

  // Filter products by search term and category.
  const filteredProducts = sortedProducts.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || p.category === selectedCategory)
  );

  // Derive unique categories from global products.
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  if (isLoading) return <Spinner />;

  return (
    <Box p={5}>
      {/* Add Product button */}
      <Button colorScheme="green" mb={4} onClick={() => navigate('/new')}>
        Add Product
      </Button>
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
