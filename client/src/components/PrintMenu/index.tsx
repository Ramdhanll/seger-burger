import {
   Box,
   Table,
   Tbody,
   Td,
   Text,
   Tfoot,
   Th,
   Thead,
   Tr,
   VStack,
} from '@chakra-ui/react'
import React, { FC } from 'react'

interface IPrintMenu {
   orders: any
   // ref: HTMLButtonElement
}

const PrintMenu: FC<IPrintMenu> = ({ orders }) => {
   console.log('orrrr', orders.lists)
   return (
      <Box
         d='flex'
         alignItems='center'
         justifyContent='center'
         flexDirection='column'
         w='100%'
         gridGap={3}
      >
         <VStack spacing={3} w='100%'>
            <Box borderBottom='1px dashed black' w='100%' />
            <Box borderBottom='1px dashed black' w='100%' />
         </VStack>

         <Text fontSize='xl' fontWeight={600}>
            Menu Order ID: {orders.order}
         </Text>

         <VStack spacing={3} w='100%'>
            <Box borderBottom='1px dashed black' w='100%' />
            <Box borderBottom='1px dashed black' w='100%' />
         </VStack>

         {/* order menu */}
         <Table variant='simple'>
            <Thead>
               <Tr>
                  <Th>Name</Th>
                  <Th>QTY</Th>
                  <Th>status</Th>
               </Tr>
            </Thead>
            <Tbody>
               {orders.lists?.map((order: any, i: number) => (
                  <Tr>
                     <Td>{order.product.name}</Td>
                     <Td>{order.qty}</Td>
                     <Td>{order.status}</Td>
                  </Tr>
               ))}
            </Tbody>
            <Tfoot></Tfoot>
         </Table>

         <VStack spacing={3} w='100%'>
            <Box borderBottom='1px dashed black' w='100%' />
            <Box borderBottom='1px dashed black' w='100%' />
         </VStack>

         <Text fontSize='2xl' fontWeight={600}>
            Seger Buger
         </Text>

         <Box borderBottom='1px dashed black' w='100%' />
      </Box>
   )
}

export default PrintMenu
