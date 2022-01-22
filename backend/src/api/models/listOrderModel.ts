import { IProductModel } from './productModel'
import mongoose, { Document, Schema } from 'mongoose'
import { IOrderModel } from './orderModel'
const { ObjectId } = mongoose.Types

export interface IListOrder extends Document {
   order: IOrderModel
   lists: {
      _id?: string
      product: IProductModel
      qty: number
      status: 'COOKED' | 'DELIVERED'
   }[]
}

const ListOrderSchema = new Schema<IListOrder>(
   {
      order: {
         type: String,
         ref: 'Orders',
      },
      lists: [
         {
            product: {
               type: ObjectId,
               ref: 'Products',
            },
            qty: {
               type: Number,
               default: 1,
            },
            status: {
               type: String,
               default: 'COOKED',
               enum: ['COOKED', 'DELIVERED'],
            },
         },
      ],
   },
   {
      timestamps: true,
   }
)

const ListOrder = mongoose.model('ListsOrder', ListOrderSchema)

export default ListOrder
