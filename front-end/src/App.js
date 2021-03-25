import React, { useEffect } from 'react'
import { Route, Switch } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { keepLogin } from './actions'

import Navigation from './components/navigation'
import Register from './pages/register'
import Login from './pages/login'
import ForgotPasswordPage from './pages/forgotPasswordPage'
import Verification from './pages/verification'
import Profile from './pages/profile'
import Product from './pages/product'
import Cart from './pages/cart'
import Checkout from './pages/checkout'
import Payment from './pages/payment'
import History from './pages/history'
import NotFound from './pages/notFound'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    if (localStorage.token) {
      dispatch(keepLogin())
    }
  }, [])
  
  const { idRole, name } = useSelector((state) => {
    return {
      idRole: state.user.id_role,
      name: state.user.username,
    }
  })
  
  return (
    <>
      <Navigation />
      <Switch>
        <Route path='/' component={Product} exact />
        <Route path='/register' component={Register} />
        <Route path='/login' component={Login} />
        <Route path='/forgot' component={ForgotPasswordPage} />
        {name
          ?
          <>
            <Route path='/verification' component={Verification} />
            <Route path='/profile' component={Profile} />
            <Route path='/cart' component={Cart} />
            <Route path='/checkout' component={Checkout}  />
            <Route path='/payment/:id_order' component={Payment} />
            <Route path='/history' component={History} />
          </>
          :
          <></>
        }
        {idRole === 2 
          ?
          <>
          </>
          :
          <></>
        }
        <Route path='*' component={NotFound} />
      </Switch>
    </>
  )
}

export default App