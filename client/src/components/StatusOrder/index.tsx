import { Badge } from '@chakra-ui/react'
import React, { FC } from 'react'

interface IStatusOrder {
   status: string
}

const StatusOrder: FC<IStatusOrder> = ({ status }) => {
   const handleColorScheme = (status: string) => {
      switch (status) {
         case 'WAITING':
            return 'yellow'
         case 'COOKED':
            return 'teal'
         case 'DELIVERED':
            return 'blue'
         case 'COMPLETED':
            return 'green'
         default:
            return 'yellow'
      }
   }

   return (
      <Badge variant='solid' colorScheme={handleColorScheme(status)}>
         {status}
      </Badge>
   )
}

export default StatusOrder
