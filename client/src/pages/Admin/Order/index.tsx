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
} from '@chakra-ui/react'
import React, { FC, useRef, useState } from 'react'
import Heading from '../../../components/Admin/Heading'
import Pagination from '../../../components/Pagination'
import Search from '../../../components/Search'
import IPage from '../../../interfaces/IPage'
import useSWR, { mutate } from 'swr'
import { MdDelete } from 'react-icons/md'
import { IoMdBarcode } from 'react-icons/io'
import TableDateNotFound from '../../../components/Table/TableDataNotFound'
import TableLoading from '../../../components/Table/TableLoading'
import StatusOrder from '../../../components/StatusOrder'
import OrderService from '../../../services/order'
import AlertDialogDelete from '../../../components/AlertDialogDelete'
import IOrder, { INITIAL_ORDER } from '../../../interfaces/IOrder'
import QRCode from 'react-qr-code'
import PrintBarcode from '../../../components/PrintBarcode'
import { useReactToPrint } from 'react-to-print'

const Order: FC<IPage> = () => {
   const toast = useToast()

   const [orderSelected, setOrderSelected] = useState<IOrder>(INITIAL_ORDER)
   const [page, setPage] = useState<number>(1)
   const [searchValue, setSearchValue] = useState<string>('')
   const [btnNewOrderIsLoading, setBtnNewOrderIsLoading] = useState(false)
   const barcodeRef = useRef(null)

   const { data: dataOrders, error: errorOrders } = useSWR(
      `/api/orders?page=${page}&id=${searchValue}`
   )

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
   }

   // Print barcode
   const handlePrintBarcode = useReactToPrint({
      content: () => barcodeRef.current,
      pageStyle: pageStyle,
   })

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
                                 <Button
                                    variant='solid'
                                    colorScheme='cyan'
                                    onClick={() => handleOpenBarcode(order)}
                                 >
                                    <IoMdBarcode size='16px' />
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
      </Box>
   )
}

const pageStyle = `
   @page {
      size: 90mm 160mm;
   }
`

export default Order
