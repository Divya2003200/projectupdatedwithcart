// // src/components/ProductCard.tsx
// import React from 'react';
// import { Box, Image, Text, Button } from '@chakra-ui/react';
// import { useNavigate } from 'react-router-dom';
// import { Product } from '../Api/Prductapi'

// const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
//   const navigate = useNavigate();

//   return (
//     <Box borderWidth="1px" borderRadius="lg" p={4} boxShadow="md">
//       {product.image && <Image src={product.image} alt={product.title} />}
//       <Text fontWeight="bold" mt={2}>{product.title}</Text>
//       <Text>${product.price}</Text>
//       <Button colorScheme="blue" mt={2} onClick={() => navigate(`/product/${product.id}`)}>
//         View Details
//       </Button>
//     </Box>
//   );
// };

// export default ProductCard;
// src/components/ProductCard.tsx
import React from 'react';
import { Box, Image, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../Api/Prductapi';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const navigate = useNavigate();

  // Use the thumbnail if available, otherwise use the first image from images array
  const imageUrl = product.thumbnail || (product.images && product.images.length > 0 ? product.images[0] : '');

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} boxShadow="md">
      {imageUrl && <Image src={imageUrl} alt={product.title} />}
      <Text fontWeight="bold" mt={2}>{product.title}</Text>
      <Text>${product.price}</Text>
      <Button colorScheme="blue" mt={2} onClick={() => navigate(`/product/${product.id}`)}>
        View Details
      </Button>
    </Box>
  );
};

export default ProductCard;
