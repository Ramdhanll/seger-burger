import mongoose, { Schema, Document } from 'mongoose'

interface IProductModel extends Document {
   _id?: string | object // type object for query search in controller
   name: string | object // type object for query search in controller
   photo: string
   category: 'food' | 'drink' | object
   price: number
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
      category: {
         type: String,
         enum: ['Food', 'Drink'],
         required: true,
      },
      price: {
         type: Number,
         required: true,
      },
   },
   {
      timestamps: true,
   }
)

const Products = mongoose.model<IProductModel>('Products', ProductSchema)

export default Products
