import { Td, Tr } from '@chakra-ui/react'
import React, { FC } from 'react'

interface ITableDataNotFound {
   colSpan: number
   message: string
}

const TableDataNotFound: FC<ITableDataNotFound> = ({ colSpan, message }) => {
   return (
      <Tr>
         <Td colSpan={colSpan} bg='yellow.300' color='text' textAlign='center'>
            {message}
         </Td>
      </Tr>
   )
}

export default TableDataNotFound
