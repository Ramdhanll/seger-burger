import axios from 'axios'
import config from '../config/config'
import logging from '../config/logging'

const Create = async () => {
   logging.info('Creating order...')

   try {
      const { data } = await axios.post(`${config.server.url}/api/orders`)

      logging.info('order created successfully')

      return data
   } catch (error) {
      logging.error(error)
      throw error
   }
}

const Update = async (id: any, values: any) => {
   logging.info('Updating order...')

   try {
      if (!id) throw new Error('Order tidak ditemukan')

      const { data } = await axios.put(
         `${config.server.url}/api/orders/${id}`,
         values
      )
      logging.info('order updated successfully')

      return data
   } catch (error) {
      logging.error(error)
      throw error
   }
}

const Delete = async (id: any) => {
   try {
      const { data } = await axios.delete(`/api/orders/${id}`)
      return data
   } catch (error) {
      throw error
   }
}

const OrderService = {
   Delete,
   Create,
   Update,
}

export default OrderService
