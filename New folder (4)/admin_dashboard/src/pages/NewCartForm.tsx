
import React, { useState } from "react";
import { Box, Heading, Input, Button, useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addItemToCart } from "../Api/CartApi";
import { recalcCartTotals } from "../pages/Cart";
import { useCartStore } from "../stores/Cartstore";
import { Cart } from "../pages/Cart";

interface NewCartFormProps {
  cart: Cart[];
  setCart: (cart: Cart[]) => void;
  addItem: (cart: Cart) => void;
}

const NewCartForm: React.FC<NewCartFormProps> = ({ cart, setCart, addItem }) => {
  const [newUserId, setNewUserId] = useState<string>("");
  const [newProductId, setNewProductId] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<string>("");
  const toast = useToast();
  const queryClient = useQueryClient();
  const { cart: globalCart } = useCartStore();

  const addCartMutation = useMutation({
    mutationFn: () =>
      addItemToCart({
        userId: Number(newUserId),
        products: [{ id: Number(newProductId), quantity: Number(newQuantity) }],
      }),
    onSuccess: (newCart) => {
      // If API returns duplicate ID, override for uniqueness.
      if (newCart.id === 51) {
        newCart.id = Math.floor(Math.random() * 1000) + 100;
      }
      // We expect newCart.products to have one product object:
      const product = newCart.products[0];

      // If the API didn't return discountedTotal, fetch full product details
      if (typeof product.discountedTotal !== "number") {
        axios
          .get(`https://dummyjson.com/products/${product.id}`)
          .then((res) => {
            const prodDetails = res.data;

            // 1) For a single unit discount:
            // const discountedPrice = prodDetails.price * (1 - prodDetails.discountPercentage / 100);

            // 2) If you want discount for the entire quantity:
            const totalPrice = prodDetails.price * product.quantity;
            const computedDiscountedTotal =
              totalPrice - totalPrice * (prodDetails.discountPercentage / 100);

            // Store the per-unit discounted price OR the total discounted price:
            // If recalcCartTotals multiplies discountedTotal by quantity again,
            // store the *per-unit* discounted price:
            const perUnitDiscountedPrice =
              computedDiscountedTotal / product.quantity;

            const fullProduct = {
              id: prodDetails.id,
              title: prodDetails.title,
              price: prodDetails.price,
              quantity: product.quantity,
              // Choose one:
              // discountedTotal: computedDiscountedTotal,  // If you store the total
              discountedTotal: perUnitDiscountedPrice,      // If your recalcCartTotals multiplies by quantity
              thumbnail: prodDetails.thumbnail,
            };

            newCart.products = [fullProduct];

            // Recalculate the overall totals (total, discountedTotal, etc.)
            const totals = recalcCartTotals(newCart.products);
            const cartWithTotals = { ...newCart, ...totals };
            addItem(cartWithTotals);
            setCart([...cart, cartWithTotals]);
            queryClient.invalidateQueries({ queryKey: ["carts"] });
            toast({
              title: "Cart Created",
              description: "A new cart has been created.",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          })
          .catch(() => {
            toast({
              title: "Error",
              description: "Failed to fetch product details.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          })
          .finally(() => {
            setNewUserId("");
            setNewProductId("");
            setNewQuantity("");
          });
      } else {
        // If discountedTotal is already present, use it directly.
        const totals = recalcCartTotals(newCart.products);
        const cartWithTotals = { ...newCart, ...totals };
        addItem(cartWithTotals);
        setCart([...cart, cartWithTotals]);
        queryClient.invalidateQueries({ queryKey: ["carts"] });
        toast({
          title: "Cart Created",
          description: "A new cart has been created.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setNewUserId("");
        setNewProductId("");
        setNewQuantity("");
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create a new cart.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} mb={8}>
      <Heading as="h3" size="md" mb={4}>
        Create New Cart
      </Heading>
      <Input
        type="number"
        value={newUserId}
        onChange={(e) => setNewUserId(e.target.value)}
        placeholder="Enter User ID"
        mb={2}
      />
      <Input
        type="number"
        value={newProductId}
        onChange={(e) => setNewProductId(e.target.value)}
        placeholder="Enter Product ID"
        mb={2}
      />
      <Input
        type="number"
        value={newQuantity}
        onChange={(e) => setNewQuantity(e.target.value)}
        placeholder="Enter Quantity"
        mb={2}
      />
      <Button colorScheme="blue" onClick={() => addCartMutation.mutate()}>
        Create Cart
      </Button>
    </Box>
  );
};

export default NewCartForm;

