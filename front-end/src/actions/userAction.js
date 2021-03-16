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
        } catch (err) {
            console.log(err)
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

export const resetRequest = async(userData,cb) => {
    try {
        const { data } = await Axios.post('http://localhost:2000/user/forgot', userData)
        cb(false,data)
    } catch (error) {
        const errorMessage = error?.response?.data || error
        console.log(errorMessage)
        cb(errorMessage)
    }
}


export const resetPassword = async(allData,cb) => {
    try {
        await Axios.patch('http://localhost:2000/user/reset', allData)
        cb(false)
    } catch (error) {
        const errorMessage = error?.response?.data || error
        console.log(errorMessage)
        cb(errorMessage)
    }
}