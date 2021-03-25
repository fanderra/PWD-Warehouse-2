import React from 'react'
import Axios from 'axios'
import { Button, Modal, Form, Card, Carousel, Dropdown, Pagination } from 'react-bootstrap'

const Product = () => {
    const [data, setData] = React.useState([])
    const [currentPage, setCurrentPage] = React.useState(0)
    const [sortDown, setSortDown] = React.useState({ name: true, price: true, category: true, stock: true })
    const [sortBy, setSortBy] = React.useState({ name: false, price: false, category: false, stock: false })
    
    const displayProducts = data.slice(currentPage * 10, currentPage * 10 + 10)
        .map((item, index) => {
            return (
                <Card style={{ textAlign: "center" }}>
                    <Card.Img style={{ width: 250 }} src={'http://localhost:2000/' + item.images[0]} />
                    <Card.Body>
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Text style={{ fontSize: 19 }}>{item.category}</Card.Text>
                        <Card.Text>${Intl.NumberFormat('en-US', { currency: 'USD', style: 'decimal' }).format(item.price)}</Card.Text>
                    </Card.Body>
                </Card>
            )
        })
    
    const sortByName = () => {
        setCurrentPage(0)
        const copy = [...data]
        if (sortDown.name) copy.sort((a, b) => a.name.localeCompare(b.name))
        else copy.sort((a, b) => b.name.localeCompare(a.name))
        setData(copy)
        setSortDown({ ...sortDown, name: !sortDown.name, price: true, category: true })
        setSortBy({ ...sortBy, name: !sortBy.name, price: false, category: false })
    }
    const sortByPrice = () => {
        setCurrentPage(0)
        const copy = [...data]
        if (sortDown.price) copy.sort((a, b) => a.price - b.price)
        else copy.sort((a, b) => b.price - a.price)
        setData(copy)
        setSortDown({ ...sortDown, name: true, price: !sortDown.price, category: true })
        setSortBy({ ...sortBy, name: false, price: !sortBy.price, category: false })
    }
    const sortByCategory = () => {
        setCurrentPage(0)
        const copy = [...data]
        if (sortDown.category) copy.sort((a, b) => a.category.localeCompare(b.category))
        else copy.sort((a, b) => b.category.localeCompare(a.category))
        setData(copy)
        setSortDown({ ...sortDown, name: true, price: true, category: !sortDown.category })
        setSortBy({ ...sortBy, name: false, price: false, category: !sortBy.category })
    }
    
    React.useEffect(() => {
        Axios.post('http://localhost:2000/product/showAllProductsForUser')
            .then(res => setData(res.data))
            .catch(err => console.log(err))
    }, [])
    
    return (
        <div>
            <div style={{ marginLeft: 1290, marginTop: 30, marginBottom: -10 }}>
                <Dropdown>
                    <Dropdown.Toggle variant="outline-info">Sort By</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={sortByName}>{sortBy.name ? 'Name (Z-A)' : 'Name (A-Z)'}</Dropdown.Item>
                        <Dropdown.Item onClick={sortByPrice}>{sortBy.price ? 'Price (High - Low)' : 'Price (Low - High)'}</Dropdown.Item>
                        <Dropdown.Item onClick={sortByCategory}>{sortBy.category ? 'Category (Z-A)' : 'Category (A-Z)'}</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", padding: 20, justifyContent: "center" }}>
                {displayProducts}
            </div>
            <Pagination style={{ justifyContent: "center" }}>
                <Pagination.Prev style={{ color: "red" }} onClick={() => currentPage <= 0 ? setCurrentPage(0) : setCurrentPage(currentPage - 1)} />
                <Pagination.Next onClick={() => currentPage >= 1 ? setCurrentPage(1) : setCurrentPage(currentPage + 1)} />
            </Pagination>
        </div>
    )
}

export default Product