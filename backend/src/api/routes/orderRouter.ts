import { isAdmin, isAuth } from './../middleware/jwt'
import express from 'express'
import {
   createOrder,
   deleteOrder,
   getOrders,
} from '../controller/orderController'

const router = express.Router()

router.get('/', isAuth, isAdmin, getOrders)
router.post('/', isAuth, isAdmin, createOrder)
router.delete('/:id', isAuth, isAdmin, deleteOrder)

export default router
