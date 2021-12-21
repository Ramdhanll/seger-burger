import { Box, Button, HStack, Image, Text } from '@chakra-ui/react'
import React, { FC } from 'react'
import IProduct from '../../../../interfaces/IProduct'

interface IItemOrder {
   order: IProduct
   handleAddOrder: (product: IProduct) => void
   handleRemoveOrder: (product: IProduct) => void
}

const ItemOrder: FC<IItemOrder> = ({
   order,
   handleAddOrder,
   handleRemoveOrder,
}) => {
   return (
      <Box
         d='flex'
         justifyContent='space-between'
         alignItems='center'
         gridGap={4}
         w='100%'
      >
         <HStack spacing={2} alignItems='center' justifyContent='start' w='40%'>
            <Image
               src={order.photo}
               fallbackSrc='https://via.placeholder.com/150'
               minW='50px'
               maxW='50px'
               h='50px'
               borderRadius='md'
            />
            <Text fontSize={['xs', 'sm']} color='gray.600' fontWeight={400}>
               {order.name}
            </Text>
         </HStack>

         <HStack
            spacing={3}
            alignItems='center'
            justifyContent='space-between'
            w='40%'
         >
            <Button
               variant='solid'
               colorScheme='gray'
               onClick={() => handleRemoveOrder(order)}
            >
               -
            </Button>
            <Text fontSize={['xs', 'sm']} color='gray.600' fontWeight={600}>
               {order.qty}
            </Text>
            <Button
               variant='solid'
               colorScheme='gray'
               onClick={() => handleAddOrder(order)}
            >
               +
            </Button>
         </HStack>

         <Text
            textAlign='right'
            fontSize={['xs', 'sm']}
            fontWeight={500}
            w='20%'
         >
            {order.price * order.qty} K
         </Text>
      </Box>
   )
}

export default ItemOrder
