import React, { useEffect, useState } from 'react'
import { getHistory, } from '../../actions'
import { useSelector } from 'react-redux'
import HistoryAccordion from '../../components/historyAccordion'
import PaginationComp from '../../components/pagination'
const perPage = 5

export default function Completed() {
    const { id_user } = useSelector(state => state.user)
    const [completedProduct, setCompletedProduct] = useState([])
    const [page, setPage] = useState(0)
    const [orderBy, setOrderBy]=useState('latest')
    useEffect(() => {
        if (id_user) {
            getHistory({ id_user, id_order_status: 5, page, perPage, orderBy }, data => setCompletedProduct(data))
        }
    }, [id_user, page, orderBy ])

    if (!completedProduct.length) return (
        <div style={{ display: 'grid', placeItems: 'center', height: '40vh' }}>
            <h2>Empty</h2>
        </div>
    )
    return (
        <PaginationComp page={page} perPage={perPage} setPage={setPage} length={completedProduct.length} setOrderBy={setOrderBy} orderBy={orderBy} >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '0 40px 40px 40px' }}>
                {completedProduct.map((item, index) => <HistoryAccordion item={item} key={index} />)}
            </div>
        </PaginationComp>
    )
}
