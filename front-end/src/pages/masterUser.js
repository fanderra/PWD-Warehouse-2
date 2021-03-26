import React from 'react'
import Axios from 'axios'
import { Table, Button, Modal, Dropdown, Form } from 'react-bootstrap'

const MasterUser = () => {
    const [data, setData] = React.useState([])
    const [editItem, setEditItem] = React.useState({ idUser: 0, username: '', email: '', password: '', idRole: 0, role: ''})
    const [modalEdit, setModalEdit] = React.useState(false)
    
    React.useEffect(() => {
        Axios.post('http://localhost:2000/user/showAll')
            .then((res) => setData(res.data))
            .catch(err => console.log(err))
    }, [])
    
    return (
        <div style={{padding: 20, textAlign: "center"}}>
            <h1>USER DATABASE</h1>
            <br/>
            <Table striped bordered hover style={{textAlign: "center"}}>
                <thead>
                    <tr>
                        <td><b>ID</b></td>
                        <td><b>Username</b></td>
                        <td><b>Email</b></td>
                        <td><b>Role</b></td>
                        <td><b>Action</b></td>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td><div style={{marginTop: 7}}>{item.id_user}</div></td>
                                <td><div style={{marginTop: 7}}>{item.username}</div></td>
                                <td><div style={{marginTop: 7}}>{item.email}</div></td>
                                <td><div style={{marginTop: 7}}>{item.role.toUpperCase()}</div></td>
                                <td>
                                    <Button 
                                        style={{marginRight: 5}}
                                        variant="outline-info"
                                        onClick={() => {
                                            setModalEdit(true); 
                                            setEditItem({ idUser: item.id_user, username: item.username, email: item.email, password: item.password, idRole: item.id_role, role: item.role })}}
                                        >Edit
                                    </Button>
                                    <Button
                                        style={{marginLeft: 5}}
                                        variant="outline-info" 
                                        onClick={
                                            () => Axios.post(`http://localhost:2000/user/deleteUser/${item.id_user}`)
                                            .then(res => setData(res.data))
                                            .catch(err => console.log(err))}
                                        >Delete
                                    </Button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <Modal show={modalEdit} style={{marginTop: 115}} onHide={() => setModalEdit(false)}>
                <Modal.Header>Edit User</Modal.Header>
                <Modal.Body>
                    <Table striped bordered style={{ textAlign: "center" }}>
                        <tbody>
                            <tr>
                                <td><b>Username</b></td>
                                <td><b>Email</b></td>
                                <td><b>Role</b></td>
                            </tr>
                            <tr>
                                <td><Form.Control defaultValue={editItem.username} onChange={event => setEditItem({ ...editItem, username: event.target.value })}/></td>
                                <td><Form.Control defaultValue={editItem.email} onChange={event => setEditItem({ ...editItem, email: event.target.value })} style={{width: 200}} /></td>
                                <td>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="outline-dark">{editItem.role.toUpperCase()}</Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => setEditItem({ ...editItem, idRole: 1, role: 'USER' })}>USER</Dropdown.Item>
                                            <Dropdown.Item onClick={() => setEditItem({ ...editItem, idRole: 2, role: 'ADMIN' })}>ADMIN</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        style={{ marginRight: 5 }}
                        variant="outline-info"
                        onClick={
                            () => Axios.post(`http://localhost:2000/user/editUser/${editItem.idUser}`, { 
                                username: editItem.username, email: editItem.email, password: editItem.password, id_role: editItem.idRole 
                            })
                            .then(res => {
                                setData(res.data)
                                setModalEdit(false)
                            })
                            .catch(err => console.log(err))
                        }
                        >Save
                    </Button>
                    <Button variant="outline-info" onClick={() => setModalEdit(false)}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default MasterUser