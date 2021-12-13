export interface IUser {
   _id: string
   name: string
   email: string
}

export const DEFAULT_USER: IUser = {
   _id: '',
   name: '',
   email: '',
}

export const DEFAULT_IS_LOGGED: boolean = false
