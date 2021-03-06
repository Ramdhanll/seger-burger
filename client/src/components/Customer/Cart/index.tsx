import { Box, Button, HStack, Link, Text, VStack } from '@chakra-ui/react'
import { FC } from 'react'
import { NavLink } from 'react-router-dom'
import IProduct from '../../../interfaces/IProduct'
import ItemOrder from './ItemOrder'

interface ICart {
   orderId: any
   orderItems: IProduct[]
   display: any
   totalOrder: number
   handleAddOrder: (product: IProduct) => void
   handleRemoveOrder: (product: IProduct) => void
   handleCheckoutOrder: () => void
}

const Cart: FC<ICart> = ({
   orderId,
   orderItems,
   display,
   totalOrder,
   handleAddOrder,
   handleRemoveOrder,
   handleCheckoutOrder,
}) => {
   return (
      <Box
         transition='3s ease'
         p='20px'
         h='full'
         top={0}
         right={0}
         w={{ base: 'full', md: 'sm' }}
         pos='fixed'
         bg='white'
         boxShadow='sm'
         display={display}
      >
         <Text fontWeight={600} fontSize={['sm', 'md', 'lg']}>
            Current Order
         </Text>

         <VStack
            pr={2}
            spacing={3}
            mt='30px'
            maxH={60}
            overflowY='auto'
            css={{
               '&::-webkit-scrollbar': {
                  width: '4px',
               },
               '&::-webkit-scrollbar-track': {
                  width: '6px',
               },
               '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'gray',
                  borderRadius: '24px',
               },
            }}
         >
            {orderItems.map((order, i) => (
               <ItemOrder
                  key={i}
                  order={order}
                  handleAddOrder={handleAddOrder}
                  handleRemoveOrder={handleRemoveOrder}
               />
            ))}
         </VStack>

         <Box mt='30px'>
            <HStack justifyContent='space-between'>
               <Text fontWeight='500' fontSize={['xs', 'sm']}>
                  Subtotal
               </Text>
               <Text fontWeight='500' fontSize={['xs', 'sm']}>
                  {totalOrder} K
               </Text>
            </HStack>
            <hr
               style={{
                  borderTop: '1px dashed gray',
                  marginTop: '15px',
                  marginBottom: '15px',
               }}
            />
            <HStack justifyContent='space-between'>
               <Text fontWeight='500' fontSize={['xs', 'sm']}>
                  Total
               </Text>
               <Text fontWeight='500' fontSize={['xs', 'sm', 'lg']}>
                  {totalOrder} K
               </Text>
            </HStack>

            <Box justifyContent='end' d='flex' w='100%' mt='30px'>
               <Button
                  variant='solid'
                  bg='yellow.300'
                  color='gray.800'
                  w='full'
                  _hover={{ backgroundColor: 'yellow.400' }}
                  _focus={{ outline: 'none' }}
                  _active={{ backgroundColor: 'yellow.500' }}
                  onClick={handleCheckoutOrder}
               >
                  Order
               </Button>
            </Box>
            <Box mt={3}>
               <Link as={NavLink} to={`/order/${orderId}/purchase`}>
                  <Text
                     color='linkedin.700'
                     fontWeight={300}
                     textAlign='center'
                     textDecoration='underline'
                  >
                     view purchases
                  </Text>
               </Link>
            </Box>
         </Box>
      </Box>
   )
}

export default Cart
