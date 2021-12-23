export default interface IOrder {
   _id?: string
   link: string
   orders: any
   total: number
   status: string
   createdAt: string
}

export const INITIAL_ORDER = {
   _id: '',
   link: '',
   orders: [],
   total: 0,
   status: '',
   createdAt: '',
}
