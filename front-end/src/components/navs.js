import React from 'react'
import { Nav } from 'react-bootstrap'
import {Link}from 'react-router-dom'
export default function Navs() {
    return (
        <Nav fill variant="tabs" defaultActiveKey="/history/confirmed">
            <Nav.Item>
                <Nav.Link style={{color:'black'}} eventKey="link-1"  as={Link} to='/history/pending'>Pending</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link style={{color:'black'}} eventKey="link-2" as={Link} to='/history/confirmed'>Confirmed</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link style={{color:'black'}} as={Link} eventKey="link-3"  to='/history/delivery'>Delivery</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link style={{color:'black'}} as={Link} eventKey="link-4"  to='/history/completed'>Completed</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link style={{color:'black'}} eventKey="link-5"  as={Link} to='/history/canceled'>Canceled</Nav.Link>
            </Nav.Item>
        </Nav>
    )
}
