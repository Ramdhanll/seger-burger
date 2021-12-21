import { Spinner, Td, Tr } from '@chakra-ui/react'
import React, { FC } from 'react'

interface ITableLoading {
   colSpan: number
}

const TableLoading: FC<ITableLoading> = ({ colSpan }) => {
   return (
      <Tr>
         <Td colSpan={colSpan} bg='yellow.300' color='text' textAlign='center'>
            <Spinner
               thickness='4px'
               speed='0.65s'
               emptyColor='gray.200'
               color='blue.500'
               size='md'
            />
         </Td>
      </Tr>
   )
}

export default TableLoading
