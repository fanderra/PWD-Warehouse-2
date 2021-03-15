import React from 'react'
import { useDispatch } from 'react-redux'

import Navigation from './components/navigation'

import { keepLogin } from './actions'

const App = () => {
  const dispatch = useDispatch()
  dispatch(keepLogin())
  
  return (
    <div>
      <Navigation />
    </div>
  )
}

export default App