import React from 'react'
import { Navbar, Nav, Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../actions'

const Navigation = () => {
    const dispatch = useDispatch()
    const { name } = useSelector((state) => {
        return {
            name: state.user.username
        }
    })
    return (
        <div>
            <Navbar bg="dark" expand="lg">
                <Navbar.Brand style={{ color: "lightGrey" }}>Group Project</Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link style={{ color: "lightGrey" }} as={Link} to="/">Home</Nav.Link>
                        <Nav.Link style={{ color: "lightGrey" }} as={Link} to="/product">Product</Nav.Link>
                    </Nav>
                    <Dropdown>
                        <Dropdown.Toggle style={{ color: "lightGrey", backgroundColor: "transparent", borderColor: "transparent" }}>
                            {name ? name.toUpperCase() : "USERNAME "}
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="right">
                            {name
                                ?
                                <>
                                    <Dropdown.Item as={Link} to="/cart">Cart</Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/verification">Verification</Dropdown.Item>
                                    <Dropdown.Item onClick={() => dispatch(logout())} as={Link} to="/login">Log Out</Dropdown.Item>
                                </>
                                :
                                <>
                                    <Dropdown.Item as={Link} to="/login">Log In</Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/register">Register</Dropdown.Item>
                                </>
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default Navigation