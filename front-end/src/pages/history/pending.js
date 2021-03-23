import React, { useEffect, useState } from 'react'
import { getHistory, cancelOrder } from '../../actions'
import { useSelector } from 'react-redux'
import HistoryAccordion from '../../components/historyAccordion'
import CanceledOrderModal from '../../components/canceledOrderModal'
export default function Pending() {
    const { id_user } = useSelector(state => state.user)
    const [pendingProduct, setPendingProduct] = useState([])
    const [canceledIdOrder, setCanceledIdOrder] = useState(null)
    const [show,setShow]=useState(false)
    useEffect(() => {
        if (id_user) {
            getHistory({ id_user, id_order_status: 2 }, data => setPendingProduct(data))
        }
    }, [id_user,show])
    if (!pendingProduct.length) return (
        <div style={{ display: 'grid', placeItems: 'center', height: '40vh' }}>
            <h2>Empty</h2>
        </div>
    )

    const handleSubmit = message => {
        const allData = { message, id_order: canceledIdOrder }
        cancelOrder(allData, _ => {
            setShow(false)
            setCanceledIdOrder(null)
        })
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '40px' }}>
            {pendingProduct.map(
                (item, index) =>
                    <HistoryAccordion
                        handleCancel={id_order => {
                            setCanceledIdOrder(id_order)
                            setShow(true)
                        }}
                        item={item}
                        key={index}
                    />
            )}
            <CanceledOrderModal show={show} setShow={() => setShow(false)} handleSubmit={handleSubmit} />
        </div>
    )
}
