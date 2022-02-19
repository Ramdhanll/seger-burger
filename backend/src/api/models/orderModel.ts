import mongoose, { Document, Schema } from 'mongoose'
import customId from '../helpers/customId'
import { IProductModel } from './productModel'

const { ObjectId } = mongoose.Types

export interface IOrderModel extends Document {
   _id: string
   link: string
   orders: {
      product: IProductModel
      qty: number
      status?: 'COOKED' | 'DELIVERED'
      createdAt?: Date
   }[]
   total: number
   status: 'WAITING' | 'COOKED' | 'DELIVERED' | 'COMPLETED'
   cash?: number
   change?: number
}

const OrderSchema = new Schema<IOrderModel>(
   {
      _id: {
         type: String,
         required: true,
      },
      link: {
         type: String,
         required: true,
      },
      orders: [{ type: ObjectId, ref: 'ListsOrder' }],
      total: {
         type: Number,
         default: 0,
      },
      status: {
         type: String,
         enum: ['WAITING', 'COOKED', 'DELIVERED', 'COMPLETED'],
         default: 'WAITING',
      },
      cash: {
         type: Number,
      },
      change: {
         type: Number,
      },
   },
   {
      timestamps: true,
   }
)

const Orders = mongoose.model<IOrderModel>('Orders', OrderSchema)

export default Orders
