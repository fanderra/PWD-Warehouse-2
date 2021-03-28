import React from 'react'
import Axios from 'axios'
import { Button, Modal, Form, Card, Carousel, Dropdown, Pagination } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { keepLogin } from '../actions'

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
    
    const dispatch = useDispatch()

    const displayProducts = data.slice(currentPage * 10, currentPage * 10 + 10)
        .map((item, index) => {
            return (
                <Button key={index} style={{ margin: 0 }} variant="transparent" onClick={() => { setModalDetails(true); setQty(1); setDetails(item); setImg(item.images) }}>
                    <Card style={{ textAlign: "center", width: '100%' }}>
                        <Card.Img style={{ width: '100%' }} src={'http://localhost:2000/' + item.images[0]} />
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
    
    React.useEffect(() => {
        Axios.post('http://localhost:2000/product/showAllProductsForUser')
            .then(res => setData(res.data))
            .catch(err => console.log(err))
    }, [])
    
    const { idUser, idRole, idStatus, kart } = useSelector((state) => {
        return {
            idUser: state.user.id_user,
            idRole: state.user.id_role,
            idStatus: state.user.id_status,
            kart: state.user.cart
        }
    })
    const handleAddToCart = () => {
        if (idUser === null) {
            setModalDetails(false)
            setModalAddToCart([true, 'Login first to continue buying'])
            return
        } 
        if (idRole === 2) {
            setModalDetails(false)
            setModalAddToCart([true, 'Admin are not allowed to buy product'])
            return
        } 
        // if (idStatus === 1) {
        //     setModalDetails(false)
        //     setModalAddToCart([true, 'Verify your email address to buy a product'])
        //     return
        // } 
        if (qty > details.total_stock) {
            setModalDetails(false)
            setModalAddToCart([true, 'Quantity exceeds maximum allowed'])
            return
        }
        if (qty < 1) {
            setModalDetails(false)
            setModalAddToCart([true, 'Quantity cannot be zero or less'])
            return
        }
        const addToCart = { id_user: idUser, id_product: details.id_product, qty }
        Axios.post('http://localhost:2000/cart/add', addToCart)
            .then(res => {
                console.log(res.data)
                setModalDetails(false)
                setModalAddToCart([true, 'Add to cart successful'])
                setQty(1)
                dispatch(keepLogin())
            })
            .catch(err => console.log(err))
    }
    
    return (
        <div>
            <div style={{ marginTop: 30, marginBottom: -10, display: "flex", flexDirection: "row-reverse", marginRight: 55 }}>
                <Dropdown>
                    <Dropdown.Toggle variant="outline-info">Sort By</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={sortByName}>{sortBy.name ? 'Name (Z-A)' : 'Name (A-Z)'}</Dropdown.Item>
                        <Dropdown.Item onClick={sortByPrice}>{sortBy.price ? 'Price (High - Low)' : 'Price (Low - High)'}</Dropdown.Item>
                        <Dropdown.Item onClick={sortByCategory}>{sortBy.category ? 'Category (Z-A)' : 'Category (A-Z)'}</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "270px 270px 270px 270px 270px", padding: 20, justifyContent: "center", gap: '10px' }}>
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
                    {/* <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", color: "red" }}>
                        <div>TEST stock awal: {details.total_stock}</div>
                        <div>Udah dibeli: {details.total_purchased_stock}</div>
                        <div>{kart[details.id_product].qty}</div>
                    </div> */}
                    <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                        {/* <div>Available Stock: {details.total_stock - details.total_purchased_stock - kart[details.id_product].qty}</div> */}
                        <div>Available Stock: {details.total_stock - details.total_purchased_stock}</div>
                        <div style={{ flexDirection: "row", display: "flex", marginLeft: 5 }}>
                            {/* <Button variant="info" onClick={() => qty <= 1 ? setQty(qty - 0) : setQty(qty - 1)}>-</Button> */}
                            <div style={{marginTop: 6, marginRight: 10}}>Quantity:</div>
                            <Form.Control style={{ width: 65, textAlign: "center" }} type='number' onChange={
                                event => {
                                    let value = event.target.value
                                    let maxStock = details.total_stock - details.total_purchased_stock
                                    setQty(parseInt(value > maxStock ? maxStock : value <= 0 ? 1 : value))}
                                } value={qty} />
                            {/* <Button variant="info" onClick={() => qty >= details.total_stock - details.total_purchased_stock ? setQty(qty + 0) : setQty(qty + 1)}>+</Button> */}
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