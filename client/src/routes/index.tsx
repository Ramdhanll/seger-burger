import SidebarWithHeader from '../components/Sidebar'
import IRoute from '../interfaces/IRoute'
import Dashboard from '../pages/Admin/Dashboard'
import Order from '../pages/Admin/Order'
import Product from '../pages/Admin/Product'
import Home from '../pages/Home'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import Register from '../pages/Register'

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
      ],
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
   ...adminRoutes,
   ...mainRoutes,
   ...notFoundRoutes,
]

export default routes
