import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Modal, InputGroup } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'
import { login } from '../actions'

const Login = () => {
    const [loginDetails, setLoginDetails] = React.useState({ username: '', email: '', password: '' })
    const [passVis, setPassVis] = React.useState(false)
    const [modalAlert, setModalAlert] = React.useState([false, ''])
    
    const dispatch = useDispatch()
    const handleLog = () => {
        if (!loginDetails.username && !loginDetails.password) return setModalAlert([true, 'Enter username/email & password'])
        if (!loginDetails.username || !loginDetails.email) return setModalAlert([true, 'Enter username or email'])
        if (!loginDetails.password) return setModalAlert([true, 'Enter password'])
        
        const user = { username: loginDetails.username, email: loginDetails.email, password: loginDetails.password }
        dispatch(login(user, err => setModalAlert([true, err])))
    }
    
    const { name } = useSelector((state) => {
        return {
            name: state.user.username
        }
    })
    if (name) return <Redirect to="/" />
    
    return (
        <div style={{ textAlign: "center", display: "flex", justifyContent: "center" }}>
            <Form style={{ width: "300px", padding: 20, border: "1px solid black", borderRadius: 5 }}>
                <h1>Login</h1>
                <Form.Control onChange={event => setLoginDetails({ ...loginDetails, username: event.target.value, email: event.target.value })} placeholder="Enter username or email" />
                <InputGroup>
                    <Form.Control onChange={event => setLoginDetails({ ...loginDetails, password: event.target.value })} placeholder="Enter password" type={passVis ? "text" : "password"} />
                    <InputGroup.Text onClick={() => setPassVis(!passVis)}>{passVis ? "HIDE" : "SHOW"}</InputGroup.Text>
                </InputGroup>
                <Button variant="outline-info" onClick={handleLog}>Submit</Button>
                <div>
                    <Button variant="outline-info" as={Link} to="/forgotpassword">Forgot Password</Button>
                    <Button variant="outline-info" as={Link} to="/register">Register</Button>
                </div>
            </Form>
            <Modal show={modalAlert[0]} onHide={() => setModalAlert([false, ""])} style={{ marginTop: 280 }}>
                <Button variant="transparent" onClick={() => setModalAlert([false, ""])}>
                    <Modal.Body>{modalAlert[1]}</Modal.Body>
                </Button>
            </Modal>
        </div>
    )
}

export default Login