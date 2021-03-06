import mongoose, { Schema, Document } from 'mongoose'
const { ObjectId } = mongoose.Types

export interface IProductModel extends Document {
   _id?: string | object // type object for query search in controller
   name: string | object // type object for query search in controller
   photo: string
   weight: string
   category: object
   price: number
   qty: number
}

const ProductSchema = new Schema<IProductModel>(
   {
      name: {
         type: String,
         required: true,
      },
      photo: {
         type: String,
         required: true,
      },
      weight: {
         type: String,
      },
      category: {
         type: ObjectId,
         ref: 'Categories',
      },
      price: {
         type: Number,
         required: true,
      },
      qty: {
         type: Number,
         default: 0,
      },
   },
   {
      timestamps: true,
   }
)
ProductSchema.index({ name: 1 })

const Products = mongoose.model<IProductModel>('Products', ProductSchema)

export default Products
