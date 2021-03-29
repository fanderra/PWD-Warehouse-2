import React from 'react'
import Axios from 'axios'
import { Table, Button, Modal, Dropdown, Form } from 'react-bootstrap'

const MasterStock = () => {
    const [productsData, setProductsData] = React.useState([])
    const [qty, setQty] = React.useState(0)
    const [stock, setStock] = React.useState({ warehouseA: 1, warehouseB: 1 })
    const [editWhich, setEditWhich] = React.useState([false, false])
    const [index, setIndex] = React.useState(0)
    const [showModal, setShowModal] = React.useState({ stock: false, error: false })
    const [modalBody, setModalBody] = React.useState('')

    React.useEffect(() => {
        Axios.post('http://localhost:2000/product/showAllProductsForAdmin')
            .then(res => setProductsData(res.data))
            .catch(err => console.log(err))
    }, [])

    const handleEditStock = (index) => {
        if (qty < 1) {
            setShowModal({ ...showModal, stock: false, error: true })
            setModalBody('Quantity cannot be zero or less')
            setQty(0)
            return
        } else if (editWhich[0]) {
            if (qty > stock.warehouseA) {
                setShowModal({ ...showModal, stock: false, error: true })
                setModalBody('Quantity exceeds maximum allowed')
                setQty(0)
                return
            } else {
                const stock1 = parseInt(stock.warehouseA) - parseInt(qty)
                const stock2 = parseInt(stock.warehouseB) + parseInt(qty)
                Axios.post(`http://localhost:2000/product/moveStock/${index}`, { id_product: qty, stock1, stock2 })
                    .then(res => {
                        setProductsData(res.data)
                        setShowModal({ ...showModal, stock: false })
                        setQty(0)
                    })
                    .catch(err => console.log(err.response.data))
            }
        } else if (editWhich[1]) {
            if (qty > stock.warehouseB) {
                setShowModal({ ...showModal, stock: false, error: true })
                setModalBody('Quantity exceeds maximum allowed')
                setQty(0)
                return
            } else {
                const stock1 = parseInt(stock.warehouseA) + parseInt(qty)
                const stock2 = parseInt(stock.warehouseB) - parseInt(qty)
                Axios.post(`http://localhost:2000/product/moveStock/${index}`, { id_product: qty, stock1, stock2 })
                    .then(res => {
                        setProductsData(res.data)
                        setShowModal({ ...showModal, stock: false })
                        setQty(0)
                    })
                    .catch(err => console.log(err.response.data))
            }
        }
    }

    return (
        <div style={{ padding: 20, marginTop: 35 }}>
            <Table striped bordered style={{ textAlign: "center" }}>
                <thead>
                    <tr>
                        <td rowSpan="3"><div style={{ marginTop: 49 }}><b>Category</b></div></td>
                        <td rowSpan="3"><div style={{ marginTop: 49 }}><b>Product</b></div></td>
                        <td colSpan="6"><b>Stock</b></td>
                    </tr>
                    <tr>
                        <td colSpan="2"><b>Warehouse JKT</b></td>
                        <td rowSpan="2"><div style={{ marginTop: 27 }}><b>Action</b></div></td>
                        <td colSpan="2"><b>Warehouse BDG</b></td>
                    </tr>
                    <tr>
                        <td style={{ width: 220 }}><b>Available</b></td>
                        <td style={{ width: 220 }}><b>Purchased</b></td>
                        <td style={{ width: 220 }}><b>Available</b></td>
                        <td style={{ width: 220 }}><b>Purchased</b></td>
                    </tr>
                </thead>
                <tbody>
                    {productsData.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td><div style={{ marginTop: 7 }}>{item.category}</div></td>
                                <td><div style={{ marginTop: 7 }}>{item.name}</div></td>
                                <td><div style={{ marginTop: 7 }}>{item.stocks[0]}</div></td>
                                <td><div style={{ marginTop: 7 }}>{item.purchased_stocks[0]}</div></td>
                                <td style={{ width: 200 }}>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="outline-info">Move Stock</Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item>
                                                {item.stocks[0] < 1 ?
                                                    <Button
                                                        variant="outline-info"
                                                        onClick={() => { setShowModal({ ...showModal, error: true }); setModalBody('Quantity in warehouse JKT is empty') }}
                                                    >From JKT to BDG
                                                </Button>
                                                    :
                                                    <Button
                                                        variant="outline-info"
                                                        onClick={() => {
                                                            setShowModal({ ...showModal, stock: true })
                                                            setStock({ ...stock, warehouseA: item.stocks[0], warehouseB: item.stocks[1] })
                                                            setIndex(item.id_product)
                                                            setEditWhich([true, false])
                                                        }}
                                                    >From JKT to BDG
                                                </Button>
                                                }
                                            </Dropdown.Item>
                                            <Dropdown.Item>
                                                {item.stocks[1] < 1 ?
                                                    <Button
                                                        variant="outline-info"
                                                        onClick={() => { setShowModal({ ...showModal, error: true }); setModalBody('Quantity in warehouse BDG is empty') }}
                                                    >From BDG to JKT
                                                </Button>
                                                    :
                                                    <Button
                                                        variant="outline-info"
                                                        onClick={() => {
                                                            setShowModal({ ...showModal, stock: true })
                                                            setStock({ ...stock, warehouseA: item.stocks[0], warehouseB: item.stocks[1] })
                                                            setIndex(item.id_product)
                                                            setEditWhich([false, true])
                                                        }}
                                                    >From BDG to JKT
                                                </Button>
                                                }
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                                <td><div style={{ marginTop: 7 }}>{item.stocks[1]}</div></td>
                                <td><div style={{ marginTop: 7 }}>{item.purchased_stocks[1]}</div></td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <Modal show={showModal.stock} onHide={() => setShowModal({ ...showModal, stock: false })} style={{ marginTop: 280 }}>
                <Modal.Header>How many item/s would you like to move?</Modal.Header>
                <Modal.Body>
                    <Table striped bordered style={{ textAlign: "center" }}>
                        <thead>
                            {editWhich[0] ?
                                <tr>
                                    <td><b>Warehouse JKT</b></td>
                                    <td><b>Move Stock</b></td>
                                    <td><b>Warehouse BDG</b></td>
                                </tr>
                                :
                                <tr>
                                    <td><b>Warehouse BDG</b></td>
                                    <td><b>Move Stock</b></td>
                                    <td><b>Warehouse JKT</b></td>
                                </tr>
                            }
                        </thead>
                        <tbody>
                            <tr>
                                {editWhich[0] ?
                                    <>
                                        <td><div style={{ marginTop: 7 }}>{parseInt(stock.warehouseA) - parseInt(qty)}</div></td>
                                        <td>
                                            <Form.Control type="number" value={qty} onChange={
                                                event => {
                                                    let value = +event.target.value
                                                    let maxStock = stock.warehouseA
                                                    setQty(parseInt(value > maxStock ? maxStock : value <= 0 ? 0 : value))
                                                }
                                            } style={{ width: 100 }} />
                                        </td>
                                        <td><div style={{ marginTop: 7 }}>{parseInt(stock.warehouseB) + parseInt(qty)}</div></td>
                                    </>
                                    :
                                    <>
                                        <td><div style={{ marginTop: 7 }}>{parseInt(stock.warehouseB) - parseInt(qty)}</div></td>
                                        <td>
                                            <Form.Control type="number" value={qty} onChange={
                                                event => {
                                                    let value = +event.target.value
                                                    let maxStock = stock.warehouseB
                                                    console.log(maxStock)
                                                    setQty(parseInt(value > maxStock ? maxStock : value <= 0 ? 0 : value))
                                                }
                                            } style={{ width: 100 }} />
                                        </td>
                                        <td><div style={{ marginTop: 7 }}>{parseInt(stock.warehouseA) + parseInt(qty)}</div></td>
                                    </>
                                }
                            </tr>
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-info" onClick={() => handleEditStock(index)}>Save</Button>
                    <Button variant="outline-info" onClick={() => { setShowModal({ ...showModal, stock: false }); setQty(0) }}>Cancel</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showModal.error} onHide={() => setShowModal({ ...showModal, error: false })} style={{ marginTop: 280 }}>
                <Button variant="transparent" onClick={() => setShowModal({ ...showModal, error: false })}>
                    <Modal.Body>
                        <div style={{ textAlign: "center" }}>{modalBody}</div>
                    </Modal.Body>
                </Button>
            </Modal>
        </div>
    )
}

export default MasterStock