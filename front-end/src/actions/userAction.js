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