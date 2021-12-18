import express from 'express'
import {
   createCategory,
   deleteCategory,
   getCategories,
   updateCategory,
} from '../controller/categoryController'
import { isAuth, isAdmin } from '../middleware/jwt'

const router = express.Router()

import fs from 'fs'
import path from 'path'
const __dirname = path.resolve()

import multer from 'multer'

const storage = multer.diskStorage({
   destination(req: any, file: any, cb: (arg0: null, arg1: string) => void) {
      // Cek apakah folder downloadnya ada
      const downloadFolder = path.resolve(__dirname, './src/uploads/categories')
      if (!fs.existsSync(downloadFolder)) {
         fs.mkdirSync(downloadFolder)
      }
      cb(null, `src/uploads/categories`)
   },
   filename(
      req: any,
      file: { originalname: any },
      cb: (arg0: null, arg1: string) => void
   ) {
      const { originalname } = file
      const format = originalname.slice(originalname.indexOf('.'))
      cb(null, `${Date.now()}${format}`)
   },
})

const uploadMulter = multer({ storage })

router.get('/', getCategories)

router.post('/', isAuth, isAdmin, uploadMulter.single('logo'), createCategory)
router.put('/:id', isAuth, isAdmin, uploadMulter.single('logo'), updateCategory)
router.delete('/:id', isAuth, isAdmin, deleteCategory)

export default router
