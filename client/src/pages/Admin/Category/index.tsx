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
import { FormikInput, FormikPhoto } from '../../../helpers/Formik'
import logging from '../../../config/logging'
import CategoryService from '../../../services/category'
import useSWR, { mutate } from 'swr'
import { MdDelete, MdEdit } from 'react-icons/md'
import AlertDialogDelete from '../../../components/AlertDialogDelete'
import PreviewPhoto from '../../../components/PreviewPhoto'

interface ICategory {
   _id?: string
   name: string
   logo: string
}

interface ICategoryFormValues {
   name: string
}

const Category: FC<IPage> = () => {
   const toast = useToast()
   const { isOpen, onOpen, onClose } = useDisclosure()

   const [categorySelected, setCategorySelected] = useState<ICategory | null>()
   const [isAdd, setIsAdd] = useState<boolean>(true)

   const [page, setPage] = useState<number>(1)
   const [searchValue, setSearchValue] = useState<string>('')

   const { data: dataCategories } = useSWR(
      `/api/categories?page=${page}&name=${searchValue}`
   )

   const handlePagination = (i: number) => {
      setPage(i)
   }

   // SECTION ADD AND EDIT CATEGORY

   const cleanForm = () => {
      setCategorySelected(null)
      setPhotoFile('')
   }

   const handleOpenModalAddEdit = ({
      isAdd,
      category,
   }: {
      isAdd: boolean
      category?: ICategory
   }) => {
      cleanForm()
      setPhotoPrev(null)
      setIsAdd(isAdd)
      if (category) setCategorySelected(category)
      onOpen()
   }

   const [photoFile, setPhotoFile] = useState('')
   const [photoPrev, setPhotoPrev] = useState<any>('')

   const initialValues: ICategoryFormValues = {
      name: categorySelected?.name || '',
   }

   const validationSchema = Yup.object({
      name: Yup.string().required('Name required'),
   })

   const handlePreviewLogo = (e: any) => {
      const file = e.target.files[0]
      console.log(file)
      var t = file.type.split('/').pop().toLowerCase()
      console.log('t', t)
      if (
         t !== 'jpeg' &&
         t !== 'jpg' &&
         t !== 'png' &&
         t !== 'svg' &&
         t !== 'svg+xml'
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
      logging.info('creating category ....')

      try {
         if (isAdd) {
            if (photoPrev === '') throw new Error('Photo is required')
         }

         const reqData = new FormData()
         reqData.append('logo', photoFile)
         reqData.append('name', values.name)

         if (isAdd) {
            await CategoryService.Create(reqData)
         } else {
            await CategoryService.Update(categorySelected?._id, reqData)
         }

         toast({
            title: 'Success',
            description: `Category  ${
               isAdd ? 'created' : 'edited'
            } successfully`,
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
         })
         actions.setSubmitting(false)

         // mutate swr
         mutate(`/api/categories?page=${page}&name=${searchValue}`)
         onClose()
         cleanForm()
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

   const handleOpenAlertDelete = (category: ICategory) => {
      setCategorySelected(category)
      onOpenAlertDelete()
   }

   const handleConfirmDelete = async () => {
      setIsLoadingAlertDelete(true)
      try {
         await CategoryService.Delete(categorySelected?._id)
         mutate(`/api/categories?page=${page}&name=${searchValue}`)
         setIsLoadingAlertDelete(false)
         onCloseAlertDelete()
      } catch (error) {
         setIsLoadingAlertDelete(false)
         toast({
            title: 'Failed',
            description: 'Failed delete category',
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
            <Heading>CATEGORY</Heading>
            <Button
               variant='solid'
               bg='yellow.400'
               color='gray.50'
               size='sm'
               onClick={() => handleOpenModalAddEdit({ isAdd: true })}
               _focus={{ outline: 'none' }}
            >
               <Text>New Category</Text>
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
                     <Th>Logo</Th>
                     <Th>Name</Th>
                     <Th>Actions</Th>
                  </Tr>
               </Thead>
               <Tbody>
                  {dataCategories?.categories?.length ? (
                     dataCategories?.categories?.map(
                        (category: ICategory, i: number) => (
                           <Tr key={i}>
                              <Td>{i + 1}</Td>
                              <Td>
                                 <Box
                                    cursor='pointer'
                                    onClick={() =>
                                       handlePreviewPhotoOnTable(category.logo)
                                    }
                                 >
                                    <Image
                                       src={category.logo}
                                       fallbackSrc='https://via.placeholder.com/50'
                                       w='100px'
                                       h='50px'
                                       borderRadius='md'
                                    />
                                 </Box>
                              </Td>
                              <Td>
                                 <Text fontSize={['xs', 'sm', 'md']}>
                                    {category.name}
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
                                             category: category,
                                          })
                                       }
                                    >
                                       <MdEdit size='16px' />
                                    </Button>
                                    <Button
                                       variant='outline'
                                       colorScheme='red'
                                       onClick={() =>
                                          handleOpenAlertDelete(category)
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

         <Box display={dataCategories?.categories?.length ? 'inline' : 'none'}>
            <Pagination
               page={dataCategories?.page}
               pages={dataCategories?.pages}
               handlePagination={(e) => handlePagination(e)}
            />
         </Box>

         {/* Modal Add Category */}
         <Modal isOpen={isOpen} onClose={onClose} size='xs'>
            <ModalOverlay />
            <ModalContent>
               <ModalHeader>Add Category</ModalHeader>
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
                        src={photoPrev || categorySelected?.logo}
                        fallbackSrc='https://via.placeholder.com/50'
                        w='50px'
                        h='50px'
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
                              <FormikPhoto
                                 name='logo'
                                 label='Logo'
                                 onChange={handlePreviewLogo}
                              />
                              <FormikInput
                                 name='name'
                                 label='Name'
                                 required={true}
                                 placeholder='the name of category'
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

         {/* Alert delete category */}
         <AlertDialogDelete
            header='Delete Category'
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

export default Category
