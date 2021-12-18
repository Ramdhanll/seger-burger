import axios from 'axios'
import config from '../config/config'
import logging from '../config/logging'

const Create = async (values: any) => {
   logging.info('Creating category...')

   try {
      const { data } = await axios.post(
         `${config.server.url}/api/categories`,
         values
      )
      logging.info('category created successfully')

      return data
   } catch (error) {
      logging.error(error)
      throw error
   }
}

const Update = async (id: any, values: any) => {
   logging.info('Updating category...')

   try {
      if (!id) throw new Error('Category tidak ditemukan')

      const { data } = await axios.put(
         `${config.server.url}/api/categories/${id}`,
         values
      )
      logging.info('category updated successfully')

      return data
   } catch (error) {
      logging.error(error)
      throw error
   }
}

const Delete = async (id: any) => {
   try {
      const { data } = await axios.delete(`/api/categories/${id}`)
      return data
   } catch (error) {
      throw error
   }
}

const CategoryService = {
   Delete,
   Create,
   Update,
}

export default CategoryService
