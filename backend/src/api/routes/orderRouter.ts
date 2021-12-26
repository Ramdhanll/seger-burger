import { isAdmin, isAuth } from './../middleware/jwt'
import express from 'express'
import {
   createOrder,
   deleteOrder,
   getOrder,
   getOrders,
   order,
} from '../controller/orderController'

const router = express.Router()

router.get('/:id', getOrder)
router.get('/', isAuth, isAdmin, getOrders)
router.post('/', isAuth, isAdmin, createOrder)
router.put(`/:id/order`, order)
router.delete('/:id', isAuth, isAdmin, deleteOrder)

export default router
