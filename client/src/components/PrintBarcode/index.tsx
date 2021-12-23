import { Box, ListItem, OrderedList, Text, VStack } from '@chakra-ui/react'
import React, { FC } from 'react'
import IOrder from '../../interfaces/IOrder'
import QRCode from 'react-qr-code'

interface IPrintBarcode {
   order: IOrder
   // ref: HTMLButtonElement
}

const PrintBarcode: FC<IPrintBarcode> = ({ order }) => {
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

         <Text fontSize='2xl' fontWeight={600}>
            Seger Burger
         </Text>

         <VStack spacing={3} w='100%'>
            <Box borderBottom='1px dashed black' w='100%' />
            <Box borderBottom='1px dashed black' w='100%' />
         </VStack>

         <QRCode value={order.link} size={150} />

         <Text fontSize='xs'>{order.link}</Text>

         <Box>
            <Text textAlign='center' fontSize='md'>
               How to use:{' '}
            </Text>
            <OrderedList>
               <ListItem>Scan Barcode</ListItem>
               <ListItem>Goto link</ListItem>
               <ListItem>Enjoy order</ListItem>
            </OrderedList>
         </Box>

         <VStack spacing={3} w='100%'>
            <Box borderBottom='1px dashed black' w='100%' />
            <Box borderBottom='1px dashed black' w='100%' />
         </VStack>

         <Text fontSize='2xl' fontWeight={600}>
            Thank you
         </Text>

         <Box borderBottom='1px dashed black' w='100%' />
      </Box>
   )
}

export default PrintBarcode
