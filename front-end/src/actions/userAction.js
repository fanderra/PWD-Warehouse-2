import Axios from 'axios'


export const register = (body) => {
    return async (dispatch) => {
        try{
            console.log(body)
            const res = await Axios.post('http://localhost:2000/user/register', body) // di dalam page sudah di bracket
            console.log(res.data)
            
            localStorage.token = res.data.token

            dispatch({type: 'LOGIN', payload: res.data})
        }
        catch(err) {
            console.log(err)
        }
    }
}