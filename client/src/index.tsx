import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './config/theme'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import config from './config/config'
import { SWRConfig } from 'swr'

axios.defaults.withCredentials = true
axios.defaults.baseURL = config.server.url

ReactDOM.render(
   <ChakraProvider theme={theme}>
      <BrowserRouter>
         <SWRConfig
            value={{
               revalidateOnFocus: true,
               fetcher: (url) => axios.get(url).then((res) => res.data),
            }}
         >
            <App />
         </SWRConfig>
      </BrowserRouter>
   </ChakraProvider>,
   document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
