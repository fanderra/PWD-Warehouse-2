import Axios from 'axios'

export const login = (data, action) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post('http://localhost:2000/user/login', data)
            localStorage.token = res.data.token
            dispatch({ type: 'LOGIN', payload: res.data })
        }
        catch (err) {
            console.log(err.response.data)
            action(err.response.data)
        }
    }
}

export const register = (body) => {
    return async (dispatch) => {
        try{
            console.log(body)
            const res = await Axios.post('http://localhost:2000/user/register', body) // di dalam page sudah di bracket
            console.log(res.data)
            
            localStorage.token = res.data.token

            dispatch({type: 'LOGIN', payload: res.data})
        }
    }
}

export const keepLogin = () => {
    return async (dispatch) => {
        try {
            const token = localStorage.getItem('token')
            const res = await Axios.post('http://localhost:2000/user/keepLogin', { token })
            dispatch({ type: 'LOGIN', payload: res.data })
        }
        catch (err) {
            console.log(err)
            localStorage.removeItem('token')
            dispatch({ type: 'LOGOUT' })
        }
    }
}

export const logout = () => {
    return async (dispatch) => {
        try {
            localStorage.removeItem('token')
            dispatch({ type: 'LOGOUT' })
        }
        catch (err) {
            console.log(err)
        }
    }
}