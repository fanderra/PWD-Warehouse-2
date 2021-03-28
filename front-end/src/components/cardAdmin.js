import React from 'react'
import {useDispatch} from 'react-redux' 
import { Card, Button, Modal, Form } from 'react-bootstrap'
import { confirmOrder, cancelOrder, completeOrder } from '../actions/orderAction'
import {keepLogin} from '../actions/userAction'

export default function CardAdmin({ item, showCancelMsg }) {
    const [msg, setMsg] = React.useState('')
    const [modal, setModal] = React.useState(false)

    const dispatch = useDispatch()

    const handleConfrim = () => {
        confirmOrder(item.id_order, console.log('success'))
        dispatch(keepLogin())
    }

    const handleCancel = () => {
        const message =  msg
        const id_order = item.id_order
        const allData = {id_order, message}
        cancelOrder(allData, console.log('handle cancel success'))
        setModal(false)
        dispatch(keepLogin())
    }

    const handleComplete = () => {
        completeOrder(item.id_order, data => console.log(data))
        dispatch(keepLogin())
    }

    console.log(msg)
    return (
        <>
            <Card style={{ width: '18rem', marginRight: 20, marginTop: 20 }}>
                <Card.Body>
                    <Card.Title>{item.status.toUpperCase()}</Card.Title>
                    <Card.Title></Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Payment Method: {item.payment_method}</Card.Subtitle>
                    <Card.Text>
                        <p style={{ marginTop: 10 }}>Name : {item.username} </p>
                        <p style={{ marginTop: -10 }}>Address : {item.address_detail + ", " + item.city + ' ' + item.postal_code}</p>
                        <p style={{ marginTop: -10 }}>Orders : {item.order_details.map((item, index) => {
                            return (
                                <div key={index}>
                                    <span>{index + 1}. {item.name + ' '}</span>
                                    <span>({item.qty + ''} unit/s) @{item.price.toLocaleString()}</span>
                                </div>
                            )
                        })}
                        </p>
                        <p style={{ marginTop: -10 }}> Shipment Fee : ${item.shipment_fee.toLocaleString()}</p>
                        <p> Total : ${item.total.toLocaleString()}</p>
                    </Card.Text>
                    {item.id_order_status === 3 &&
                        <div>
                            <Button variant="info" onClick={handleConfrim}>Deliver to Customer</Button>
                            <Button variant="info" onClick={() => setModal(true)}>Cancel Order</Button>
                        </div>
                    }
                    {item.id_order_status === 4 &&
                        <Button variant="info" onClick={handleComplete}> Arrived </Button>                        
                    }
                    {
                        item.id_order_status === 6 &&
                        <Button onClick={() => showCancelMsg(item.message)}>See message</Button>
                    }
                </Card.Body>
            </Card>

            <Modal show={modal} onHide={() => setModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Cancel order</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Messages for customers</Form.Label>
                    <Form.Control as="textarea" rows={3} value={msg} onChange={(e) => setMsg(e.target.value)}/>
                </Form.Group>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setModal(false)}>Close</Button>
                <Button variant="primary" onClick={handleCancel}>Send</Button>
            </Modal.Footer>
        </Modal>    
        </>   
    )
}