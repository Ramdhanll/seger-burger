import SidebarWithHeader from '../components/Sidebar'
import IRoute from '../interfaces/IRoute'
import Dashboard from '../pages/Admin/Dashboard'
import Order from '../pages/Admin/Order'
import Product from '../pages/Admin/Product'
import Home from '../pages/Home'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import Register from '../pages/Register'
import Customer from '../pages/Order'
import Category from '../pages/Admin/Category'
import IdOrderNotFound from '../pages/IdOrderNotFound'
import Purchase from '../pages/Order/Purchase'
import Report from '../pages/Admin/Report'

const authRoutes: IRoute[] = [
   {
      path: 'login',
      auth: false,
      element: <Login />,
   },
   {
      path: 'register',
      auth: false,
      element: <Register />,
   },
]

const adminRoutes: IRoute[] = [
   {
      path: 'admin',
      auth: true,
      element: <SidebarWithHeader />,
      nested: [
         {
            index: true,
            path: '',
            element: <Dashboard />,
            auth: true,
         },
         {
            path: 'order',
            element: <Order />,
            auth: true,
         },
         {
            path: 'product',
            element: <Product />,
            auth: true,
         },
         {
            path: 'category',
            element: <Category />,
            auth: true,
         },
         {
            path: 'report',
            element: <Report />,
            auth: true,
         },
      ],
   },
]

const orderRoutes: IRoute[] = [
   {
      path: '/order/:id',
      auth: false,
      element: <Customer />,
   },
   {
      path: '/order/:id/purchase',
      auth: false,
      element: <Purchase />,
   },
   {
      path: '/order/not-found',
      auth: false,
      element: <IdOrderNotFound />,
   },
]

const mainRoutes: IRoute[] = [
   {
      path: '/',
      auth: false,
      element: <Home />,
   },
]

const notFoundRoutes: IRoute[] = [
   {
      path: '*',
      auth: false,
      element: <NotFound />,
   },
]
const routes: IRoute[] = [
   ...authRoutes,
   ...mainRoutes,
   ...adminRoutes,
   ...orderRoutes,
   ...notFoundRoutes,
]

export default routes
