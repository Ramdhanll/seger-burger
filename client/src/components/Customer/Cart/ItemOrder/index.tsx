import { Box, Button, HStack, Image, Text } from '@chakra-ui/react'
import React, { FC } from 'react'
import IProduct from '../../../../interfaces/IProduct'

interface IItemOrder {
   order: IProduct
}

const ItemOrder: FC<IItemOrder> = ({ order }) => {
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
               src='gibbresh.png'
               fallbackSrc='https://via.placeholder.com/150'
               w='50px'
               h='50px'
               borderRadius='md'
            />
            <Text fontSize={['xs', 'sm']} color='gray.600' fontWeight={400}>
               {order.name}
            </Text>
         </HStack>

         <HStack spacing={3} alignItems='center' justifyContent='start' w='40%'>
            <Button variant='solid' colorScheme='gray'>
               -
            </Button>
            <Text fontSize={['xs', 'sm']} color='gray.600' fontWeight={400}>
               {order.qty}
            </Text>
            <Button variant='solid' colorScheme='gray'>
               +
            </Button>
         </HStack>

         <Text
            textAlign='right'
            fontSize={['xs', 'sm']}
            fontWeight={500}
            w='10%'
         >
            32K
         </Text>
      </Box>
   )
}

export default ItemOrder
