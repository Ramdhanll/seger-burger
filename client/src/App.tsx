import React, { useEffect, useReducer, useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import AuthRoute from './components/AuthRoute'
import {
   initialUserState,
   UserContextProvider,
   userReducer,
} from './contexts/user'
import logging from './config/logging'
import { Box } from '@chakra-ui/react'
import AuthService from './services/auth'
import routes from './routes'

function App() {
   const [userState, userDispatch] = useReducer(userReducer, initialUserState)

   const [loading, setLoading] = useState<boolean>(true)

   // Used for Debugging
   const [authStage, setAuthStage] = useState<string>('Checking token ...')

   useEffect(() => {
      setTimeout(() => {
         checkTokenForCredentials()
      }, 1000)
   }, [])

   /**
    * Check to see if we have a token.
    * If we do, verify it with the backend,
    * If not, we are logged out initially
    */

   const checkTokenForCredentials = () => {
      setAuthStage('Checking credentials ...')

      return AuthService.Validate((error, user) => {
         if (error) {
            logging.error(error)
            setAuthStage(`User not valid, logging out ...`)
            userDispatch({ type: 'logout', payload: initialUserState })
            setTimeout(() => {
               setLoading(false)
            }, 1000)
         } else if (user) {
            setAuthStage(`User authenticated.`)
            userDispatch({ type: 'login', payload: { user, isLogged: true } })
            setTimeout(() => {
               setLoading(false)
            }, 1000)
         }
      })
   }

   if (loading) {
      return <Box>Loading... {authStage}</Box>
   }

   return (
      <Box className='App' h='100vh'>
         <UserContextProvider value={{ userState, userDispatch }}>
            <Routes>
               {routes.map((route, index) => {
                  if (route.auth) {
                     return (
                        <Route
                           index={false}
                           key={index}
                           path={route.path}
                           element={<AuthRoute>{route.element}</AuthRoute>}
                        >
                           {route.nested &&
                              route.nested.map((nested, i) => {
                                 return (
                                    <Route
                                       index={false}
                                       key={i}
                                       path={nested.path}
                                       element={nested.element}
                                    />
                                 )
                              })}
                        </Route>
                     )
                  }

                  return (
                     <Route
                        key={index}
                        path={route.path}
                        element={route.element}
                     />
                  )
               })}
            </Routes>
         </UserContextProvider>
      </Box>
   )
}

export default App
