import React, { useEffect, useState } from 'react'
import { getHistory } from '../../actions'
import { useSelector } from 'react-redux'
import HistoryAccordion from '../../components/historyAccordion'
import HistoryModal from '../../components/historyModal'
export default function Canceled() {
    const { id_user } = useSelector(state => state.user)
    const [canceledProduct, setCanceledProduct] = useState([])
    const [show, setShow] = useState(false)
    const [message, setMessage] = useState('')
    useEffect(() => {
        if (id_user) {
            getHistory({ id_user, id_order_status: 6 }, data => setCanceledProduct(data))
        }
    }, [id_user])

    if (!canceledProduct.length) return (
        <div style={{ display: 'grid', placeItems: 'center', height: '40vh' }}>
            <h2>Empty</h2>
        </div>
    )

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '40px' }}>
            {canceledProduct.map(
                (item, index) =>
                    <HistoryAccordion
                        showModal={() => {
                            setMessage(item.message)
                            setShow(true)
                        }}
                        item={item}
                        key={index}
                    />
            )}
            <HistoryModal show={show} handleClose={()=>setShow(false)} title='Cancel Message' message={message}/>
        </div>
    )
}
