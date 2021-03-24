import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

export default function CanceledOrderModal({ show, handleSubmit, setShow }) {
    const [cancelMessage, setCancelMessage] = useState('')
    return (
        <Modal
            show={show}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header onClick={setShow} closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Cancel message
        </Modal.Title>
            </Modal.Header>
            <Modal.Body >
                <Form.Control style={{minHeight:'200px'}} as="textarea" value={cancelMessage} onChange={i => setCancelMessage(i.target.value)} placeholder='cancel message' />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => {
                    handleSubmit(cancelMessage)
                    setCancelMessage('')
                }} variant='danger'>Cancel order</Button>
            </Modal.Footer>
        </Modal>
    )
}
