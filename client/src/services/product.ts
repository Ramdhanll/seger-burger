import axios from 'axios'
import config from '../config/config'
import logging from '../config/logging'

const Create = async (values: any) => {
   logging.info('Creating product...')

   try {
      const { data } = await axios.post(
         `${config.server.url}/api/products`,
         values
      )
      logging.info('product created successfully')

      return data
   } catch (error) {
      logging.error(error)
      throw error
   }
}

// const Create = async (
//    product: IProduct,
//    callback: (error: string | null, product: IProduct | null) => void
// ) => {
//    logging.info('Creating product...')

//    try {
//       const { data } = await axios.post(
//          `${config.server.url}/api/products`,
//          product
//       )
//       logging.info('Successfuly create product.')
//       callback(null, data.product)
//    } catch (error) {
//       logging.error(error)
//       callback(`Failed create product`, null)
//    }
// }

// const Login = async (
//    values: any,
//    callback: (error: any | null, user: IUser | null) => void
// ) => {
//    try {
//       const response = await axios.post(
//          `${config.server.url}/api/auth/login`,
//          values
//       )
//       logging.info('Login successfully')
//       callback(null, response.data.user)
//    } catch (error) {
//       logging.error(error)
//       callback(error, null)
//    }
// }

// const Register = async (
//    values: any,
//    callback: (error: any | null, user: IUser | null) => void
// ) => {
//    try {
//       const response = await axios.post(
//          `${config.server.url}/api/auth/register`,
//          values
//       )
//       logging.info('Register successfully')
//       callback(null, response.data.user)
//    } catch (error) {
//       logging.error(error)
//       callback(error, null)
//    }
// }

const ProductService = {
   Create,
}

export default ProductService
