import React from 'react'
import { Button, Modal, } from 'react-bootstrap'

export default function ConfirmationModal({ show, handleSubmit, setShow,message, title }) {

    return (
        <Modal
            show={show}
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
                <Button variant='info' onClick={handleSubmit}>Submit</Button>
                <Button variant='danger' onClick={setShow}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )
}
