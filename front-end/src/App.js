import React from 'react'
import { Route, Switch } from "react-router-dom"

import Navigation from './components/navigation'
import Register from './pages/register'


const App = () => {
 
  return (
    <div>
      <Navigation />
      <Switch>
        <Route path='/register' component={Register} exact />
      </Switch>
    </div>
  )
}

export default App