import express from 'express'
import config from './config/config'
import logging from './config/logging'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import {
   authRouter,
   userRouter,
   productRouter,
   categoryRouter,
   orderRouter,
} from './api/routes'
import dotenv from 'dotenv'
import createServer from './api/helpers/server'
dotenv.config()

const app = createServer()

// Connect to Mongo
mongoose
   .connect(config.mongo.url, config.mongo.options)
   .then(() => {
      logging.info('Mongo connected.')
   })
   .catch((e) => {
      logging.error(e)
   })

// logging middleware
app.use((req, res, next) => {
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

// Listen for request

app.listen(config.server.port, () => {
   logging.info(`Server is running at ${config.server.port} ...`)
})
