import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:2000/order' })



export const checkoutCart = async (allData, action) => {
    try {
        const { data } = await api.post(`/checkout`, allData)
        action(data.id_order)
    } catch (error) {
        console.log(error.response?.data)
    }
}
export const getPayment = async (id_order, action) => {
    try {
        const { data } = await api.get(`/getPayment/` + id_order)
        action(data)
    } catch (error) {
        console.log(error.response?.data)
        action()
    }
}

export const confirmPayment = async (formData, action) => {
    try {
        const { data } = await api.post(`/confirmPayment`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        console.log(data)
    } catch (error) {
        console.log(error.response?.data)
    } finally {
        action()
    }
}

export const cancelOrder = async (alldata, action) => {
    try {

        const { data } = await api.post(`/cancelOrder`, alldata)
        console.log(data)
        action()
    } catch (error) {
        console.log(error.response?.data)
    }
}

export const completeOrder = async (id_order, action) => {
    try {
        await api.post('/complete/' + id_order)
        action()
    } catch (error) {
        console.log(error.response?.data || error)
    }
}

export const confirmOrder = async (id_order, action) => {
    try {
        await api.post('/confirmOrder/' + id_order)
        action()
    } catch (error) {
        console.log(error.response?.data || error)
    }
}