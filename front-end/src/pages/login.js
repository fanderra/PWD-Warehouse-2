import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Modal, InputGroup } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'
import { login } from '../actions'

const Login = () => {
    const [username, setUsername] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [passVis, setPassVis] = React.useState(false)
    const [logAlert, setLogAlert] = React.useState([false, ''])
    const [logSuccess, setLogSuccess] = React.useState(false)
    
    const { name } = useSelector((state) => {
        return {
            name: state.user.username
        }
    })
    
    const dispatch = useDispatch()
    const handleLog = () => {
        if (!username && !password) return setLogAlert([true, 'Enter your username/email & password'])
        if (!username || !email) return setLogAlert([true, 'Enter your username or email'])
        if (!password) return setLogAlert([true, 'Enter your password'])
        
        const user = { username, email, password }
        dispatch(login(user, err => setLogAlert([true, err])))
    }
    if (name) return <Redirect to="/product" />
    
    return (
        <div style={{ textAlign: "right" }}>
            <Form style={{ width: "300px", marginLeft: "750px", position: "fixed" }}>
                <h1>Login</h1>
                <Form.Control onChange={event => {setUsername(event.target.value); setEmail(event.target.value)}} placeholder="Enter username or email" />
                <InputGroup>
                    <Form.Control onChange={event => setPassword(event.target.value)} placeholder="Enter password" type={passVis ? "text" : "password"} />
                    <InputGroup.Text onClick={() => setPassVis(!passVis)}>{passVis ? "HIDE" : "SHOW"}</InputGroup.Text>
                </InputGroup>
                <Button as={Link} to="/forgot">Forgot Password</Button>
                <Button onClick={handleLog}>Submit</Button>
            </Form>
            <Modal show={logAlert[0]} onHide={() => setLogAlert([false, ""])}>
                <Modal.Header><Modal.Title>Alert</Modal.Title></Modal.Header>
                <Modal.Body>{logAlert[1]}</Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setLogAlert([false, ""])}>Close</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={logSuccess} onHide={() => setLogSuccess(false)}>
                <Modal.Header><Modal.Title>Alert</Modal.Title></Modal.Header>
                <Modal.Body>Log In Successful!</Modal.Body>
                <Modal.Footer>
                    <Button as={Link} to="/product">Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Login