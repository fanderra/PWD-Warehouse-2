import React from 'react'
import { Modal, } from 'react-bootstrap'

export default function HistoryModal({ show, payment_image , handleClose,message,title }) {

    return (
        <Modal
            show={show}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header onClick={handleClose} closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {title}
        </Modal.Title>
            </Modal.Header>
            <Modal.Body >
                {payment_image && <img style={{ height: '400px', objectFit: 'contain', width: '100%' }} src={"http://localhost:2000/" + payment_image} alt="payment" />}
                {message && <p>{ message }</p>}
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
        </Modal>
    )
}
