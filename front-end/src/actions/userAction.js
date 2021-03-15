import Axios from 'axios'

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