import Axios from 'axios'

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