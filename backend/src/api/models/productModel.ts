import mongoose, { Schema, Document } from 'mongoose'
const { ObjectId } = mongoose.Types

interface IProductModel extends Document {
   _id?: string | object // type object for query search in controller
   name: string | object // type object for query search in controller
   photo: string
   category: object
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
         type: ObjectId,
         ref: 'Categories',
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
ProductSchema.index({ name: 1 })

const Products = mongoose.model<IProductModel>('Products', ProductSchema)

export default Products
