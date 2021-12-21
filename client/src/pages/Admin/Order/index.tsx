import {
   Box,
   Button,
   Flex,
   Table,
   Tbody,
   Td,
   Text,
   Th,
   Thead,
   Tr,
   useToast,
   HStack,
} from '@chakra-ui/react'
import React, { FC, useState } from 'react'
import Heading from '../../../components/Admin/Heading'
import Pagination from '../../../components/Pagination'
import Search from '../../../components/Search'
import IPage from '../../../interfaces/IPage'
import useSWR, { mutate } from 'swr'
import { MdDelete, MdEdit } from 'react-icons/md'
import TableDateNotFound from '../../../components/Table/TableDataNotFound'
import TableLoading from '../../../components/Table/TableLoading'
import StatusOrder from '../../../components/StatusOrder'
import OrderService from '../../../services/order'

interface IOrder {
   _id?: string
   link: string
   orders: any
   total: number
   status: string
   createdAt: string
}

const Order: FC<IPage> = () => {
   const toast = useToast()

   const [page, setPage] = useState<number>(1)
   const [searchValue, setSearchValue] = useState<string>('')
   const [btnNewOrderIsLoading, setBtnNewOrderIsLoading] = useState(false)

   const { data: dataOrders, error: errorOrders } = useSWR(
      `/api/orders?page=${page}&id=${searchValue}`
   )

   const handlePagination = (i: number) => {
      setPage(i)
   }

   const handleNewOrder = async () => {
      setBtnNewOrderIsLoading(true)
      try {
         await OrderService.Create()
         setBtnNewOrderIsLoading(false)

         toast({
            title: 'Success',
            description: 'Order created successfully',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
         })
         mutate(`/api/orders?page=${page}&name=${searchValue}`)
      } catch (error) {
         setBtnNewOrderIsLoading(false)

         toast({
            title: 'Failed',
            description: 'Order failed',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
         })
      }
   }

   return (
      <Box textAlign='left' py={3} bg='white' alignItems='center'>
         <Flex justifyContent='space-between'>
            <Heading>ORDER</Heading>
            <Button
               variant='solid'
               bg='yellow.400'
               color='gray.50'
               size='sm'
               onClick={handleNewOrder}
               _focus={{ outline: 'none' }}
               isLoading={btnNewOrderIsLoading}
            >
               <Text>New Order</Text>
            </Button>
         </Flex>
         <Box mt='20px'>
            <Search
               setQuerySearch={setSearchValue}
               borderColor='gray.400'
               placeholder='Pencarian ...'
               borderRadius='xl'
               color='gray.400'
               px='20px'
            />
         </Box>
         {/* TABLE */}
         <Box mt='30px' mb='20px' overflowX='auto'>
            <Table variant='simple'>
               <Thead>
                  <Tr>
                     <Th>No</Th>
                     <Th>ID</Th>
                     <Th>Status</Th>
                     <Th>Created At</Th>
                     <Th>Actions</Th>
                  </Tr>
               </Thead>
               <Tbody>
                  {errorOrders ? (
                     <TableDateNotFound
                        colSpan={3}
                        message='Data tidak ditemukan'
                     />
                  ) : !dataOrders ? (
                     <TableLoading colSpan={8} />
                  ) : dataOrders?.orders?.length ? (
                     dataOrders?.orders?.map((order: IOrder, i: number) => (
                        <Tr key={i}>
                           <Td>{i + 1}</Td>
                           <Td>
                              <Text fontSize={['xs', 'sm', 'md']}>
                                 {order._id}
                              </Text>
                           </Td>
                           <Td>{<StatusOrder status={order.status} />}</Td>
                           <Td>
                              <Text fontSize={['xs', 'sm', 'md']}>
                                 {new Date(order.createdAt).toLocaleDateString(
                                    'id',
                                    {
                                       hour: '2-digit',
                                       minute: '2-digit',
                                    }
                                 )}
                              </Text>
                           </Td>
                           <Td>
                              <HStack spacing={3}>
                                 <Button variant='solid' colorScheme='cyan'>
                                    <MdEdit size='16px' />
                                 </Button>
                                 <Button variant='outline' colorScheme='red'>
                                    <MdDelete size='16px' />
                                 </Button>
                              </HStack>
                           </Td>
                        </Tr>
                     ))
                  ) : (
                     <TableDateNotFound
                        colSpan={3}
                        message='Data tidak ditemukan'
                     />
                  )}
               </Tbody>
            </Table>
         </Box>

         <Box display={dataOrders?.orders?.length ? 'inline' : 'none'}>
            <Pagination
               page={dataOrders?.page}
               pages={dataOrders?.pages}
               handlePagination={(e) => handlePagination(e)}
            />
         </Box>
      </Box>
   )
}

export default Order
