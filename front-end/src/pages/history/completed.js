import React, { useEffect, useState } from 'react'
import { getHistory, } from '../../actions'
import { useSelector } from 'react-redux'
import HistoryAccordion from '../../components/historyAccordion'
export default function Completed() {
    const { id_user } = useSelector(state => state.user)
    const [completedProduct, setCompletedProduct] = useState([])
    useEffect(() => {
        if (id_user) {
            getHistory({ id_user, id_order_status: 5 }, data => setCompletedProduct(data))
        }
    }, [id_user])
    
    if (!completedProduct.length) return (
        <div style={{ display: 'grid', placeItems: 'center', height: '40vh' }}>
            <h2>Empty</h2>
        </div>
    )
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '40px' }}>
            {completedProduct.map((item, index) => <HistoryAccordion item={item} key={index} />)}
        </div>
    )
}
