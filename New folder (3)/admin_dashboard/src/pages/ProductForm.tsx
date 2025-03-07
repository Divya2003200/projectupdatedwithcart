
import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useProductStore } from '../stores/Productstore';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormErrorMessage,
  Select,
  useToast,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductById, Product } from '../Api/Prductapi';
import { useQuery } from '@tanstack/react-query';

interface ProductFormData {
  id?: number;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
}

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const toast = useToast();
  const navigate = useNavigate();
  const addProductStore = useProductStore((state) => state.addProduct);
  const updateProductStore = useProductStore((state) => state.updateProduct);
  // Try to get the product from the global store first.
  const globalProduct = useProductStore(
    (state) => state.products.find((p) => p.id === Number(id))
  );

  // Fetch product data only if in edit mode and not found in global store.
  const { data: fetchedProduct } = useQuery<Product, Error>({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(Number(id)),
    enabled: isEditMode && !globalProduct,
  });

  // Use product data from global store if available; otherwise, from fetched data.
  const productData = globalProduct || fetchedProduct;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    defaultValues: productData || {
      title: '',
      description: '',
      price: 0,
      category: '',
      thumbnail: '',
    },
  });

  // When in edit mode and productData is available, reset form values.
  useEffect(() => {
    if (productData) {
      reset(productData);
    }
  }, [productData, reset]);

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    try {
      if (isEditMode && id) {
        await updateProductStore(Number(id), data);
        toast({
          title: 'Product updated successfully',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } else {
        await addProductStore(data);
        toast({
          title: 'Product added successfully',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }
      navigate('/products'); // Navigate back to /products after submission.
    } catch (error) {
      toast({
        title: 'An error occurred',
        description: 'Unable to save product.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
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
        <Input
          type="number"
          {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price must be at least 0' } })}
        />
        {errors.price && <FormErrorMessage>{errors.price.message}</FormErrorMessage>}
      </FormControl>

      <FormControl isInvalid={!!errors.category} mb={4}>
        <FormLabel>Category</FormLabel>
        <Select {...register('category', { required: 'Category is required' })}>
          <option value="">Select Category</option>
          <option value="all">all</option>
          <option value="beauty">beauty</option>
          <option value="fragrances">fragances</option>
          <option value="furniture">furniture</option>
          <option value="groceries">groceries</option>
        </Select>
        {errors.category && <FormErrorMessage>{errors.category.message}</FormErrorMessage>}
      </FormControl>

      <FormControl isInvalid={!!errors.thumbnail} mb={4}>
        <FormLabel>Thumbnail URL</FormLabel>
        <Input {...register('thumbnail', { required: 'Thumbnail URL is required' })} />
        {errors.thumbnail && <FormErrorMessage>{errors.thumbnail.message}</FormErrorMessage>}
      </FormControl>

      <Button type="submit" colorScheme="blue" mr={2}>
        {isEditMode ? 'Update' : 'Add'} Product
      </Button>
      <Button type="button" onClick={() => navigate('/products')}>
        Cancel
      </Button>
    </Box>
  );
};

export default ProductForm;
