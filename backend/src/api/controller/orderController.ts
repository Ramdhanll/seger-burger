import { Request, Response } from 'express'
import logging from '../../config/logging'
import { validationResult } from 'express-validator'
import dotenv from 'dotenv'
import Products from '../models/productModel'
import Orders from '../models/orderModel'
import customId from '../helpers/customId'
import ListOrder, { IListOrder } from '../models/listOrderModel'
dotenv.config()

export const getOrder = async (req: Request, res: Response) => {
   logging.info('Incoming get order')

   try {
      const order = await Orders.findById(req.params.id).populate({
         path: 'orders',
         populate: { path: 'lists.product' },
      })

      if (!order) return res.status(404).json({ message: 'Order not found' })

      res.status(200).json({ order })
   } catch (error) {
      res.status(500).json({ message: 'Server down!', error })
   }
}

export const getOrders = async (req: Request, res: Response) => {
   logging.info(`Incoming get orders`)

   const pageSize = Number(req.query.limit) || 10
   const page = Number(req.query.page) || 1
   const order = req.query.order || ''
   const _id = req.query.id || ''
   const status: string = (req.query.status as string) || ''

   const _idFilter = _id ? { _id: { $regex: _id, $options: 'i' } } : {}
   const orderFilter = order ? { order: { $regex: order, $options: 'i' } } : {}
   const statusFilter = status.split(' ').map((status) => {
      return {
         status: { $regex: status, $options: 'i' },
      }
   })

   try {
      const count = await Orders.countDocuments({
         ..._idFilter,
         $or: statusFilter,
      })

      const orders = await Orders.find({
         ..._idFilter,
         $or: statusFilter,
      })
         .populate({ path: 'orders', populate: { path: 'lists.product' } })
         .sort('-createdAt')
         .skip(pageSize * (page - 1))
         .limit(pageSize)

      res.status(200).json({
         orders,
         page,
         pages: Math.ceil(count / pageSize),
      })
   } catch (error) {
      logging.error(error)
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

      await Orders.deleteOne({ _id })

      logging.info('Order deleted successfully')
      return res.status(200).json({ message: 'Order deleted successfully' })
   } catch (error) {
      logging.error('Order failed to delete')
      return res.status(500).json({ error })
   }
}

export const orderMenu = async (req: Request, res: Response) => {
   const _id = req.params.id
   const { orders } = req.body
   const lists = []

   try {
      const order = await Orders.findById(_id)
      if (!order) throw new Error('Order not found')

      // lakukan perulangan pada order baru
      // for (let i = 0; i < orders.length; i++) {
      //    let isExist = false

      //    // cek order lama ( yang ada di db ) dengan order baru
      //    // jika ada tambah qty nya dan rubah variable isExist menjadi true

      //    for (let j = 0; j < order.orders.length; j++) {
      //       if (orders[i]._id === order.orders[j].product.toString()) {
      //          order.orders[j].qty = orders[i].qty + order.orders[j].qty
      //          isExist = true

      //          // jika sudah ketemua lakukan break, dan perulangan berhenti
      //          break
      //       }
      //    }

      //    // jika tidak ada yang sama, tambahkan order baru, ke db
      //    if (!isExist) {
      //       order.orders.push({
      //          product: orders[i]._id,
      //          qty: orders[i].qty,
      //       })
      //    }
      // }

      for (let i = 0; i < orders.length; i++) {
         lists.push({
            product: orders[i]._id,
            qty: orders[i].qty,
         })
      }

      const createListOrder = new ListOrder({ order: order._id, lists })
      const createdListOrder = await createListOrder.save()

      const total = orders.reduce(
         (total: number, num: any) => total + num.price * num.qty,
         0
      )

      order.orders.push(createdListOrder._id)
      order.total = order.total + total
      order.status = 'COOKED'

      const updatedOrder = await order.save()
      return res.status(200).json({ message: 'success', order: updatedOrder })
   } catch (error) {
      logging.error(error)
      return res.status(500).json({ error })
   }
}

export const orderDelivered = async (req: Request, res: Response) => {
   logging.info('Incoming order delivered')
   const order_id = req.params.id
   const order_list_id = req.params.order_list_id

   try {
      const orders = await ListOrder.find({ order: order_id })
      if (!orders) res.status(404).json({ message: 'Order list not found' })

      let indexOrder = null
      let indexList = null

      for (let i = 0; i < orders.length; i++) {
         const index = orders[i].lists.findIndex(
            (list) => list._id?.toString() === order_list_id
         )
         if (index > -1) {
            indexOrder = i
            indexList = index

            break
         }
      }

      if (indexOrder !== null && indexList !== null) {
         orders[indexOrder].lists[indexList].status = 'DELIVERED'

         try {
            const updatedOrders = await orders[indexOrder].save()
            const order = await Orders.findById(updatedOrders.order).populate({
               path: 'orders',
               populate: { path: 'lists.product' },
            })
            return res.status(200).json({ order })
         } catch (error) {
            return res.status(404).json({ message: 'Order not found' })
         }
      }

      return res.status(404).json({ message: 'Order not found' })
   } catch (error) {
      logging.error(error)
      return res.status(500).json({ error })
   }
}

export const orderPayment = async (req: Request, res: Response) => {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
   }

   const _id = req.params.id
   const cash = Number(req.body.cash)

   try {
      const order = await Orders.findById(_id)
      if (!order) return res.status(404).json({ message: 'Order not found' })

      order.status = 'COMPLETED'
      order.cash = cash
      order.change = cash - order.total

      const updatedOrder = await order.save()

      return res
         .status(200)
         .json({ order: updatedOrder, message: 'Payment successfully' })
   } catch (error) {
      return res.status(500).json({ error })
   }
}

export const getReport = async (req: Request, res: Response) => {
   try {
      const orders = await Orders.find({ status: 'COMPLETED' })

      const totalPrice = orders.reduce((prev, curr) => prev + curr.total, 0)

      return res.status(200).json({ totalPrice, totalOrders: orders.length })
   } catch (error) {
      return res.status(500).json({ error })
   }
}
