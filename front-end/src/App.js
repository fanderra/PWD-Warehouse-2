import React from 'react'
import { Route, Switch } from "react-router-dom"
import Navigation from './components/navigation'
import Register from './pages/register'
import { useDispatch } from 'react-redux'
import Home from './pages/home'

import { keepLogin } from './actions'

const App = () => {
  const dispatch = useDispatch()
  dispatch(keepLogin())
  
  return (
    <div>
      <Navigation />
      <Switch>
        <Route path='/register' component={Register} exact />
        <Route path='/' component={Home} exact />
      </Switch>
    </div>
  )
}

export default App