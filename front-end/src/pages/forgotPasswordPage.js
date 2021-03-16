import React, { useState, useEffect } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Redirect } from 'react-router'
import { resetRequest, resetPassword } from '../actions/userAction'
import ResetPasswordModal from '../components/resetPasswordModal'
import {useSelector} from'react-redux'
export default function ForgotPasswordPage() {
    const [show, setShow] = useState(true)
    const [newUserData, setNewUserData] = useState({ code: '', password: '', confirmPassword: '' })
    const [userToken, setUserToken] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [redirect, setRedirect] = useState(false)
    const { username }=useSelector(state=>state.user)
    useEffect(() => {
        let token = window.location.search.slice(1)
        console.log(token)
        if (token&&!userToken) {
            setUserToken(token)
            setShow(false)
        } else if (!userToken) {
            setShow(true)
        }
    }, [userToken])

    const handleUserData = (data, cb) => {
        resetRequest(data, (err, res) => {
            if (err) return cb(err)
            setUserToken(res)
            setShow(false)
        })
    }

    const handleSubmit = () => {
        if (!newUserData.password || !newUserData.code) return setErrorMessage('Input can not be empty')
        if (newUserData.password !== newUserData.confirmPassword) return setErrorMessage('password and confirm password do not match')
        resetPassword({ ...newUserData, token: userToken }, err => {
            if (err) return setErrorMessage(err)
            setRedirect(true)
        })
    }

    const handleChange = ({ target: { value, name } }) => {
        setNewUserData(p => ({ ...p, [name]: value }))
        setErrorMessage('')
    }

    if (redirect||username) return <Redirect to='login' />

    return (
        <>
            <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
                {show ||
                    <Form>
                        <h3 style={{ marginBottom: '30px' }}>We all ready send a <br /> verification code to your email</h3>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Verification Code</Form.Label>
                            <Form.Control value={newUserData.code} onChange={handleChange} name='code' type="text" placeholder="Enter 4 digit code" />
                        </Form.Group>
                        <Form.Group controlId="formBa4sicPassword">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control value={newUserData.password} onChange={handleChange} name='password' type="password" placeholder="Password" />
                        </Form.Group>
                        <Form.Group controlId="form4BasicPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control value={newUserData.confirmPassword} onChange={handleChange} name='confirmPassword' type="password" placeholder="Confirm Password" />
                        </Form.Group>

                        <Form.Group>
                            <Form.Text style={{ color: 'red' }}>
                                {errorMessage}
                            </Form.Text>
                        </Form.Group>
                        <Button variant="primary" onClick={handleSubmit} type="button">Submit</Button>
                    </Form>
                }
            </div>
            <ResetPasswordModal action={handleUserData} show={show} />
            </>
    )
}

