import React, { useState, useEffect } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { Redirect, useHistory, useParams } from 'react-router'
import { resetPassword } from '../actions/userAction'
import { useSelector } from 'react-redux'
import AlertModal from '../components/alertModal'
export default function ForgotPasswordPage() {
    // const [show, setShow] = useState(true)
    const [newUserData, setNewUserData] = useState({ code: '', password: '', confirmPassword: '' })
    const [errorMessage, setErrorMessage] = useState('')
    const [redirect, setRedirect] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [visible, setVisible] = useState(false)
    const { username } = useSelector(state => state.user)
    const { token } = useParams()
    const history = useHistory()
    useEffect(() => {
        if (token.length < 10) history.replace('/')
    }, [token.length, history])

    const handleModal = () => {
        setAlertMessage('')
        if (redirect) history.replace('/login')
    }

    const handleSubmit = () => {
        if (!newUserData.password || !newUserData.code) return setErrorMessage('Input can not be empty')
        if (newUserData.password !== newUserData.confirmPassword) return setErrorMessage('password and confirm password do not match')
        resetPassword({ ...newUserData, token: token }, err => {
            if (err) return setErrorMessage(err)
            setRedirect(true)
            setAlertMessage('Reset password successful')
        })
    }

    const handleChange = ({ target: { value, name } }) => {
        setNewUserData(p => ({ ...p, [name]: value }))
        setErrorMessage('')
    }

    if (username) return <Redirect to='/' />

    return (
        <>
            <div style={{ display: 'grid', placeItems: 'center', height: 757, backgroundColor: "lightgrey" }}>
                <Form style={{backgroundColor: "white", padding: 40, borderRadius: 5}}>
                    <h3 style={{ marginBottom: '30px' }}>A verification code has <br/> been sent to your email</h3>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Verification Code</Form.Label>
                        <Form.Control value={newUserData.code} onChange={handleChange} name='code' type="text" placeholder="Enter 4 digit code" />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>New password</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                onChange={handleChange}
                                placeholder="Password"
                                name="password"
                                value={newUserData.password}
                                aria-describedby="basic-addon2"
                                type={visible ? "text" : "password"}
                            />
                            <InputGroup.Append>
                                <Button onClick={() => setVisible(p => !p)} variant="outline-secondary">
                                    {visible ?
                                        <i className='fa fa-eye-slash'></i> :
                                        <i className='fa fa-eye'></i>
                                    }
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group controlId="formBasicPasfsword">
                        <Form.Control
                            onChange={handleChange}
                            value={newUserData.confirmPassword}
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            aria-describedby="basic-addon2"
                            type={visible ? "text" : "password"}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Text style={{ color: 'red', maxWidth: '400px' }}>
                            {errorMessage}
                        </Form.Text>
                    </Form.Group>
                    <Button variant="info" onClick={handleSubmit} type="button">Submit</Button>
                </Form>
            </div>
            <AlertModal message={alertMessage} setShow={handleModal} />
            {/* <ResetPasswordModal action={handleUserData} show={show} /> */}
        </>
    )
}

