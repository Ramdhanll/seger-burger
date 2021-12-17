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
   Modal,
   ModalOverlay,
   ModalContent,
   ModalHeader,
   ModalFooter,
   ModalBody,
   ModalCloseButton,
   useDisclosure,
   VStack,
   Image,
   useToast,
   HStack,
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import React, { FC, useState } from 'react'
import Heading from '../../../components/Admin/Heading'
import Pagination from '../../../components/Pagination'
import Search from '../../../components/Search'
import IPage from '../../../interfaces/IPage'
import * as Yup from 'yup'
import { FormikInput, FormikPhoto, FormikSelect } from '../../../helpers/Formik'
import logging from '../../../config/logging'
import ProductService from '../../../services/product'
import useSWR, { mutate } from 'swr'
import { MdDelete, MdEdit } from 'react-icons/md'
import AlertDialogDelete from '../../../components/AlertDialogDelete'
import PreviewPhoto from '../../../components/PreviewPhoto'

interface IProduct {
   _id?: string
   name: string
   photo: string
   category: 'food' | 'drink'
   price: number
}

interface IProductFormValues {
   name: string
   category: string
   price: number
}

const Product: FC<IPage> = () => {
   const toast = useToast()
   const { isOpen, onOpen, onClose } = useDisclosure()

   const [productSelected, setProductSelected] = useState<IProduct | null>()
   const [isAdd, setIsAdd] = useState<boolean>(true)

   const [page, setPage] = useState<number>(1)
   const [searchValue, setSearchValue] = useState<string>('')

   const { data: dataProducts } = useSWR(
      `/api/products?page=${page}&name=${searchValue}`
   )

   const handlePagination = (i: number) => {
      setPage(i)
   }

   // SECTION ADD AND EDIT PRODUCT

   const handleOpenModalAddEdit = ({
      isAdd,
      product,
   }: {
      isAdd: boolean
      product?: IProduct
   }) => {
      setIsAdd(isAdd)
      if (product) setProductSelected(product)
      onOpen()
   }

   const [photoFile, setPhotoFile] = useState('')
   const [photoPrev, setPhotoPrev] = useState<any>('')

   const initialValues: IProductFormValues = {
      name: productSelected?.name || '',
      category: productSelected?.category || '',
      price: productSelected?.price || 0,
   }

   const validationSchema = Yup.object({
      name: Yup.string().required('Name required'),
      category: Yup.string().required('Category required'),
      price: Yup.number().required('Price required'),
   })

   const handlePreviewPhoto = (e: any) => {
      const file = e.target.files[0]
      console.log(file)
      var t = file.type.split('/').pop().toLowerCase()
      if (
         t !== 'jpeg' &&
         t !== 'jpg' &&
         t !== 'png' &&
         t !== 'bmp' &&
         t !== 'gif'
      ) {
         toast({
            title: 'Gagal',
            description: 'Gunakan file photo',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
         })
         return false
      }
      setPhotoFile(file)
      let reader = new FileReader()
      reader.onload = () => {
         const src = reader.result
         setPhotoPrev(src)
      }

      reader.readAsDataURL(file)
   }

   const handleSubmit = async (values: any, actions: any) => {
      logging.info('creating product ....')

      try {
         if (isAdd) {
            if (photoPrev === '') throw new Error('Photo is required')
         }

         const reqData = new FormData()
         reqData.append('photo', photoFile)
         reqData.append('name', values.name)
         reqData.append('category', values.category)
         reqData.append('price', values.price)

         if (isAdd) {
            await ProductService.Create(reqData)
         } else {
            await ProductService.Update(productSelected?._id, reqData)
         }

         actions.setSubmitting(false)

         // mutate swr
         mutate(`/api/products?page=${page}&name=${searchValue}`)
         onClose()
         setProductSelected(null)
      } catch (error) {
         actions.setSubmitting(false)
      }
   }

   // Preview photo on table
   const [prevPhotoOnTable, setPrevPhotoOnTable] = useState<string>('')
   const {
      isOpen: isOpenPreviewPhoto,
      onOpen: onOpenPreviewPhoto,
      onClose: onClosePreviewPhoto,
   } = useDisclosure()

   const handlePreviewPhotoOnTable = (photo: string) => {
      setPrevPhotoOnTable(photo)
      onOpenPreviewPhoto()
   }

   const {
      isOpen: isOpenAlertDelete,
      onOpen: onOpenAlertDelete,
      onClose: onCloseAlertDelete,
   } = useDisclosure()

   const [isLoadingAlertDelete, setIsLoadingAlertDelete] =
      useState<boolean>(false)

   const handleOpenAlertDelete = (product: IProduct) => {
      setProductSelected(product)
      onOpenAlertDelete()
   }

   const handleConfirmDelete = async () => {
      setIsLoadingAlertDelete(true)
      try {
         await ProductService.Delete(productSelected?._id)
         mutate(`/api/products?page=${page}&name=${searchValue}`)
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

   return (
      <Box textAlign='left' py={3} bg='white' alignItems='center'>
         <Flex justifyContent='space-between'>
            <Heading>PRODUCT</Heading>
            <Button
               variant='solid'
               bg='yellow.400'
               color='gray.50'
               size='sm'
               onClick={() => handleOpenModalAddEdit({ isAdd: true })}
               _focus={{ outline: 'none' }}
            >
               <Text>New Product</Text>
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
         <Box mt='30px' mb='20px'>
            <Table variant='simple'>
               <Thead>
                  <Tr>
                     <Th>No</Th>
                     <Th>Photo</Th>
                     <Th>Name</Th>
                     <Th>Category</Th>
                     <Th>Price</Th>
                     <Th>Actions</Th>
                  </Tr>
               </Thead>
               <Tbody>
                  {dataProducts?.products?.length ? (
                     dataProducts?.products?.map(
                        (product: IProduct, i: number) => (
                           <Tr key={i}>
                              <Td>{i + 1}</Td>
                              <Td>
                                 <Box
                                    cursor='pointer'
                                    onClick={() =>
                                       handlePreviewPhotoOnTable(product.photo)
                                    }
                                 >
                                    <Image
                                       src={product.photo}
                                       fallbackSrc='https://via.placeholder.com/50'
                                       w='100px'
                                       h='50px'
                                       borderRadius='md'
                                    />
                                 </Box>
                              </Td>
                              <Td>
                                 <Text fontSize={['xs', 'sm', 'md']}>
                                    {product.name}
                                 </Text>
                              </Td>
                              <Td>
                                 <Text fontSize={['xs', 'sm', 'md']}>
                                    {product.category}
                                 </Text>
                              </Td>
                              <Td>
                                 <Text fontSize={['xs', 'sm', 'md']}>
                                    {product.price}
                                 </Text>
                              </Td>
                              <Td>
                                 <HStack spacing={3}>
                                    <Button
                                       variant='solid'
                                       colorScheme='cyan'
                                       onClick={() =>
                                          handleOpenModalAddEdit({
                                             isAdd: false,
                                             product: product,
                                          })
                                       }
                                    >
                                       <MdEdit size='16px' />
                                    </Button>
                                    <Button
                                       variant='outline'
                                       colorScheme='red'
                                       onClick={() =>
                                          handleOpenAlertDelete(product)
                                       }
                                    >
                                       <MdDelete size='16px' />
                                    </Button>
                                 </HStack>
                              </Td>
                           </Tr>
                        )
                     )
                  ) : (
                     <Tr>
                        <Td
                           colSpan={6}
                           bg='yellow.300'
                           color='text'
                           textAlign='center'
                        >
                           Data tidak ditemukan
                        </Td>
                     </Tr>
                  )}
               </Tbody>
            </Table>
         </Box>

         <Box display={dataProducts?.products?.length ? 'inline' : 'none'}>
            <Pagination
               page={dataProducts?.page}
               pages={dataProducts?.pages}
               handlePagination={(e) => handlePagination(e)}
            />
         </Box>

         {/* Modal Add Product */}
         <Modal isOpen={isOpen} onClose={onClose} size='xs'>
            <ModalOverlay />
            <ModalContent>
               <ModalHeader>Add Product</ModalHeader>
               <ModalCloseButton _focus={{ outline: 'none' }} />
               <ModalBody>
                  <Box
                     d='flex'
                     justifyContent='center'
                     alignItems='center'
                     flexDirection='column'
                     mb='30px'
                  >
                     <Image
                        borderRadius='md'
                        src={photoPrev || productSelected?.photo}
                        fallbackSrc='https://via.placeholder.com/150'
                     />
                  </Box>
                  <Formik
                     initialValues={initialValues}
                     onSubmit={handleSubmit}
                     validationSchema={validationSchema}
                     enableReinitialize
                  >
                     {(props) => (
                        <Form>
                           <VStack spacing={5}>
                              <FormikInput
                                 name='name'
                                 label='Name'
                                 required={true}
                                 placeholder='the name of product'
                              />
                              <FormikSelect
                                 name='category'
                                 label='Category'
                                 options={[
                                    { key: 1, name: 'Food', value: 'Food' },
                                    { key: 2, name: 'Drink', value: 'Drink' },
                                 ]}
                                 placeholder='Select category'
                              />
                              <FormikInput
                                 name='price'
                                 type='number'
                                 label='Price'
                                 required={true}
                              />

                              <FormikPhoto
                                 name='photo'
                                 label='Photo'
                                 onChange={handlePreviewPhoto}
                              />

                              <Button
                                 type='submit'
                                 isLoading={props.isSubmitting}
                                 variant='solid'
                                 colorScheme='cyan'
                                 w='100%'
                              >
                                 {isAdd ? 'Create' : 'Edit'}
                              </Button>
                           </VStack>
                        </Form>
                     )}
                  </Formik>
               </ModalBody>

               <ModalFooter></ModalFooter>
            </ModalContent>
         </Modal>

         {/* Modal preview photo */}
         <PreviewPhoto
            isOpenPreviewPhoto={isOpenPreviewPhoto}
            onClosePreviewPhoto={onClosePreviewPhoto}
            image={prevPhotoOnTable}
         />

         {/* Alert delete product */}
         <AlertDialogDelete
            header='Delete Product'
            body='Deleting the machine will delete all dependent data with this ID, Are you sure you want to delete?'
            isOpen={isOpenAlertDelete}
            onClose={onCloseAlertDelete}
            isLoading={isLoadingAlertDelete}
            handleConfirm={handleConfirmDelete}
            handleCloseAlert={handleCloseAlertDelete}
         />
      </Box>
   )
}

export default Product
