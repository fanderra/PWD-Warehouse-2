import React, { useEffect } from 'react'
import { Route, Switch } from "react-router-dom"
import Navigation from './components/navigation'
import Register from './pages/register'
import { useDispatch } from 'react-redux'
// import Home from './pages/home'
import Verification from './pages/verification'

import { keepLogin } from './actions'
import Cart from './pages/cart'
import Login from './pages/login'
import ForgotPasswordPage from './pages/forgotPasswordPage'
import Product from './pages/product'
import Profile from './pages/profile'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    if (localStorage.token) {
      dispatch(keepLogin())
    }
  }, [])

  return (
    <>
      <Navigation />
      <Switch>
        <Route path='/register' component={Register} />
        {/* <Route path='/' component={Home} exact /> */}
        <Route path='/profile' component={Profile} />
        <Route path='/cart' component={Cart} />
        <Route path='/forgot' component={ForgotPasswordPage} />
        <Route path='/login' component={Login} />
        <Route path='/verification' component={Verification} exact />
        <Route path='/product' component={Product} exact />
      </Switch>
    </>
  )
}

export default App