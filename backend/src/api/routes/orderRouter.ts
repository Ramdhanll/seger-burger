import { isAdmin, isAuth } from '../middleware/jwt'
import express from 'express'
import {
   createOrder,
   deleteOrder,
   getOrder,
   getOrders,
   orderMenu,
   orderDelivered,
   orderPayment,
   getReport,
} from '../controller/orderController'
import { body } from 'express-validator'

const router = express.Router()

router.get('/report', isAuth, isAdmin, getReport)
router.get('/:id', getOrder)
router.get('/', isAuth, isAdmin, getOrders)
router.post('/', isAuth, isAdmin, createOrder)
router.put(`/:id/order`, orderMenu)
router.put(
   `/:id/payment`,
   body('cash').notEmpty().withMessage('Cash is required'),
   isAuth,
   isAdmin,
   orderPayment
)
router.put('/:id/delivered/:order_list_id', orderDelivered)
router.delete('/:id', isAuth, isAdmin, deleteOrder)

export default router
