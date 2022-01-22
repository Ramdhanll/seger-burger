import express, { NextFunction } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import swaggerUI from 'swagger-ui-express'
import logging from '../../config/logging'
import {
   authRouter,
   categoryRouter,
   orderRouter,
   productRouter,
   userRouter,
} from '../routes'
import path from 'path'
const __dirname = path.resolve()
import apiDocs from '../../apiDocs.json'

const createServer = () => {
   const app = express()

   // Middleware
   app.use(
      cors({
         credentials: true,
         // origin: ['*', 'http://localhost:3000', 'http://localhost'],
         origin: 'http://localhost:3000',
      })
   )

   app.use(
      '/uploads',
      express.static(path.join(__dirname, '/src/uploads/products'))
   )

   app.use(
      '/uploads',
      express.static(path.join(__dirname, '/src/uploads/categories'))
   )
   app.use(cookieParser())
   app.use(express.json())
   app.use(express.urlencoded({ extended: true }))

   // logging middleware
   app.use((req: any, res: any, next: NextFunction) => {
      logging.info(
         `METHOD: '${req.method}' URL: '${req.url}' - IP: '${req.socket.remoteAddress}'`
      )

      res.on('finish', () => {
         logging.info(
            `METHOD: '${req.method}' URL: '${req.url}' - IP: '${req.socket.remoteAddress}' - STATUS: '${req.statusCode}' `
         )
      })

      next()
   })

   // Routes
   app.use('/api/auth', authRouter)
   app.use('/api/users', userRouter)
   app.use('/api/products', productRouter)
   app.use('/api/categories', categoryRouter)
   app.use('/api/orders', orderRouter)
   app.use('/', swaggerUI.serve, swaggerUI.setup(apiDocs))

   // Error Handling
   app.use((req: any, res: any, next: NextFunction) => {
      const error = new Error('not found')

      return res.status(404).json({
         message: error.message,
      })
   })

   return app
}

export default createServer
