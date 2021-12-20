import { Request, Response } from 'express'
import logging from '../../config/logging'
import { validationResult } from 'express-validator'
import Products from '../models/productModel'
import dotenv from 'dotenv'
import Categories from '../models/categoryModel'
dotenv.config()

export const getProducts = async (req: Request, res: Response) => {
   logging.info(`Incoming get products`)

   const pageSize = 10
   const page = Number(req.query.page) || 1
   const name = req.query.name || ''
   const category = req.query.category || ''
   const _id = req.query.id || ''

   const _idFilter = _id ? { _id } : {}
   const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {}

   // Filter by catyegory
   const getCategory = await Categories.find({ name: category })

   const categoryFilter = category ? { category: getCategory } : {}

   try {
      const count = await Products.countDocuments({
         ..._idFilter,
         ...nameFilter,
         ...categoryFilter,
      })

      const products = await Products.find({
         ..._idFilter,
         ...nameFilter,
         ...categoryFilter,
      })
         .select('-password')
         .populate('category')
         .skip(pageSize * (page - 1))
         .limit(pageSize)

      res.status(200).json({
         products,
         page,
         pages: Math.ceil(count / pageSize),
      })
   } catch (error) {
      logging.error(error)
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

export const updateProduct = async (req: Request, res: Response) => {
   const _id = req.params.id
   logging.info(`Incoming update for ${_id} ...`)

   try {
      const product = await Products.findById(_id)
      if (!product) throw 'Product not found'

      const values = {
         ...req.body,
         photo: req.file
            ? `${process.env.SERVER_URI}/uploads/${req.file?.filename}`
            : product.photo,
      }

      product.set(values)

      const productUpdated = await product?.save()
      return res.status(200).json({ product: productUpdated })
   } catch (error) {
      return res.status(500).json(error)
   }
}

export const deleteProduct = async (req: Request, res: Response) => {
   const _id = req.params.id

   try {
      logging.info(`Incoming delete for ${_id}`)
      await Products.deleteOne({ _id })

      logging.info('Product deleted successfully')
      return res.status(200).json({ message: 'Product deleted successfully' })
   } catch (error) {
      logging.error('Product failed to delete')
      return res.status(500).json({ error })
   }
}
