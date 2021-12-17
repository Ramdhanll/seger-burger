import { Box, Button, HStack, Image, Text, VStack } from '@chakra-ui/react'
import React, { FC } from 'react'
import IPage from '../../interfaces/IPage'
import Logo from '../../assets/logo.png'
import Search from '../../components/Search'

const Customer: FC<IPage> = () => {
   return (
      <Box w='100vw' minH='100vh' bg='gray.50'>
         {/* Navbar */}
         <Box
            bg='white'
            d='flex'
            w='100%'
            justifyContent='center'
            h='60px'
            position='sticky'
            borderBottomWidth='1px'
            borderColor='gray.200'
            py={2}
            // boxShadow='xs'
         >
            <Image src={Logo} fallbackSrc='https://via.placeholder.com/150' />
         </Box>

         <Cart display={{ base: 'none', md: 'block' }} />

         {/* Main */}
         <Box
            pl={['25px', '50px']}
            pr={['25px', '420px']}
            py={['15px', '20px']}
         >
            <HStack justifyContent='space-between' alignItems='center'>
               <Text fontSize={['xl', '2xl', '3xl']} fontWeight={600}>
                  Choose Menu
               </Text>
               asdasdasd
               <Search
                  setQuerySearch={(e) => console.log(e)}
                  bg='white'
                  placeholder='Search menu ...'
               />
            </HStack>

            {/* Categories */}
            <HStack
               spacing={8}
               justifyContent='start'
               alignItems='center'
               mt='30px'
            >
               <ItemCategory name='All' />
               <ItemCategory name='Burger' />
               <ItemCategory name='Snack' />
               <ItemCategory name='Beer' />
               <ItemCategory name='Coffee' />
            </HStack>
         </Box>
      </Box>
   )
}

const Cart = ({ ...rest }) => {
   return (
      <Box
         transition='3s ease'
         p='20px'
         h='full'
         right={0}
         w={{ base: 'full', md: 'sm' }}
         pos='fixed'
         bg='white'
         boxShadow='sm'
         {...rest}
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
            <ItemOrder name='Stuffed Flack Steak' />
            <ItemOrder name='Burger 2' />
            <ItemOrder name='Burger 3' />
            <ItemOrder name='Burger 3' />
            <ItemOrder name='Burger 3' />
            <ItemOrder name='Burger 3' />
            <ItemOrder name='Burger 3' />
            <ItemOrder name='Burger 3' />
         </VStack>

         <Box mt='30px'>
            <HStack justifyContent='space-between'>
               <Text fontWeight='500' fontSize={['xs', 'sm']}>
                  Subtotal
               </Text>
               <Text fontWeight='500' fontSize={['xs', 'sm']}>
                  120k
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
                  120k
               </Text>
            </HStack>

            <Box justifyContent='end' d='flex' w='100%' mt='30px'>
               <Button variant='solid' colorScheme='yellow' w='full'>
                  Order
               </Button>
            </Box>
         </Box>
      </Box>
   )
}

interface IItemOrder {
   name: string
}

const ItemOrder: FC<IItemOrder> = ({ name }) => {
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
               borderRadius='sm'
            />
            <Text fontSize={['xs', 'sm']} color='gray.600' fontWeight={400}>
               {name}
            </Text>
         </HStack>

         <HStack spacing={3} alignItems='center' justifyContent='start' w='40%'>
            <Button variant='solid' colorScheme='gray'>
               -
            </Button>
            <Text fontSize={['xs', 'sm']} color='gray.600' fontWeight={400}>
               32
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

// Categories
interface IItemCategory {
   name: string
}

const ItemCategory: FC<IItemCategory> = ({ name }) => {
   return (
      <Button
         transition='ease-out .3s'
         variant='unstyled'
         h='max-content'
         role='group'
         _focus={{ outline: 'none' }}
         _active={{
            transform: 'translateY(4px)',
         }}
      >
         <Box
            transition='ease .5s'
            _groupHover={{ backgroundColor: 'yellow.400' }}
            boxShadow='md'
            borderRadius='lg'
            bg='white'
            d='flex'
            flexDirection='column'
            px={3}
            py={4}
            gridGap={3}
         >
            <Image
               src='gibbresh.png'
               fallbackSrc='https://via.placeholder.com/50'
               w='50px'
               borderRadius='lg'
            />
            <Text
               transition='ease .5s'
               textAlign='center'
               fontWeight={400}
               color='gray.400'
               _groupHover={{ color: 'gray.800', fontWeight: 500 }}
            >
               {name}
            </Text>
         </Box>
      </Button>
   )
}
export default Customer
