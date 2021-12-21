import { Box, Flex, HStack, Image, Text } from '@chakra-ui/react'
import React, { FC, useState } from 'react'
import IPage from '../../interfaces/IPage'
import Logo from '../../assets/logo.png'
import Search from '../../components/Search'
import useSWR from 'swr'
import Cart from '../../components/Customer/Cart'
import ItemCategory from '../../components/Customer/ItemCategory'
import ItemProduct from '../../components/Customer/ItemProduct'
import LogoAll from '../../assets/all.svg'
import IProduct from '../../interfaces/IProduct'

const Customer: FC<IPage> = () => {
   const [categoryActive, setCategoryActive] = useState<string>('')
   const [search, setSearch] = useState<string>('')
   const [orders, setOrders] = useState<IProduct[]>([])

   const { data: dataCategories } = useSWR(`/api/categories`)
   const { data: dataProducts } = useSWR(
      `/api/products?category=${categoryActive}&name=${search}`
   )

   const handleAddOrder = (product: IProduct) => {
      // find order
      let exist = false

      /**
       * cari variable order yang id nya sama dengan props
       * jika ada replace qty + 1
       * jika tidak push props to orders
       */

      orders.find((order, i) => {
         if (order._id === product._id) {
            const newOrders = orders
            newOrders[i].qty += 1
            setOrders([...newOrders])
            exist = true
            return true
         }

         return false
      })

      if (!exist) {
         product.qty = 1
         setOrders([...orders, product])
      }
   }

   const handleRemoveOrder = (product: IProduct) => {
      /**
       * cari variable order yang id nya sama dengan props
       * jika ada lakukan condition lagi
       * jika qty === 1 hapus dari orders
       * jika tidak qty - 1
       * push to orders
       */

      orders.find((order, i) => {
         if (order._id === product._id) {
            const newOrders = orders

            if (newOrders[i].qty === 1) {
               orders.splice(i, 1)
               setOrders([...orders])
            } else {
               newOrders[i].qty -= 1
               setOrders([...newOrders])
            }

            return true
         }

         return false
      })
   }

   return (
      <Box w='100vw' minH='100vh' bg='gray.50' overflowX='hidden'>
         {/* Navbar */}
         <Box
            bg='white'
            d='flex'
            w={{ base: '100%', md: '100%', lg: '80%', xl: '80%' }}
            justifyContent='center'
            h='60px'
            borderBottomWidth='1px'
            borderColor='gray.200'
            py={2}
         >
            <Image src={Logo} fallbackSrc='https://via.placeholder.com/150' />
         </Box>

         <Cart
            handleAddOrder={handleAddOrder}
            handleRemoveOrder={handleRemoveOrder}
            orders={orders}
            display={{ base: 'none', md: 'none', lg: 'block' }}
         />

         {/* Main */}
         <Box
            pl={['25px', '50px']}
            pr={['25px', '420px']}
            py={['15px', '20px']}
         >
            <HStack
               justifyContent='space-between'
               alignItems='center'
               position='inherit'
               w={['100vw']}
               pr={['60px', '100px', '80px', '500px']}
            >
               <Text fontSize={['xl', '2xl', '3xl']} fontWeight={600}>
                  Choose Menu
               </Text>
               <Search
                  setQuerySearch={(e) => setSearch(e)}
                  bg='white'
                  placeholder='Search menu ...'
               />
            </HStack>

            {/* Categories */}
            <HStack
               spacing={[10, 14, 6, 18]}
               justifyContent='start'
               alignItems='center'
               mt='30px'
               w={['', '90vw', '90vw', '100%']}
               pr={['60px', '100px', '0px', '']}
               overflowX='auto'
               py='5px'
               px='5px'
               boxSizing='border-box'
            >
               <ItemCategory
                  id=''
                  name='All'
                  logo={LogoAll}
                  active={categoryActive}
                  setCategoryActive={(e) => setCategoryActive('')}
               />
               {dataCategories?.categories.length &&
                  dataCategories.categories.map((category: any, i: number) => (
                     <ItemCategory
                        id={i}
                        key={i}
                        name={category.name}
                        logo={category.logo}
                        active={categoryActive}
                        setCategoryActive={(e) => setCategoryActive(e)}
                     />
                  ))}
            </HStack>

            {/* Menu */}
            <Flex
               wrap='wrap'
               gridGap={{ base: 4, md: 10 }}
               mt='30px'
               w={['', '90vw', '90vw', '100%']}
               alignItems='start'
               justifyContent='start'
            >
               {dataProducts?.products?.length ? (
                  dataProducts?.products?.map((product: any, i: number) => (
                     <ItemProduct
                        handleAddOrder={(product) => handleAddOrder(product)}
                        key={i}
                        product={product}
                     />
                  ))
               ) : (
                  <Text>Data tidak ditemukan</Text>
               )}
            </Flex>
         </Box>
      </Box>
   )
}

export default Customer
