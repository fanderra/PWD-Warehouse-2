import React from 'react'
import { Navbar, Nav, Dropdown, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../actions'
import noPict from '../assets/no-profile.png'
const Navigation = () => {
    const dispatch = useDispatch()
    const { name, idRole, profile_picture, cart = [] } = useSelector((state) => {
        return {
            name: state.user.username,
            idRole: state.user.id_role,
            profile_picture: state.user.profile_picture,
            cart: state.user.cart,
        }
    })
    return (
        <div>
            <Navbar bg="dark" expand="lg">
                <Navbar.Brand style={{ color: "lightGrey", fontSize: 25 }} as={Link} to="/">IKIYA</Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link style={{ color: "lightGrey" }} as={Link} to="/">Home</Nav.Link>
                        {name && idRole === 1
                            ?
                            <>
                                <Nav.Link style={{ color: "lightGrey" }} as={Link} to='/history/confirmed'>History</Nav.Link>
                            </>
                            :
                            <></>
                        }
                        {idRole === 2 ?
                            <>
                                <Nav.Link style={{ color: "lightGrey" }} as={Link} to='/admin/dashboard' >Admin</Nav.Link>
                            </>
                            :
                            <></>
                        }
                    </Nav>
                    <Nav>
                        {name && idRole === 1 ?
                            <Nav.Link style={{ color: "lightGrey", display: "flex" }} as={Link} to="/cart">
                                <i style={{ marginRight: 2.5, marginTop: 5 }} className="fas fa-shopping-cart"></i>
                                <div style={{marginTop: -1}}>
                                    <Badge variant='light'>{cart.length}</Badge>
                                </div>
                                <div style={{marginLeft: 7.5, marginRight: 5}}>Cart</div>
                            </Nav.Link>
                        :
                            <></>
                        }

                    </Nav>
                    <Dropdown>
                        <Dropdown.Toggle style={{ color: "lightGrey", borderRadius: '5px 0 0 5px', backgroundColor: "transparent", boxShadow: '0 0 1px 0.5px white', borderColor: "transparent", height: '40px' }}>
                            {name ? name.toUpperCase() : "USERNAME "}
                        </Dropdown.Toggle>
                        <img style={{ height: '40px', borderRadius: '0 5px 5px 0', boxShadow: '0 0 1px 0.5px white', width: '40px' }} src={profile_picture ? `http://localhost:2000/${profile_picture}` : noPict} alt="profile" />
                        <Dropdown.Menu align="right">
                            {!name &&
                                <>
                                    <Dropdown.Item as={Link} to="/login">Log In</Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/register">Register</Dropdown.Item>
                                </>
                            }
                            {name && idRole === 1 &&
                                <>
                                    <Dropdown.Item as={Link} to="/verification">Verification</Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                                    <Dropdown.Item onClick={() => dispatch(logout())} as={Link} to="/login">Log Out</Dropdown.Item>
                                </>
                            }
                            {idRole === 2 ?
                                <>
                                    <Dropdown.Item onClick={() => dispatch(logout())} as={Link} to="/login">Log Out</Dropdown.Item>
                                </>
                                :
                                <>
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