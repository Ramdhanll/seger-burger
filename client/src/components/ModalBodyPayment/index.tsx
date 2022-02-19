import {
   Box,
   Button,
   HStack,
   Image,
   Input,
   Text,
   VStack,
} from '@chakra-ui/react'
import React, { FC, useEffect, useState } from 'react'
import IOrder from '../../interfaces/IOrder'

interface IModalBodyPayment {
   order: IOrder
   handlePayment: (e: number) => void
}

const ModalBodyPayment: FC<IModalBodyPayment> = ({ order, handlePayment }) => {
   const [lists, setLists] = useState([])
   const [change, setChange] = useState<number>(-order.total)
   const [cash, setCash] = useState<number>(0)

   useEffect(() => {
      let tempLists: any = []

      // ambil hanya lists ordernya saja
      const lists = order.orders.map((order: any) => order.lists)

      // di normalisasikan
      for (let i = 0; i < lists.length; i++) {
         for (let j = 0; j < lists[i].length; j++) {
            tempLists.push(lists[i][j])
         }
      }

      // digabungkan yang duplicate
      const group: any = {}

      tempLists.forEach((e: any) => {
         const o = (group[e?.product._id] = group[e?.product._id] || {
            ...e,
            qty: 0,
         })

         o.qty += e.qty
      })

      const res: any = Object.values(group)

      setLists(res)
   }, [order.orders])

   const handleCash = (e: number) => {
      if (isNaN(e)) {
         setCash(e)
         setChange(-order.total)
      } else {
         const change = e - order.total
         setChange(change)
      }
   }

   return (
      <Box
         d='flex'
         justifyContent='space-between'
         flexDirection='column'
         gridGap={3}
      >
         <VStack
            spacing={3}
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
            {lists.map((order: any, i: number) => (
               <Box
                  d='flex'
                  justifyContent='space-between'
                  alignItems='center'
                  gridGap={4}
                  w='100%'
                  key={i}
               >
                  <HStack
                     spacing={2}
                     alignItems='center'
                     justifyContent='start'
                     w='40%'
                  >
                     <Image
                        src={order.product.photo}
                        fallbackSrc='https://via.placeholder.com/150'
                        minW='50px'
                        maxW='50px'
                        h='50px'
                        borderRadius='md'
                     />
                     <Text
                        fontSize={['xs', 'sm']}
                        color='gray.600'
                        fontWeight={400}
                     >
                        {order.product.name}
                     </Text>
                  </HStack>

                  <Text
                     textAlign='right'
                     fontSize={['xs', 'sm']}
                     fontWeight={500}
                     w='20%'
                  >
                     {order.qty} pcs
                  </Text>

                  <Text
                     textAlign='right'
                     fontSize={['xs', 'sm']}
                     fontWeight={500}
                     w='20%'
                  >
                     {order.product.price * order.qty} K
                  </Text>
               </Box>
            ))}
         </VStack>
         <Box as='hr' borderTop='1px dashed #dbd7d7' />

         <HStack justifyContent='space-between'>
            <Text>Total</Text>
            <Text>{order.total} K</Text>
         </HStack>
         <HStack justifyContent='space-between'>
            <Text>Cash</Text>
            <Input
               name='cash'
               type='number'
               w='70px'
               onChange={(e) => handleCash(e.target.valueAsNumber)}
               autoFocus
               textAlign='right'
            />
         </HStack>
         <HStack justifyContent='space-between'>
            <Text>change</Text>
            <Text>{change} K</Text>
         </HStack>
         <Box py='15px'>
            <Button
               isDisabled={change < 0}
               variant='solid'
               colorScheme='yellow'
               w='full'
               onClick={() => handlePayment(cash)}
            >
               Pay
            </Button>
         </Box>
      </Box>
   )
}

export default ModalBodyPayment
