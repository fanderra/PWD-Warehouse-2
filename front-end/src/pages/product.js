import React from 'react'
import Axios from 'axios'
import { Button, Modal, Form, Card, Carousel } from 'react-bootstrap'
// import { Link } from 'react-router-dom'

const Product = () => {
    const [data, setData] = React.useState([])
    const [modalDetails, setModalDetails] = React.useState(false)
    const [qty, setQty] = React.useState(1)
    const [details, setDetails] = React.useState({})
    const [welcome, setWelcome] = React.useState(true)
    
    React.useEffect(() => {
        Axios.post('http://localhost:2000/product/showAll')
        .then((res) => setData(res.data))
        .catch(err => console.log(err))
    }, [])
    
    return (
        <div>
            <div style={{ display: "flex", flexWrap: "wrap", padding: 20, justifyContent: "center" }}>
                {data.map((item, index) => {
                    return (
                        <Card key={index} style={{margin: 10, textAlign: "center"}}>
                            <Card.Img style={{width: 250}} src="https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/804/0780479_PE759996_S5.jpg"/>
                            <Card.Body>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text>IDR {Intl.NumberFormat('in-ID', { currency: 'IDR', style: 'decimal' }).format(item.price)}</Card.Text>
                                <Button onClick={() => { setModalDetails(true); setDetails({nama: item.name, harga: item.price, kategori: item.category}) }}>View Details</Button>
                            </Card.Body>
                        </Card>
                    )
                })}
            </div>
            <Modal show={modalDetails} onHide={() => setModalDetails(false)}>
                <Modal.Body>
                    <Carousel style={{margin: -16}}>
                        <Carousel.Item><img alt="1st slide" width={498} src="https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/804/0780479_PE759996_S5.jpg" /></Carousel.Item>
                        <Carousel.Item><img alt="2nd slide" width={498} src="https://d2rbyiw1vv51io.cloudfront.net/web/ikea4/images/163/0716387_PE730857_S5.jpg" /></Carousel.Item>
                    </Carousel>
                    <br/>
                    <div style={{textAlign: "center"}}>
                        <div>{details.nama}</div>
                        <div>Category: {details.kategori}</div>
                        <div>IDR {Intl.NumberFormat('in-ID', { currency: 'IDR', style: 'decimal' }).format(details.harga)}</div>
                    </div>
                    <br/>
                    <div style={{display: "flex", justifyContent: "space-around", alignItems: "center"}}>
                        <div>
                            <div style={{flexDirection: "row", display: "flex", marginLeft: 5}}>
                                <Button onClick={() => qty <= 1 ? alert('???') : setQty(qty - 1)}>-</Button>
                                <Form.Control style={{width: 45, textAlign: "center"}} onChange={event => setQty(parseInt(event.target.value))} value={qty} />
                                <Button onClick={() => qty >= details.total_stok ? alert('???') : setQty(qty + 1)}>+</Button>
                            </div>
                            <div>Available stock: {details.total_stok ? details.total_stok : "-"}</div>
                        </div>
                        <div style={{textAlign: "center"}}>TOTAL: IDR {Intl.NumberFormat('in-ID', { currency: 'IDR', style: 'decimal' }).format(details.harga * qty)}</div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {qty > details.total_stok ? alert('???') : alert('x' + qty + ' ' + details.nama + ' has been added to cart'); setQty(1); setModalDetails(false)}}>Add To Cart</Button>
                    <Button onClick={() => {setQty(1); setModalDetails(false)}}>Close</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={welcome} onHide={() => setWelcome(false)}>
                <Modal.Body>
                    <h1 style={{textAlign: "center"}}>Welcome to IKIYA</h1>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setWelcome(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Product