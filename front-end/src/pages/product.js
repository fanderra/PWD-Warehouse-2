import React from 'react'
import Axios from 'axios'
import { Button, Modal, Form, Card, Carousel, Dropdown, Pagination } from 'react-bootstrap'
import { useSelector } from 'react-redux'

const Product = () => {
    const [data, setData] = React.useState([])
    const [modalDetails, setModalDetails] = React.useState(false)
    const [modalAddToCart, setModalAddToCart] = React.useState([false, ''])
    const [qty, setQty] = React.useState(1)
    const [details, setDetails] = React.useState({})
    const [img, setImg] = React.useState([])
    const [currentPage, setCurrentPage] = React.useState(0)
    const [sortDown, setSortDown] = React.useState({ name: true, price: true, category: true, stock: true })
    const [sortBy, setSortBy] = React.useState({ name: false, price: false, category: false, stock: false })
    
    const displayProducts = data.slice(currentPage * 10, currentPage * 10 + 10)
        .map((item, index) => {
            return (
                <Button key={index} style={{ margin: 0 }} variant="transparent" onClick={() => { setModalDetails(true); setQty(1); setDetails(item); setImg(item.images) }}>
                    <Card style={{ textAlign: "center" }}>
                        <Card.Img style={{ width: 250 }} src={'http://localhost:2000/' + item.images[0]} />
                        <Card.Body>
                            <Card.Title>{item.name}</Card.Title>
                            <Card.Text style={{ fontSize: 19 }}>{item.category}</Card.Text>
                            <Card.Text>${Intl.NumberFormat('en-US', { currency: 'USD', style: 'decimal' }).format(item.price)}</Card.Text>
                        </Card.Body>
                    </Card>
                </Button>
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
    
    const { idUser } = useSelector((state) => {
        return {
            idUser: state.user.id_user
        }
    })
    const handleAddToCart = () => {
        if (idUser === null) {
            setModalDetails(false)
            setModalAddToCart([true, 'Login first to continue buying'])
        } else if (qty > details.total_stock) {
            setModalDetails(false)
            setModalAddToCart([true, 'Quantity exceeds maximum allowed'])
        } else if (qty < 1) {
            setModalDetails(false)
            setModalAddToCart([true, 'Quantity cannot be zero or less'])
        }
        const addToCart = { id_user: idUser, id_product: details.id_product, qty }
        // console.log(addToCart)
        
        Axios.post('http://localhost:2000/cart/add', addToCart)
            .then(res => {
                console.log(res.data)
                setModalDetails(false)
                setModalAddToCart([true, 'Add to cart successful'])
                setQty(1)
            })
            .catch(err => console.log(err))
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
            <Modal show={modalDetails} onHide={() => setModalDetails(false)}>
                <Modal.Body>
                    <Carousel style={{ margin: -16 }}>
                        <Carousel.Item><img alt="1st slide" width={498} src={'http://localhost:2000/' + img[0]} /></Carousel.Item>
                        <Carousel.Item><img alt="2st slide" width={498} src={'http://localhost:2000/' + img[1]} /></Carousel.Item>
                    </Carousel>
                    <br />
                    <div style={{ textAlign: "center" }}>
                        <div>{details.name}</div>
                        <div>{details.category}</div>
                        <div>${Intl.NumberFormat('en-US', { currency: 'USD', style: 'decimal' }).format(details.price)}</div>
                    </div>
                    <br />
                    <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                        <div>TEST stock awal: {details.total_stock}</div>
                        <div>Udah dibeli: {details.total_purchased_stock}</div>
                        <div>Stock FINAL: {details.total_stock ? details.total_stock - details.total_purchased_stock : "-"}</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                        <div>Available Stock: {details.total_stock ? details.total_stock - details.total_purchased_stock : "-"}</div>
                        <div style={{ flexDirection: "row", display: "flex", marginLeft: 5 }}>
                            <Button variant="info" onClick={() => qty <= 1 ? setQty(qty - 0) : setQty(qty - 1)}>-</Button>
                            <Form.Control style={{ width: 45, textAlign: "center" }} onChange={event => setQty(parseInt(event.target.value))} value={qty} />
                            <Button variant="info" onClick={() => qty >= details.total_stock ? setQty(qty + 0) : setQty(qty + 1)}>+</Button>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-info" onClick={() => handleAddToCart()}>Add To Cart</Button>
                    <Button variant="outline-info" onClick={() => setModalDetails(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={modalAddToCart[0]} onHide={() => setModalAddToCart(false)} style={{ marginTop: 280 }}>
                <Button variant="transparent" onClick={() => setModalAddToCart(false)}>
                    <Modal.Body>
                        <div style={{ textAlign: "center" }}>{modalAddToCart[1]}</div>
                    </Modal.Body>
                </Button>
            </Modal>
        </div>
    )
}

export default Product