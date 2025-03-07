// src/pages/ProductForm.tsx
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useProductStore } from'../stores/Productstore'
import { Box, Button, FormControl, FormLabel, Input, Textarea, FormErrorMessage } from '@chakra-ui/react';

interface ProductFormData {
  id?: number;
  title: string;
  description: string;
  price: number;
  category: string;
}

interface ProductFormProps {
  product?: ProductFormData;
  onClose?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: product || {
      title: '',
      description: '',
      price: 0,
      category: '',
    },
  });

  const addProductStore = useProductStore(state => state.addProduct);
  const updateProductStore = useProductStore(state => state.updateProduct);

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    if (product?.id) {
      await updateProductStore(product.id, data);
    } else {
      await addProductStore(data);
    }
    if (onClose) onClose();
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={4} borderWidth="1px" borderRadius="lg" mt={4}>
      <FormControl isInvalid={!!errors.title} mb={4}>
        <FormLabel>Title</FormLabel>
        <Input {...register('title', { required: 'Title is required' })} />
        {errors.title && <FormErrorMessage>{errors.title.message}</FormErrorMessage>}
      </FormControl>
      <FormControl isInvalid={!!errors.description} mb={4}>
        <FormLabel>Description</FormLabel>
        <Textarea {...register('description', { required: 'Description is required' })} />
        {errors.description && <FormErrorMessage>{errors.description.message}</FormErrorMessage>}
      </FormControl>
      <FormControl isInvalid={!!errors.price} mb={4}>
        <FormLabel>Price</FormLabel>
        <Input type="number" {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price must be at least 0' } })} />
        {errors.price && <FormErrorMessage>{errors.price.message}</FormErrorMessage>}
      </FormControl>
      <FormControl isInvalid={!!errors.category} mb={4}>
        <FormLabel>Category</FormLabel>
        <Input {...register('category', { required: 'Category is required' })} />
        {errors.category && <FormErrorMessage>{errors.category.message}</FormErrorMessage>}
      </FormControl>
      <Button type="submit" colorScheme="blue" mr={2}>
        {product ? 'Update' : 'Add'} Product
      </Button>
      {onClose && <Button type="button" onClick={onClose}>Cancel</Button>}
    </Box>
  );
};

export default ProductForm;
