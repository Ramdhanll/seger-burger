import { AnyRecord } from 'dns'
export default interface IRoute {
   path?: any
   auth: boolean
   element: any
   index?: boolean
   nested?: {
      path?: any
      auth: boolean
      element: any
      index?: boolean
   }[]
}
