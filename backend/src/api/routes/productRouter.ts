import express from 'express'
import {
   createProduct,
   deleteProduct,
   getProducts,
   updateProduct,
} from '../controller/productController'
import { isAuth, isAdmin } from '../middleware/jwt'
import { body } from 'express-validator'

const router = express.Router()

import fs from 'fs'
import path from 'path'
const __dirname = path.resolve()

import multer from 'multer'

const storage = multer.diskStorage({
   destination(req: any, file: any, cb: (arg0: null, arg1: string) => void) {
      // Cek apakah folder downloadnya ada
      const downloadFolder = path.resolve(__dirname, './src/uploads/products')
      if (!fs.existsSync(downloadFolder)) {
         fs.mkdirSync(downloadFolder)
      }
      cb(null, `src/uploads/products`)
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

router.get('/', getProducts)

router.post('/', isAuth, isAdmin, uploadMulter.single('photo'), createProduct)
router.put('/:id', isAuth, isAdmin, uploadMulter.single('photo'), updateProduct)
router.delete('/:id', isAuth, isAdmin, deleteProduct)

export default router
