import mongoose, { Schema, Document } from 'mongoose'

interface ICategoryModel extends Document {
   _id?: string | object // type object for query search in controller
   name: string | object // type object for query search in controller
   logo: string
}

const CategorySchema = new Schema<ICategoryModel>({
   name: {
      type: String,
      required: true,
   },
   logo: {
      type: String,
      required: true,
   },
})
CategorySchema.index({ name: 1 })

const Categories = mongoose.model<ICategoryModel>('Categories', CategorySchema)

export default Categories
