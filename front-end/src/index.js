import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'

import { BrowserRouter } from 'react-router-dom'
import allReducers from './reducers'
import { Provider } from 'react-redux'

import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'

let globalState = createStore(allReducers, applyMiddleware(ReduxThunk))
globalState.subscribe(() => console.log('Global State : ', globalState.getState()))

ReactDOM.render(
  <Provider store={globalState}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  , document.getElementById('root')
)