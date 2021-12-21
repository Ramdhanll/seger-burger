import mongoose, { Document, Schema } from 'mongoose'
import customId from '../helpers/customId'
import { IProductModel } from './productModel'

const { ObjectId } = mongoose.Types

interface IOrderModel extends Document {
   _id: string
   link: string
   orders: {
      product: IProductModel
      qty: number
   }
   total: number
   status: 'WAITING' | 'COOKED' | 'DELIVERED' | 'COMPLETED'
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
      orders: [
         {
            product: {
               type: ObjectId,
               ref: 'products',
            },
            qty: {
               type: Number,
            },
         },
      ],
      total: {
         type: Number,
         default: 0,
      },
      status: {
         type: String,
         enum: ['WAITING', 'COOKED', 'DELIVERED', 'COMPLETED'],
         default: 'WAITING',
      },
   },
   {
      timestamps: true,
   }
)

const Orders = mongoose.model<IOrderModel>('Orders', OrderSchema)

export default Orders
