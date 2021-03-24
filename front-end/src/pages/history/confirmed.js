import React, { useEffect, useState } from 'react'
import { getHistory } from '../../actions'
import { useSelector } from 'react-redux'
import HistoryAccordion from '../../components/historyAccordion'
import HistoryModal from '../../components/historyModal'
export default function Confirmed() {
    const { id_user } = useSelector(state => state.user)
    const [confirmedProduct, setConfirmedProduct] = useState([])
    const [paymentImage,setPaymentImage]=useState('')
    useEffect(() => {
        if (id_user) {
            getHistory({ id_user, id_order_status: 3 }, data => setConfirmedProduct(data))
        }
    }, [id_user])

    if (!confirmedProduct.length) return (
        <div style={{ display: 'grid', placeItems: 'center', height: '40vh' }}>
            <h2>Empty</h2>
        </div>
    )

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '40px' }}>
            {confirmedProduct.map((item, index) => <HistoryAccordion showModal={setPaymentImage} item={item} key={index} />)}
            <HistoryModal show={Boolean(paymentImage)} title='Payment approvals' payment_image={paymentImage} handleClose={() => setPaymentImage('')} />
        </div>
    )
}
