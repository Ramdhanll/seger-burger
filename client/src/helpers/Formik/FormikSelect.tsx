import React, { FC } from 'react'
import { Field } from 'formik'
import {
   FormControl,
   FormErrorMessage,
   FormLabel,
   Select,
} from '@chakra-ui/react'

interface IFormikSelect {
   label: string
   name: string
   options: {
      key: any
      name: string
      value: any
   }[]
   placeholder?: string
   required?: boolean
   disabled?: boolean
   color?: string
}

const FormikSelect: FC<IFormikSelect> = (props) => {
   const {
      label,
      name,
      options,
      placeholder,
      required,
      disabled = false,
      color = '',
      ...rest
   } = props
   return (
      <Field name={name} {...rest}>
         {({ field, form }: { field: any; form: any }) => (
            <FormControl
               isInvalid={form.errors[name] && form.touched[name]}
               isRequired={required}
            >
               <FormLabel {...rest}>{label}</FormLabel>
               <Select
                  {...field}
                  {...rest}
                  placeholder={placeholder}
                  disabled={disabled}
                  color={color}
               >
                  {options.map((option) => {
                     return (
                        <option key={option.key} value={option.value}>
                           {option.name}
                        </option>
                     )
                  })}
               </Select>
               <FormErrorMessage mt='10px' color='red'>
                  {form.errors[name]}
               </FormErrorMessage>
            </FormControl>
         )}
      </Field>
   )
}

export default FormikSelect
