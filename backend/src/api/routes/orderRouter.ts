import { isAdmin, isAuth } from '../middleware/jwt'
import express from 'express'
import {
   createOrder,
   deleteOrder,
   getOrder,
   getOrders,
   orderMenu,
   orderDelivered,
} from '../controller/orderController'

const router = express.Router()

router.get('/:id', getOrder)
router.get('/', isAuth, isAdmin, getOrders)
router.post('/', isAuth, isAdmin, createOrder)
router.put(`/:id/order`, orderMenu)
router.put('/:id/delivered/:order_list_id', orderDelivered)
router.delete('/:id', isAuth, isAdmin, deleteOrder)

export default router
