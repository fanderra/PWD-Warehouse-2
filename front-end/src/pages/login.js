import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Modal, InputGroup } from 'react-bootstrap'
import { Link, Redirect, useHistory} from 'react-router-dom'
import { login, resetRequest } from '../actions'
import ResetPasswordModal from '../components/resetPasswordModal';
const Login = () => {
    const [loginDetails, setLoginDetails] = React.useState({ username: '', email: '', password: '' })
    const [passVis, setPassVis] = React.useState(false)
    const [modalAlert, setModalAlert] = React.useState([false, ''])
    const [check,setCheck] = React.useState(true)
    const [show, setShow] = React.useState(false)

    const dispatch = useDispatch()
    const history = useHistory()
    const handleLog = () => {
        if (!loginDetails.username && !loginDetails.password) return setModalAlert([true, 'Enter username/email & password'])
        if (!loginDetails.username || !loginDetails.email) return setModalAlert([true, 'Enter username or email'])
        if (!loginDetails.password) return setModalAlert([true, 'Enter password'])
        
        const user = { username: loginDetails.username, email: loginDetails.email, password: loginDetails.password }
        dispatch(login({ check, user }, err => setModalAlert([true, err])))
    }
    const handleUserData = (data, cb) => {
        resetRequest(data, (err, res) => {
            if (err) return cb(err)
            setShow(false)
            history.push('/forgot/' + res)
        })
    }
    
    const { name } = useSelector((state) => {
        return {
            name: state.user.username
        }
    })
    if (name) return <Redirect to="/" />
    
    return (
        <div style={{ textAlign: "center", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "450px", padding: 20, border: "1px solid black", borderRadius: 5, marginTop: 150 }}>
                <br />
                <h1>Log In to your account</h1>
                <Form style={{ marginTop: 25 }}>
                    <Form.Control style={{ fontStyle: "italic" }} onChange={event => setLoginDetails({ ...loginDetails, username: event.target.value, email: event.target.value })} placeholder="Enter username or email" />
                    <InputGroup style={{ marginTop: 10 }}>
                        <Form.Control style={{ fontStyle: "italic" }} onChange={event => setLoginDetails({ ...loginDetails, password: event.target.value })} placeholder="Enter password" type={passVis ? "text" : "password"} />
                        <InputGroup.Text style={{ cursor: 'pointer' }} onClick={() => setPassVis(!passVis)}>{passVis ? "HIDE" : "SHOW"}</InputGroup.Text>
                    </InputGroup>
                </Form>
                <div style={{ display: "flex", justifyContent: "space-around", marginTop: 10 }}>
                    <Form.Check checked={check} onChange={event => setCheck(event.target.checked)} type="checkbox" label="Remember me" style={{ marginTop: 7, marginRight: 0 }} />
                    <Button style={{ color: "#358597" }} variant="transparent" onClick={() => setShow(true)}>Forgot Password?</Button>
                </div>
                <br />
                <Button variant="info" onClick={handleLog} style={{ width: 406 }}>Log In</Button>
                <br /><br />
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button variant="transparent" style={{ color: "black", fontSize: 15, cursor: "default", marginRight: -10 }}>Need an account?</Button>
                    <Button variant="transparent" style={{ color: "#358597", fontSize: 15, marginLeft: -10 }} as={Link} to="/register">Sign Up</Button>
                </div>
            </div>
            <Modal show={modalAlert[0]} onHide={() => setModalAlert([false, ""])} style={{ marginTop: 280 }}>
                <Button variant="transparent" onClick={() => setModalAlert([false, ""])}>
                    <Modal.Body>{modalAlert[1]}</Modal.Body>
                </Button>
            </Modal>
            <ResetPasswordModal handleClose={() => setShow(false)} action={handleUserData} show={show} />
        </div>
    )
}

export default Login