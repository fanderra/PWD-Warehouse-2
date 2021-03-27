import Axios from 'axios';
import React from 'react'
import {Card, Pagination} from 'react-bootstrap'

export default function AdminDashboard() {
    const [data, setData] = React.useState([])
    const [currentPage, setCurrentPage] = React.useState(0)

    const display = data.slice(currentPage * 10, currentPage * 10 + 10)
        .map((item, index) => {
            return (
                <Card key={index} style={{ margin: 10, textAlign: "center" }}>
                    <Card.Img style={{ width: 250 }} src={'http://localhost:2000/' + item.image} />
                    <Card.Body>
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Text style={{ fontSize: 19 }}>{item.category}</Card.Text>
                        <Card.Text>
                            <p>{item.storages.map((item, index) => {
                                return (
                                    <div style={{border: 'solid 2px black', marginTop: 10}}>
                                        <p style={{marginTop: 12}}>Storage: {item.name} </p>
                                        <p style={{marginTop: -15}}>Stock: {item.stock} </p>
                                        <p style={{marginTop: -15}}>Purchased_stock: {item.purchased_stock} </p>
                                    </div>
                                )
                            })}</p> 
                        </Card.Text>
                        <Card.Text>${Intl.NumberFormat('en-US', { currency: 'USD', style: 'decimal' }).format(item.price)}</Card.Text>
                        {/* <Button onClick={() => { setModalDetails(true); setQty(1); setIdProd(item.id_product); setDetails(item); setImg(item.images) }}>View Details</Button> */}
                    </Card.Body>
                </Card>
            )
        })
    
    React.useEffect(() => {
        Axios.post('http://localhost:2000/admin/showInfo')
        .then(res => setData(res.data))
        .catch(err => console.log(err))
    }, [])
    console.log(data)

    return (
        <div>
            <div style={{ display: "flex", flexWrap: "wrap", padding: 20, justifyContent: "center" }}>
                {display}
            </div>
            <Pagination style={{ marginLeft: 1325 }}>
                <Pagination.Prev onClick={() => currentPage <= 0 ? setCurrentPage(0) : setCurrentPage(currentPage - 1)} />
                <Pagination.Next onClick={() => currentPage >= 1 ? setCurrentPage(1) : setCurrentPage(currentPage + 1)} />
            </Pagination>
        </div>
    )
}
