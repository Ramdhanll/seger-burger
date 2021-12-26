import axios from 'axios'
import config from '../config/config'
import logging from '../config/logging'

const isExist = async (id: any) => {
   logging.info(`Check id order`)

   try {
      const { data } = await axios.get(`${config.server.url}/api/orders/${id}`)
      logging.info(`id order exist`)

      return data
   } catch (error) {
      logging.error(error)
      throw error
   }
}

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

const order = async (id: any, values: any) => {
   try {
      const { data } = await axios.put(`/api/orders/${id}/order`, {
         orders: values,
      })
      return data
   } catch (error) {
      throw error
   }
}

const OrderService = {
   Delete,
   Create,
   Update,
   isExist,
   order,
}

export default OrderService
