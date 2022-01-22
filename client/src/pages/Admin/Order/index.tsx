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
   useDisclosure,
   Modal,
   ModalOverlay,
   ModalContent,
   ModalHeader,
   ModalCloseButton,
   ModalBody,
   ModalFooter,
   Link,
   VStack,
   Image,
} from '@chakra-ui/react'
import React, { FC, useRef, useState } from 'react'
import Heading from '../../../components/Admin/Heading'
import Pagination from '../../../components/Pagination'
import Search from '../../../components/Search'
import IPage from '../../../interfaces/IPage'
import useSWR, { mutate } from 'swr'
import { MdDelete, MdPrint } from 'react-icons/md'
import { IoMdBarcode, IoMdEye } from 'react-icons/io'
import { FaTelegramPlane } from 'react-icons/fa'
import { FcMoneyTransfer } from 'react-icons/fc'
import TableDateNotFound from '../../../components/Table/TableDataNotFound'
import TableLoading from '../../../components/Table/TableLoading'
import StatusOrder from '../../../components/StatusOrder'
import OrderService from '../../../services/order'
import AlertDialogDelete from '../../../components/AlertDialogDelete'
import IOrder, { INITIAL_ORDER } from '../../../interfaces/IOrder'
import QRCode from 'react-qr-code'
import PrintBarcode from '../../../components/PrintBarcode'
import { useReactToPrint } from 'react-to-print'
import PrintMenu from '../../../components/PrintMenu'
import ModalBodyPayment from '../../../components/ModalBodyPayment'

const Order: FC<IPage> = () => {
   const toast = useToast()

   const [orderSelected, setOrderSelected] = useState<IOrder>(INITIAL_ORDER)
   const [page, setPage] = useState<number>(1)
   const [searchValue, setSearchValue] = useState<string>('')
   const [btnNewOrderIsLoading, setBtnNewOrderIsLoading] = useState(false)
   const barcodeRef = useRef(null)
   const [menuSelected, setMenuSelected] = useState({})
   const menuRef = useRef(null)

   const { data: dataOrders, error: errorOrders } = useSWR(
      `/api/orders?page=${page}&id=${searchValue}`
   )

   console.log('DATA', dataOrders)

   const handlePagination = (i: number) => {
      setPage(i)
   }

   // Section Create
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
         mutate(`/api/orders?page=${page}&id=${searchValue}`)
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

   // Section Barcode
   const {
      isOpen: isOpenBarcode,
      onOpen: onOpenBarcode,
      onClose: onCloseBarcode,
   } = useDisclosure()

   const handleOpenBarcode = (order: IOrder) => {
      setOrderSelected(order)
      onOpenBarcode()
   }

   // Section Delete
   const {
      isOpen: isOpenAlertDelete,
      onOpen: onOpenAlertDelete,
      onClose: onCloseAlertDelete,
   } = useDisclosure()

   const [isLoadingAlertDelete, setIsLoadingAlertDelete] =
      useState<boolean>(false)

   const handleOpenAlertDelete = (order: IOrder) => {
      setOrderSelected(order)
      onOpenAlertDelete()
   }

   const handleConfirmDelete = async () => {
      setIsLoadingAlertDelete(true)
      try {
         await OrderService.Delete(orderSelected?._id)
         mutate(`/api/orders?page=${page}&id=${searchValue}`)
         setIsLoadingAlertDelete(false)
         onCloseAlertDelete()
      } catch (error) {
         setIsLoadingAlertDelete(false)
         toast({
            title: 'Failed',
            description: 'Failed delete product',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
         })
      }
   }

   const handleCloseAlertDelete = () => {
      onCloseAlertDelete()
   }

   const cleanForm = () => {
      setOrderSelected(INITIAL_ORDER)
      console.log('SELECTED ORDER', orderSelected)
   }

   // Print barcode
   const handlePrintBarcode = useReactToPrint({
      content: () => barcodeRef.current,
      pageStyle: pageStyle,
   })

   const renderTimeOrder = (order: any) => {
      const time = new Date(order)
      const hour =
         time.getHours() < 10 ? `0${time.getHours()}` : time.getHours()
      const minute =
         time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()

      return `${hour} : ${minute}`
   }

   // print menu
   const submitPrintMenu = (orders: any) => {
      setMenuSelected(orders)

      setTimeout(() => {
         handlePrintMenu()
      }, 1000)
   }

   console.log('dataOrders', dataOrders)
   console.log('selectedOrder', orderSelected)

   const handlePrintMenu = useReactToPrint({
      content: () => menuRef.current,
      pageStyle: pageStyle,
   })

   const handleOrderDelivered = async ({
      order_id,
      order_list_id,
   }: {
      order_id: any
      order_list_id: string
   }) => {
      try {
         const { order } = await OrderService.OrderDelivered(
            order_id,
            order_list_id
         )

         setOrderSelected(order)

         mutate(`/api/orders?page=${page}&id=${searchValue}`)

         // const indexOrder = dataOrders.orders.findIndex(
         //    (order: any) => order._id === orderSelected._id
         // )

         // setOrderSelected(dataOrders[indexOrder])

         toast({
            title: 'Success',
            description: 'Order delivered successfully',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
         })
      } catch (error) {
         setBtnNewOrderIsLoading(false)

         toast({
            title: 'Failed',
            description: 'Order delivered failed',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
         })
      }
   }

   // Section payment
   const {
      isOpen: isOpenPayment,
      onOpen: onOpenPayment,
      onClose: onClosePayment,
   } = useDisclosure()

   const handleOpenPayment = (order: IOrder) => {
      setOrderSelected(order)
      onOpenPayment()
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
                                 <Button
                                    variant='outline'
                                    colorScheme='cyan'
                                    onClick={() => handleOpenBarcode(order)}
                                 >
                                    <IoMdBarcode size='16px' />
                                 </Button>
                                 <Button
                                    variant='solid'
                                    colorScheme='teal'
                                    onClick={() => handleOpenPayment(order)}
                                 >
                                    <FcMoneyTransfer size='16px' />
                                 </Button>
                                 <Button
                                    variant='outline'
                                    colorScheme='red'
                                    onClick={() => handleOpenAlertDelete(order)}
                                 >
                                    <MdDelete size='16px' />
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
            size='lg'
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
                                    <Button
                                       size='xs'
                                       variant='solid'
                                       colorScheme='green'
                                       onClick={() => submitPrintMenu(order)}
                                    >
                                       <MdPrint size='16px' />
                                    </Button>
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
                                       {order.status !== 'DELIVERED' && (
                                          <Button
                                             size='xs'
                                             variant='solid'
                                             colorScheme='telegram'
                                             onClick={() =>
                                                handleOrderDelivered({
                                                   order_id: orderSelected._id,
                                                   order_list_id: order._id,
                                                })
                                             }
                                          >
                                             <FaTelegramPlane size='16px' />
                                          </Button>
                                       )}
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

         {/* Modal Barcode */}
         <Modal
            isOpen={isOpenBarcode}
            onClose={onCloseBarcode}
            onOverlayClick={cleanForm}
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
                     <QRCode value={orderSelected.link} />
                     <Link href={orderSelected.link} isExternal>
                        {orderSelected.link}
                     </Link>

                     <Button
                        variant='solid'
                        colorScheme='yellow'
                        d='block'
                        onClick={handlePrintBarcode}
                     >
                        Print Order
                     </Button>
                  </Box>
               </ModalBody>
               <ModalFooter></ModalFooter>
            </ModalContent>
         </Modal>

         {/* Modal Payment */}
         <Modal
            isOpen={isOpenPayment}
            onClose={onClosePayment}
            onOverlayClick={cleanForm}
            size='sm'
         >
            <ModalOverlay />
            <ModalContent>
               <ModalHeader>
                  <Text color='gray.500' fontSize='lg'>
                     Payment
                  </Text>
                  <Text color='gray.400' fontSize='md' fontWeight='400'>
                     Order ID: {orderSelected._id}
                  </Text>
               </ModalHeader>
               <ModalCloseButton _focus={{ outline: 'none' }} />
               <ModalBody>
                  <ModalBodyPayment order={orderSelected} />
               </ModalBody>
            </ModalContent>
         </Modal>

         {/* Alert delete order */}
         <AlertDialogDelete
            header='Delete Order'
            body='Are you sure you want to delete?'
            isOpen={isOpenAlertDelete}
            onClose={onCloseAlertDelete}
            isLoading={isLoadingAlertDelete}
            handleConfirm={handleConfirmDelete}
            handleCloseAlert={handleCloseAlertDelete}
         />

         <Box display='none'>
            <Box ref={barcodeRef}>
               <PrintBarcode order={orderSelected} />
            </Box>
         </Box>

         <Box display='none'>
            <Box ref={menuRef}>
               <PrintMenu orders={menuSelected} />
            </Box>
         </Box>
      </Box>
   )
}

const pageStyle = `
   @page {
      size: 90mm 160mm;
   }
`

export default Order
