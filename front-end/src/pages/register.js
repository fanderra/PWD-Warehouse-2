import React from 'react'
import Axios from 'axios'
import {useDispatch} from 'react-redux'
import { Form, Button, InputGroup } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import {register} from '../actions'

const Register = () => {
    const [username, setUsername] = React.useState('username')
    const [email, setEmail] = React.useState('email')
    const [password, setPassword] = React.useState('pass')
    const [visible, setVisible] = React.useState(true)
    const [toHome, setToHome] = React.useState(false)
    const [userValidErr, setUserValidErr] = React.useState([false, ''])
    const [emailValidErr, setEmailValidErr] = React.useState([false, ''])
    const [passValidErr, setPassValidErr] = React.useState([false, ''])
    
    const dispatch = useDispatch()

    const handleReg = () => {
        console.log(username, email, password)
        const body = {username, email, password}
        dispatch(register(body))
        setToHome(true)
    }

    const userValid = (e) => {
        let username = e.target.value
        // console.log(username)
        let symb = /[!@#$%^&*;]/

        if (symb.test(username) || username.length < 6) return setUserValidErr([true, "*Can\'t include symbol and min 6 char"])

        setUserValidErr({ userValidErr: [false, ""] })
        setUsername(username)
    }

    const emailValid = (e) => {
        let email = e.target.value
        // console.log(email)
        let regex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!regex.test(email)) return setEmailValidErr([true, "*Email not valid"])

        setEmailValidErr([false, ""])
        setEmail(email)
    }

    const passValid = (e) => {
        // char min 6
        // ada symbol
        // ada angka
        let pass = e.target.value
        // console.log(pass)
        let symb = /[!@#$%^&*:]/
        let numb = /[0-9]/
        // let upper = /[A-Z]/

        if (!symb.test(pass) || !numb.test(pass) || pass.length < 6) return setPassValidErr([true, "*Must include symbol, number, min 6 char"])

        setPassValidErr([false, ""])
        setPassword(pass)
    }

    if (toHome) return <Redirect to="/" />
    return (
        <div style={{ textAlign: "right" }}>
            <Form style={{ width: "300px", marginLeft: "750px", position: "fixed" }}>
                <h1>Register</h1>
                <Form.Control onChange={event => userValid(event)} placeholder="Enter username" />
                <Form.Text className="mb-3" style={{ textAlign: "left", color: "red", fontSize: '10px' }}> {userValidErr[1]} </Form.Text>
                <Form.Control onChange={event => emailValid(event)} placeholder="Enter email" />
                <Form.Text className="mb-3" style={{ textAlign: "left", color: "red", fontSize: '10px' }}> {emailValidErr[1]} </Form.Text>
                <InputGroup>
                    <Form.Control onChange={event => passValid(event)} placeholder="Enter password" type={visible ? "password" : "text"} />
                    <InputGroup.Text onClick={() => setVisible(!visible)}>{visible ? "HIDE" : "SHOW"}</InputGroup.Text>
                </InputGroup>
                <Form.Text className="mb-3" style={{ textAlign: "left", color: "red", fontSize: '10px' }}> {passValidErr[1]} </Form.Text>
                <Button onClick={handleReg}>Submit</Button>
            </Form>
        </div>
    )
}

export default Register