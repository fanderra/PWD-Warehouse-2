import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, InputGroup,Modal } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'
import { register } from '../actions'

const Register = () => {
    const [username, setUsername] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [visible, setVisible] = React.useState(false)
    const [modalAlert, setModalAlert] = React.useState([false, ''])
    const [userValidErr, setUserValidErr] = React.useState([false, ''])
    const [emailValidErr, setEmailValidErr] = React.useState([false, ''])
    const [passValidErr, setPassValidErr] = React.useState([false, ''])

    const dispatch = useDispatch()
    const handleReg = () => {
        let usernameSymbol = /[!@#$%^&*;]/
        let emailRegex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        let passSymbol = /[!@#$%^&*:]/
        let passNymber = /[0-9]/

        if (usernameSymbol.test(username)) return setUserValidErr([true, "*Username cannot include a symbol"])
        if (username.length < 6) return setUserValidErr([true, "*Username must have at least 6 characters"])
        if (!emailRegex.test(email)) return setEmailValidErr([true, "*Email is invalid"])
        if (!passSymbol.test(password) || !passNymber.test(password)) return setPassValidErr([true, "*Password must include a combination of symbol & number"])
        if (password.length < 6) return setPassValidErr([true, "*Password must have at least 6 characters"])

        const body = { username, email, password }
        dispatch(register(body, err => setModalAlert([true, err])))
    }

    const { name } = useSelector((state) => {
        return {
            name: state.user.username
        }
    })

    if (name) return <Redirect to="/" />
    return (
        <div style={{ textAlign: "center", display: "flex", justifyContent: "center", backgroundColor: "lightgrey", height: 757 }}>
            <div style={{ width: "450px", padding: 20, borderRadius: 10, marginTop: 150, backgroundColor: "white", height: 400 }}>
                <br />
                <h1>Register</h1>
                <Form style={{ marginTop: 25, marginBottom: -4 }}>
                    <Form.Control onChange={event => { setUsername(event.target.value); setUserValidErr({ userValidErr: [false, ""] }) }} placeholder="Enter username" style={{ fontStyle: "italic" }} />
                    <Form.Text style={{ textAlign: "left", color: "red", fontSize: '10px' }}> {userValidErr[1]} </Form.Text>
                    <Form.Control onChange={event => { setEmail(event.target.value); setEmailValidErr({ emailValidErr: [false, ""] }) }} placeholder="Enter email" style={{ fontStyle: "italic", marginTop: 10 }} />
                    <Form.Text style={{ textAlign: "left", color: "red", fontSize: '10px' }}> {emailValidErr[1]} </Form.Text>
                    <InputGroup style={{ marginTop: 10 }}>
                        <Form.Control onChange={event => { setPassword(event.target.value); setPassValidErr({ emailValidErr: [false, ""] }) }} placeholder="Enter password" style={{ fontStyle: "italic" }} type={visible ? "text" : "password"} />
                        <InputGroup.Text style={{ cursor: 'pointer' }} onClick={() => setVisible(!visible)}>{visible ? "HIDE" : "SHOW"}</InputGroup.Text>
                    </InputGroup>
                    <Form.Text style={{ textAlign: "left", color: "red", fontSize: '10px' }}> {passValidErr[1]} </Form.Text>
                </Form>
                <br />
                <Button variant="info" onClick={handleReg} style={{ width: 406 }}>Register</Button>
                <br /><br />
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ fontSize: 15, marginRight: 5, marginTop: 7 }}>Already have an account?</div>
                    <Button variant="transparent" style={{ color: "#358597", fontSize: 15, marginLeft: -10 }} as={Link} to="/login">Log In</Button>
                </div>
                <Modal show={modalAlert[0]} onHide={() => setModalAlert([false, ""])} style={{ marginTop: 280 }}>
                    <Button variant="transparent" onClick={() => setModalAlert([false, ""])}>
                        <Modal.Body>{modalAlert[1]}</Modal.Body>
                    </Button>
                </Modal>
            </div>
        </div>
    )
}

export default Register