import { Request, Response } from 'express'
import logging from '../../config/logging'
import { validationResult } from 'express-validator'
import dotenv from 'dotenv'
import Products from '../models/productModel'
import Orders from '../models/orderModel'
import customId from '../helpers/customId'
dotenv.config()

export const getOrders = async (req: Request, res: Response) => {
   logging.info(`Incoming get orders`)

   const pageSize = Number(req.query.limit) || 10
   const page = Number(req.query.page) || 1
   const order = req.query.order || ''
   const _id = req.query.id || ''

   const _idFilter = _id ? { _id: { $regex: _id, $options: 'i' } } : {}
   const orderFilter = order ? { order: { $regex: order, $options: 'i' } } : {}

   try {
      const count = await Orders.countDocuments({
         ..._idFilter,
      })

      const orders = await Orders.find({
         ..._idFilter,
      })
         .sort('-createdAt')
         .select('-password')
         .skip(pageSize * (page - 1))
         .limit(pageSize)

      res.status(200).json({
         orders,
         page,
         pages: Math.ceil(count / pageSize),
      })
   } catch (error) {
      res.status(500).json({ message: 'Server down!', error })
   }
}

export const createOrder = async (req: Request, res: Response) => {
   logging.info('Incoming create order')

   try {
      const id = customId()

      const values = {
         _id: id,
         link: `${process.env.CLIENT_URI}/order/${id}`,
      }

      const createOrder = new Orders(values)
      const createdOrder = await createOrder.save()

      logging.info('Order created successfully')

      res.status(201).json({
         status: 'success',
         order: createdOrder,
         message: 'Order has been created',
      })
   } catch (error) {
      logging.error(error)
      return res.status(500).json({ error })
   }
}

export const updateOrder = async (req: Request, res: Response) => {
   const _id = req.params.id
   logging.info(`Incoming update for ${_id} ...`)

   try {
      const order = await Orders.findById(_id)

      if (!order) throw new Error('Order tidak ditemukan')

      order.set(req.body)

      const orderUpdated = await order?.save()
      return res.status(200).json({ order: orderUpdated })
   } catch (error) {
      return res.status(500).json(error)
   }
}

export const deleteOrder = async (req: Request, res: Response) => {
   const _id = req.params.id

   try {
      logging.info(`Incoming delete for ${_id}`)

      await Products.deleteMany({ order: _id })
      await Orders.deleteOne({ _id })

      logging.info('Order deleted successfully')
      return res.status(200).json({ message: 'Order deleted successfully' })
   } catch (error) {
      logging.error('Order failed to delete')
      return res.status(500).json({ error })
   }
}
