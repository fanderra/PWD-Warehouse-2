import React from 'react'
import { Route, Switch } from "react-router-dom"
import { useDispatch } from 'react-redux'

import Navigation from './components/navigation'
import Home from './pages/home'


import { keepLogin } from './actions'

const App = () => {
  const dispatch = useDispatch()
  dispatch(keepLogin())
  
  return (
    <div>
      <Navigation />
      <Switch>
        <Route path='/' component={Home} exact />
      </Switch>
    </div>
  )
}

export default App