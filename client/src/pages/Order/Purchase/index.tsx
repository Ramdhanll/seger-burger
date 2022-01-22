import { Box, Flex, HStack, Image, Text, VStack, Link } from '@chakra-ui/react'
import React, { FC, useEffect } from 'react'
import Logo from '../../../assets/logo.png'
import useSWR from 'swr'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import IPage from '../../../interfaces/IPage'
import OrderService from '../../../services/order'
import StatusOrder from '../../../components/StatusOrder'

const Purchase: FC<IPage> = (props) => {
   const { id } = useParams()
   const navigate = useNavigate()

   // Handle ID Order exist or not
   useEffect(() => {
      const handleCheckOrderIsExist = async (id: any) => {
         try {
            await OrderService.isExist(id)
         } catch (error) {
            navigate('/order/not-found')
         }
      }

      handleCheckOrderIsExist(id)
   }, [id, navigate])

   const { data: dataOrder } = useSWR(`/api/orders/${id}`)

   console.log('ORDER', dataOrder)

   const renderTimeOrder = (order: any) => {
      const time = new Date(order)
      const hour =
         time.getHours() < 10 ? `0${time.getHours()}` : time.getHours()
      const minute =
         time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()

      return `${hour} : ${minute}`
   }

   return (
      <Box w='100vw' minH='100vh' bg='gray.50' overflowX='hidden'>
         {/* Navbar */}
         <Box
            bg='white'
            d='flex'
            w={{ base: '100%', md: '100%', lg: '100%', xl: '100%' }}
            justifyContent='center'
            h='60px'
            borderBottomWidth='1px'
            borderColor='gray.200'
            py={2}
         >
            <Image src={Logo} fallbackSrc='https://via.placeholder.com/150' />
         </Box>

         <Box as='main' d='flex' justifyContent='center' pt={10}>
            <Box bg='white' boxShadow='lg' borderRadius='md' w='lg' p={3}>
               <Box
                  d='flex'
                  alignItems='center'
                  justifyContent='center'
                  flexDirection='column'
                  gridGap={3}
               >
                  <VStack
                     pr={3}
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
                     {dataOrder?.order?.orders.map((order: any, i: number) => {
                        return (
                           <Box w='full' key={i}>
                              <Flex
                                 alignItems='end'
                                 justifyContent='end'
                                 gridGap={3}
                              >
                                 <Text textAlign='right'>
                                    Orders at{' '}
                                    {new Date(
                                       order?.createdAt
                                    ).toLocaleDateString('id', {
                                       hour: '2-digit',
                                       minute: '2-digit',
                                    })}
                                 </Text>
                              </Flex>

                              {order?.lists.map((order: any, i: number) => (
                                 <Box
                                    d='flex'
                                    justifyContent='space-between'
                                    alignItems='center'
                                    gridGap={4}
                                    w='100%'
                                    key={i}
                                    pt={2}
                                 >
                                    <HStack
                                       spacing={2}
                                       alignItems='center'
                                       justifyContent='start'
                                       w='40%'
                                    >
                                       <Image
                                          src={order?.product.photo}
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
                                          {order?.product.name}
                                       </Text>
                                    </HStack>

                                    <Text
                                       textAlign='right'
                                       fontSize={['xs', 'sm']}
                                       fontWeight={500}
                                       w='20%'
                                    >
                                       {order?.qty} pcs
                                    </Text>

                                    <Text
                                       textAlign='right'
                                       fontSize={['xs', 'sm']}
                                       fontWeight={500}
                                       w='20%'
                                    >
                                       {order?.product.price * order?.qty} K
                                    </Text>

                                    <Text
                                       textAlign='right'
                                       fontSize={['xs', 'sm']}
                                       fontWeight={500}
                                       w='20%'
                                    >
                                       {renderTimeOrder(
                                          order?.product.createdAt
                                       )}
                                    </Text>

                                    <StatusOrder status={order?.status} />
                                 </Box>
                              ))}
                           </Box>
                        )
                     })}
                  </VStack>
               </Box>

               <Box mt='30px'>
                  <HStack justifyContent='space-between'>
                     <Text fontWeight='500' fontSize={['xs', 'sm']}>
                        Subtotal
                     </Text>
                     <Text fontWeight='500' fontSize={['xs', 'sm']}>
                        {dataOrder?.order?.total} K
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
                        {dataOrder?.order?.total} K
                     </Text>
                  </HStack>

                  <Link as={NavLink} to={`/order/${id}`}>
                     <Text
                        mt={5}
                        color='linkedin.700'
                        fontWeight={300}
                        textAlign='center'
                        textDecoration='underline'
                     >
                        back to order
                     </Text>
                  </Link>
               </Box>
            </Box>
         </Box>
      </Box>
   )
}

export default Purchase
