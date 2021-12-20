import { Box, Button, Image, Text } from '@chakra-ui/react'
import { FC, memo } from 'react'

interface IItemCategory {
   id?: any
   name: string
   logo: string
   active: string
   setCategoryActive: (e: string) => void
}

const ItemCategory: FC<IItemCategory> = memo(
   ({ id, name, logo, active, setCategoryActive }) => {
      return (
         <Button
            // transition='ease-in .3s'
            variant='unstyled'
            h='max-content'
            role='group'
            _focus={{ outline: 'none' }}
            _active={{
               transform: 'translateY(1px)',
            }}
            onClick={() => setCategoryActive(name)}
         >
            <Box
               w={['60px', '80px', '80px', '80px']}
               alignItems='center'
               // transition='ease-in .3s'
               _groupHover={{ backgroundColor: 'yellow.400' }}
               boxShadow='md'
               borderRadius='lg'
               d='flex'
               flexDirection='column'
               px={3}
               py={4}
               gridGap={3}
               bg={
                  active === name
                     ? 'yellow.300'
                     : name === 'All' && active === ''
                     ? 'yellow.300'
                     : 'white'
               }
            >
               <Box bg='white' p={{ base: 0, md: '10px' }} borderRadius='md'>
                  <Image
                     src={logo}
                     fallbackSrc='https://via.placeholder.com/50'
                     w='50px'
                     borderRadius='lg'
                  />
               </Box>
               <Text
                  d={{ base: 'none', md: 'block' }}
                  // transition='ease-in .3s'
                  textAlign='center'
                  fontWeight={400}
                  color={
                     active === name
                        ? 'gray.900'
                        : name === 'All' && active === ''
                        ? 'gray.900'
                        : 'gray.400'
                  }
                  _groupHover={{ color: 'gray.800', fontWeight: 500 }}
               >
                  {name}
               </Text>
            </Box>
         </Button>
      )
   }
)

export default ItemCategory
