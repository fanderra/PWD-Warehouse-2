import React from 'react'
import { Button, Modal, } from 'react-bootstrap'

export default function AlertModal({ setShow, message='', title='Success' }) {

    return (
        <Modal
            show={Boolean(message)}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header onClick={setShow} closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body >
                {message}
            </Modal.Body>
            <Modal.Footer>
                <Button variant='info' onClick={setShow}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}
