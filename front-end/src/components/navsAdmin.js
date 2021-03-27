import React from 'react'
import { Nav } from 'react-bootstrap'
import {Link}from 'react-router-dom'
export default function NavsAdmin() {
    return (
        <Nav fill variant="tabs" defaultActiveKey="/admin/dashboard">
            <Nav.Item>
                <Nav.Link style={{color:'black'}} eventKey="link-1"  as={Link} to='/admin/dashboard'>Dashboard</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link style={{color:'black'}} eventKey="link-2" as={Link} to='/admin/orders'>Orders</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link style={{color:'black'}} eventKey="link-3" as={Link} to='/admin/reports'>Sales Reports</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link style={{color:'black'}} eventKey="link-4" as={Link} to='/admin/products'>Products</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link style={{color:'black'}} eventKey="link-5" as={Link} to='/admin/stocks'>Stocks</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link style={{color:'black'}} eventKey="link-6" as={Link} to='/admin/users'>Users</Nav.Link>
            </Nav.Item>
        </Nav>
    )
}