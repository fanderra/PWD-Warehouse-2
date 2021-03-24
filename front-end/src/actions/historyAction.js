import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:2000/history' })


export const getHistory = async ({ id_user, id_order_status }, action) => {
    try {
        const { data } = await api.get(`/get?id_user=${id_user}&id_order_status=${id_order_status}`)
        action(data)
    } catch (error) {
        console.log(error.response?.data||error)
    }
}