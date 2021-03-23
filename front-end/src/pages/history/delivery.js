import React, { useEffect, useState } from 'react'
import { getHistory,completeOrder } from '../../actions'
import { useSelector } from 'react-redux'
import HistoryAccordion from '../../components/historyAccordion'
import ConfirmationModal from '../../components/confirmationModal'

export default function Delivery() {
    const { id_user } = useSelector(state => state.user)
    const [deliveryProduct, setDeliveryProduct] = useState([])
    const [arrivedProduct, setArrivedProduct] = useState(null)
    const [refresh, setRefresh] = useState(false)
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (id_user) {
            getHistory({ id_user, id_order_status: 4 }, data => setDeliveryProduct(data))
        }
    }, [id_user, refresh])
    
    const handleSubmit = () => {
        // alert(arrivedProduct)
        setShow(false)
        completeOrder(arrivedProduct, () => setRefresh(p => !p))
    }

    if (!deliveryProduct.length) return (
        <div style={{ display: 'grid', placeItems: 'center', height: '40vh' }}>
            <h2>Empty</h2>
        </div>
    )

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '40px' }}>
            {deliveryProduct.map((item, index) =>
                <HistoryAccordion
                    item={item}
                    key={index}
                    showModal={() => {
                        setArrivedProduct(item.id_order)
                        setShow(true)
                    }}
                />)}

            <ConfirmationModal
                title='Confirmation'
                message={
                    <>
                        Are you sure you want to complete your order?<br /> Order Number : <b>{arrivedProduct}</b><br /><br />
                        <small>By completing your order,it means that your order has arrived safely</small>
                    </>
                }
                show={show}
                setShow={() => setShow(false)}
                handleSubmit={handleSubmit}
            />

        </div>
    )
}
