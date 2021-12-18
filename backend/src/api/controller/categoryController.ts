import { Request, Response } from 'express'
import logging from '../../config/logging'
import { validationResult } from 'express-validator'
import dotenv from 'dotenv'
import Categories from '../models/categoryModel'
import Products from '../models/productModel'
dotenv.config()

export const getCategories = async (req: Request, res: Response) => {
   logging.info(`Incoming get categories`)

   const pageSize = Number(req.query.limit) || 10
   const page = Number(req.query.page) || 1
   const name = req.query.name || ''
   const category = req.query.category || ''
   const _id = req.query.id || ''

   const _idFilter = _id ? { _id } : {}
   const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {}
   const categoryFilter = category
      ? { category: { $regex: category, $options: 'i' } }
      : {}

   try {
      const count = await Categories.countDocuments({
         ..._idFilter,
         ...nameFilter,
      })

      const categories = await Categories.find({
         ..._idFilter,
         ...nameFilter,
      })
         .select('-password')
         .skip(pageSize * (page - 1))
         .limit(pageSize)

      res.status(200).json({
         categories,
         page,
         pages: Math.ceil(count / pageSize),
      })
   } catch (error) {
      res.status(500).json({ message: 'Server down!', error })
   }
}

export const createCategory = async (req: Request, res: Response) => {
   logging.info('Incoming create category')

   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
   }

   try {
      if (!req.file) throw 'Logo diperlukan'

      const createCategory = new Categories({
         ...req.body,
         logo: `${process.env.SERVER_URI}/uploads/${req.file?.filename}`,
      })
      const createdCategory = await createCategory.save()

      logging.info('Category created successfully')

      res.status(201).json({
         status: 'success',
         category: createdCategory,
         message: 'Category has been created',
      })
   } catch (error) {
      logging.error(error)
      return res.status(500).json({ error })
   }
}

export const updateCategory = async (req: Request, res: Response) => {
   const _id = req.params.id
   logging.info(`Incoming update for ${_id} ...`)

   try {
      const category = await Categories.findById(_id)
      if (!category) throw 'Category not found'

      const values = {
         ...req.body,
         logo: req.file
            ? `${process.env.SERVER_URI}/uploads/${req.file?.filename}`
            : category.logo,
      }

      category.set(values)

      const categoryUpdated = await category?.save()
      return res.status(200).json({ category: categoryUpdated })
   } catch (error) {
      return res.status(500).json(error)
   }
}

export const deleteCategory = async (req: Request, res: Response) => {
   const _id = req.params.id

   try {
      logging.info(`Incoming delete for ${_id}`)

      await Products.deleteMany({ category: _id })
      await Categories.deleteOne({ _id })

      logging.info('Category deleted successfully')
      return res.status(200).json({ message: 'Category deleted successfully' })
   } catch (error) {
      logging.error('Category failed to delete')
      return res.status(500).json({ error })
   }
}
