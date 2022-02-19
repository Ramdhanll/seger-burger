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
   HStack,
   useDisclosure,
   Modal,
   ModalOverlay,
   ModalContent,
   ModalHeader,
   ModalCloseButton,
   ModalBody,
   ModalFooter,
   VStack,
   Image,
} from '@chakra-ui/react'
import React, { FC, useState } from 'react'
import Heading from '../../../components/Admin/Heading'
import Pagination from '../../../components/Pagination'
import Search from '../../../components/Search'
import IPage from '../../../interfaces/IPage'
import useSWR from 'swr'
import { IoMdEye } from 'react-icons/io'
import TableDateNotFound from '../../../components/Table/TableDataNotFound'
import TableLoading from '../../../components/Table/TableLoading'
import StatusOrder from '../../../components/StatusOrder'
import IOrder, { INITIAL_ORDER } from '../../../interfaces/IOrder'

const Report: FC<IPage> = () => {
   const [orderSelected, setOrderSelected] = useState<IOrder>(INITIAL_ORDER)
   const [page, setPage] = useState<number>(1)
   const [searchValue, setSearchValue] = useState<string>('')

   const { data: dataOrders, error: errorOrders } = useSWR(
      `/api/orders?page=${page}&id=${searchValue}&status=completed`
   )

   const { data: dataReport } = useSWR(`/api/orders/report`)

   const handlePagination = (i: number) => {
      setPage(i)
   }

   // Section Detail
   const {
      isOpen: isOpenDetail,
      onOpen: onOpenDetail,
      onClose: onCloseDetail,
   } = useDisclosure()

   const handleOpenDetail = (order: IOrder) => {
      setOrderSelected(order)
      onOpenDetail()
   }

   const cleanForm = () => {
      setOrderSelected(INITIAL_ORDER)
      console.log('SELECTED ORDER', orderSelected)
   }

   const renderTimeOrder = (order: any) => {
      const time = new Date(order)
      const hour =
         time.getHours() < 10 ? `0${time.getHours()}` : time.getHours()
      const minute =
         time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()

      return `${hour} : ${minute}`
   }

   return (
      <Box textAlign='left' py={3} bg='white' alignItems='center'>
         <Flex justifyContent='space-between'>
            <Heading>Report</Heading>
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
                        colSpan={5}
                        message='Data tidak ditemukan'
                     />
                  ) : !dataOrders ? (
                     <TableLoading colSpan={5} />
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
                                 <Button
                                    variant='solid'
                                    colorScheme='blue'
                                    onClick={() => handleOpenDetail(order)}
                                 >
                                    <IoMdEye size='16px' />
                                 </Button>
                              </HStack>
                           </Td>
                        </Tr>
                     ))
                  ) : (
                     <TableDateNotFound
                        colSpan={5}
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

         {/* Modal Detail */}
         <Modal
            isOpen={isOpenDetail}
            onClose={onCloseDetail}
            onOverlayClick={cleanForm}
            size='md'
         >
            <ModalOverlay />
            <ModalContent>
               <ModalHeader>Order ID: {orderSelected._id}</ModalHeader>
               <ModalCloseButton _focus={{ outline: 'none' }} />
               <ModalBody>
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
                        {orderSelected.orders.map((order: any, i: number) => {
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
                                          order.createdAt
                                       ).toLocaleDateString('id', {
                                          hour: '2-digit',
                                          minute: '2-digit',
                                       })}
                                    </Text>
                                 </Flex>

                                 {order.lists.map((order: any, i: number) => (
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

                                       <Text
                                          textAlign='right'
                                          fontSize={['xs', 'sm']}
                                          fontWeight={500}
                                          w='20%'
                                       >
                                          {renderTimeOrder(
                                             order.product.createdAt
                                          )}
                                       </Text>

                                       <StatusOrder status={order.status} />
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
                           {orderSelected.total} K
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
                           {orderSelected.total} K
                        </Text>
                     </HStack>
                  </Box>
               </ModalBody>
               <ModalFooter></ModalFooter>
            </ModalContent>
         </Modal>
      </Box>
   )
}

export default Report
