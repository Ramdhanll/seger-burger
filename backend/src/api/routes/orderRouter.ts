import { isAdmin, isAuth } from './../middleware/jwt'
import express from 'express'
import { createOrder, getOrders } from '../controller/orderController'

const router = express.Router()

router.get('/', isAuth, isAdmin, getOrders)
router.post('/', isAuth, isAdmin, createOrder)

export default router
