import React, { useEffect } from 'react'
import { Route, Switch } from "react-router-dom"
import Navigation from './components/navigation'
import Register from './pages/register'
import { useDispatch, useSelector } from 'react-redux'
// import Home from './pages/home'
import Verification from './pages/verification'

import { keepLogin } from './actions'
import Cart from './pages/cart'
import Login from './pages/login'
import Checkout from './pages/checkout'
import ForgotPasswordPage from './pages/forgotPasswordPage'
import Product from './pages/product'
import Profile from './pages/profile'
import Payment from './pages/payment'
import NotFound from './pages/notFound'
import Admin from './pages/admin'
import History from './pages/history'


const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    if (localStorage.token || sessionStorage.token) {
      dispatch(keepLogin())
    }
  }, [dispatch])

  const { id_role:idRole } = useSelector((state) => state.user)
  if (idRole === 1) return (
    <>
      <Navigation />
      <Switch>
        <Route path='/' component={Product} exact />
        <Route path='/payment/:id_order' component={Payment} />
        <Route path='/profile' component={Profile} />
        <Route path='/cart' component={Cart} />
        <Route path='/checkout' component={Checkout} />
        <Route path='/verification' component={Verification} exact />
        <Route path='/history' component={History} />
        <Route path='*' component={NotFound} />
      </Switch>
    </>
  )

  if (idRole === 2) return (
    <>
      <Navigation />
      <Switch>
        <Route path='/' component={Product} exact />
        < Route path='/admin' component={Admin} />
        <Route path='*' component={NotFound} />
      </Switch>
    </>
  )

  return (
    <>
      <Navigation />
      <Switch>
        <Route path='/register' component={Register} />
        <Route path='/forgot/:token' component={ForgotPasswordPage} />
        <Route path='/login' component={Login} />
        <Route path='/' component={Product} exact />
        <Route path='*' component={NotFound} />
      </Switch>
    </>
  )
}

export default App