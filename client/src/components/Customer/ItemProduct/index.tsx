import { Box, Image, Text, VStack, Button } from '@chakra-ui/react'
import React, { FC } from 'react'
import IProduct from '../../../interfaces/IProduct'

interface IItemProduct {
   product: IProduct
   handleOrder: (product: IProduct) => void
}

const ItemProduct: FC<IItemProduct> = ({ handleOrder, product }) => {
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
         whiteSpace='normal'
         onClick={() => handleOrder(product)}
      >
         <Box
            _groupHover={{ backgroundColor: '#ECC94D' }}
            p='20px'
            bg='white'
            borderRadius='xl'
            boxShadow='lg'
            d='flex'
            alignItems='center'
            flexDirection='column'
            gridGap={{ base: '10px', md: '15px' }}
            w={{ base: '150px', md: '180px' }}
         >
            <Image
               borderRadius='xl'
               src={product.photo}
               fallbackSrc='https://via.placeholder.com/120'
               w={{ base: '100px', md: '120px' }}
               h={{ base: '100px', md: '120px' }}
               loading='lazy'
            />
            <VStack
               spacing={1}
               alignItems='center'
               justifyContent='center'
               wrap='wrap'
               w='inherit'
               wordBreak='break-word'
               overflowWrap='break-word'
            >
               <Text
                  px={1}
                  fontWeight={600}
                  fontSize={['md', 'lg', 'xl']}
                  textAlign='center'
                  w='inherit'
               >
                  {product.name}
               </Text>

               <Text
                  fontWeight={500}
                  fontSize={['sm', 'md', 'lg']}
                  color='gray.400'
               >
                  {product.weight}
               </Text>
            </VStack>
            <Text
               fontWeight={600}
               fontSize={['md', 'lg', 'xl']}
               color='yellow.400'
               _groupHover={{ color: 'black' }}
            >
               {product.price} K
            </Text>
         </Box>
      </Button>
   )
}

export default ItemProduct
