import React, { useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function ResetPasswordModal({ show, action, handleClose }) {
    const [userData, setUserData] = useState({ username: '', email: '' })
    const [errorMessage, setErrorMessage] = useState('')

    const handleChange = ({ target: { name, value } }) => {
        setUserData(p => ({ ...p, [name]: value }))
        setErrorMessage('')
    }

    const handleSubmit = () => {
        if (!userData.email || !userData.username) return setErrorMessage('Email and/or username cannot be empty')
        action(userData, msg=>setErrorMessage(msg))
    }

    return (
        <Modal
            show={show}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header onClick={handleClose} closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Forgot password
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control name='email' onChange={handleChange} type="email" placeholder="Enter your email" style={{ fontStyle: "italic" }} />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Username</Form.Label>
                        <Form.Control name='username' onChange={handleChange} type="text" placeholder="Enter your username" style={{ fontStyle: "italic" }} />
                    </Form.Group>
                    <Form.Text style={{ color: 'red',height:'15px' }} >
                        {errorMessage}
                    </Form.Text>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="info" onClick={handleSubmit}>Submit</Button>
            </Modal.Footer>
        </Modal>
    )
}
