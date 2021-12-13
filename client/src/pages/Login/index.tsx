import React, { FC, useContext, useEffect } from 'react'
import {
   Box,
   Button,
   Center,
   Image,
   ListItem,
   Text,
   UnorderedList,
   useToast,
   VStack,
   Link,
} from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { FormikInput, FormikPassword } from '../../helpers/Formik'
import AuthService from '../../services/auth'
import logging from '../../config/logging'
import UserContext from '../../contexts/user'
import { NavLink, useNavigate } from 'react-router-dom'
import Logo from '../../assets/logo.png'

interface ILogin {}

const Login: FC<ILogin> = () => {
   const { userState, userDispatch } = useContext(UserContext)
   const navigate = useNavigate()
   const toast = useToast()

   // isAuth
   useEffect(() => {
      if (userState.isLogged) navigate('/admin')
   }, [userState.isLogged, navigate])

   const validationSchema = Yup.object({
      email: Yup.string().required('Email diperlukan').email('Email invalid'),
      password: Yup.string().required('Password diperlukan'),
   })

   const handleSubmit = async (values: any, actions: any) => {
      return AuthService.Login(values, (error, user) => {
         if (error) {
            logging.error(error)

            const renderError = (
               <UnorderedList>
                  {error?.response?.data?.errors?.length ? (
                     error.response.data.errors.map(
                        (item: any, i: React.Key | null | undefined) => (
                           <ListItem key={i}>
                              {Object.keys(item.msg).length ? item.msg : ``}
                           </ListItem>
                        )
                     )
                  ) : (
                     <ListItem></ListItem>
                  )}
               </UnorderedList>
            )

            toast({
               title: `Login tidak berhasil`,
               description: renderError,
               status: 'warning',
               isClosable: true,
               position: 'top-end',
            })
         } else if (user) {
            toast({
               title: `Login berhasil`,
               status: 'success',
               isClosable: true,
               position: 'top-end',
            })

            userDispatch({ type: 'login', payload: { user, isLogged: true } })
            return navigate('/admin')
         }
      })
   }

   return (
      <Center h='100vh'>
         <Box boxShadow='lg' borderRadius='md' p='20px'>
            <Link as={NavLink} to='/'>
               <Image h='40px' src={Logo} />
            </Link>
            <VStack spacing={1} my={5} alignItems='start'>
               <Text
                  textAlign='left'
                  fontSize={['md', 'lg', 'xl']}
                  fontWeight='600'
                  color='gray.900'
               >
                  Login
               </Text>
               <Text
                  textAlign='left'
                  fontSize={['sm', 'md', 'lg']}
                  color='gray.500'
               >
                  see the progress of your restaurant
               </Text>
            </VStack>
            <Formik
               initialValues={{
                  email: '',
                  password: '',
               }}
               onSubmit={handleSubmit}
               validationSchema={validationSchema}
            >
               {(props) => (
                  <Form>
                     <VStack spacing={5}>
                        <FormikInput
                           name='email'
                           label='Email'
                           required={true}
                           type='email'
                        />
                        <FormikPassword
                           name='password'
                           label='Password'
                           required={true}
                        />

                        <Button
                           type='submit'
                           isLoading={props.isSubmitting}
                           variant='solid'
                           // colorScheme='yellow'
                           bg='yellow.400'
                           color='gray.700'
                           w='100%'
                           _hover={{ bg: 'yellow.500' }}
                        >
                           Masuk
                        </Button>
                     </VStack>
                  </Form>
               )}
            </Formik>
         </Box>
      </Center>
   )
}

export default Login
