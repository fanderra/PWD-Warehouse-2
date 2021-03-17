import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:2000/cart' })

export const addToCart = async (data, action) => {
    try {
        await api.post(`/add`, data)
        action()
    } catch (error) {
        console.log(error.response?.data)
    }
}

export const editCart = async (editedData, action) => {
    try {
        await api.patch(`/edit`, editedData)
        action()
    } catch (error) {
        console.log(error.response?.data)
        action()
    }
}