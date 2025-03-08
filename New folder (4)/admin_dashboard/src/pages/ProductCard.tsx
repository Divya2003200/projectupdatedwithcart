
import React from 'react';
import { Box, Image, Text, Button, HStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../Api/Prductapi'
import { useProductStore } from '../stores/Productstore'

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const deleteProduct = useProductStore((state) => state.deleteProduct);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(product.id);
    }
  };

  // Use thumbnail if available, otherwise first image from images.
  const imageUrl = product.thumbnail || (product.images && product.images.length > 0 ? product.images[0] : '');

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} boxShadow="md">
      {imageUrl && <Image src={imageUrl} alt={product.title} />}
      <Text fontWeight="bold" mt={2}>{product.title}</Text>
      <Text>${product.price}</Text>
      <HStack spacing={2} mt={2}>
        <Button colorScheme="blue" onClick={() => navigate(`/product/${product.id}`)}>
          View Details
        </Button>
        <Button colorScheme="orange" onClick={() => navigate(`/edit/${product.id}`)}>
          Edit
        </Button>
        <Button colorScheme="red" onClick={handleDelete}>
          Delete
        </Button>
      </HStack>
    </Box>
  );
};

export default ProductCard;
