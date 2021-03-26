import React from 'react'
import Axios from 'axios'
import { Card, Table } from 'react-bootstrap'

export default function AdminReport() {
    const [data, setdata] = React.useState([])
    const [table, setTable] = React.useState([])

    const display = data.map((item, index) => {
        return (
            <Card key={index} style={{ margin: 10, textAlign: "center", width: 300 }}>
                {/* <Card.Img style={{ width: 250 }} src={'http://localhost:2000/' + item.image} /> */}
                <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text style={{ fontSize: 19 }}>{item.category}</Card.Text>
                    <Card.Text> Total : {item.total}</Card.Text>
                    {/* <Card.Text>${Intl.NumberFormat('en-US', { currency: 'USD', style: 'decimal' }).format(item.price)}</Card.Text> */}
                    {/* <Button onClick={() => { setModalDetails(true); setQty(1); setIdProd(item.id_product); setDetails(item); setImg(item.images) }}>View Details</Button> */}
                </Card.Body>
            </Card>
        )
    })

    const tableData = table.map((item, index) => {
        return (
            <tr>
                <td>{index + 1}.</td>
                <td>{item.username}</td>
                <td>{new Date(item.date).toString().slice(0, 25)}</td>
                <td>{item.payment_method}</td>
                <td>{item.names.map((item, index) => {
                    return (
                        <div>
                            <span>{item}</span>
                        </div>
                    )
                })}
                </td>
            </tr>
        )
    })

    React.useEffect(async () => {
        try {
            const res = await Axios.post('http://localhost:2000/admin/showBestProduct')
            setdata(res.data)
            console.log(res.data)
            const res1 = await Axios.post('http://localhost:2000/admin/showSales')
            setTable(res1.data)
        }
        catch (err) {
            console.log(err)
        }
    }, [])

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ textAlign: 'center', fontSize: 40 }}> BEST SELLER </div>
            <div style={{ display: "flex", flexWrap: "wrap", padding: 20, justifyContent: "center" }}>
                {display}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                <div style={{ textAlign: 'center', fontSize: 40 }}>Sales List</div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Table striped bordered hover variant="dark" style={{ width: 900, textAlign: 'center' }}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Payment</th>
                                <th>Products</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
