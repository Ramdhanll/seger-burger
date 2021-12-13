import { Request, Response } from 'express'
import logging from '../../config/logging'
import { validationResult } from 'express-validator'
import Products from '../models/productModel'
import dotenv from 'dotenv'
dotenv.config()

export const getProducts = async (req: Request, res: Response) => {
   logging.info(`Incoming get products`)

   const pageSize = 10
   const page = Number(req.query.page) || 1
   const name = req.query.name || ''
   const _id = req.query.id || ''

   const _idFilter = _id ? { _id } : {}
   const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {}

   try {
      const count = await Products.countDocuments({
         ..._idFilter,
         ...nameFilter,
      })

      const products = await Products.find({
         ..._idFilter,
         ...nameFilter,
      })
         .select('-password')
         .skip(pageSize * (page - 1))
         .limit(pageSize)

      res.status(200).json({
         products,
         page,
         pages: Math.ceil(count / pageSize),
      })
   } catch (error) {
      res.status(500).json({ message: 'Server down!', error })
   }
}

export const createProduct = async (req: Request, res: Response) => {
   logging.info('Incoming create product')

   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
   }

   try {
      if (!req.file) throw 'Photo diperlukan'

      const createProduct = new Products({
         ...req.body,
         photo: `${process.env.SERVER_URI}/uploads/${req.file?.filename}`,
      })
      const createdProduct = await createProduct.save()

      logging.info('Product created successfully')

      res.status(201).json({
         status: 'success',
         product: createdProduct,
         message: 'Product has been created',
      })
   } catch (error) {
      logging.error(error)
      return res.status(500).json({ error })
   }
}
