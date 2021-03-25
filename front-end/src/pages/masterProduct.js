import React from 'react'
import Axios from 'axios'
import { Table, Button, Form, Modal, Dropdown, Pagination } from 'react-bootstrap'

const MasterProduct = () => {
    const [productsData, setProductsData] = React.useState([])
    const [categoriesData, setCategoriesData] = React.useState([])
    const [newItem, setNewItem] = React.useState({ idProduct: 21, name: '', price: '', category: '' })
    const [editItem, setEditItem] = React.useState({ idProduct: 0, name: '', price: '', category: '', categoryId: 0, stock1: 0, stock2: 0 })
    const [showModal, setShowModal] = React.useState({ edit: false, category: false, category2: false, stock: false, error: false })
    const [modalBody, setModalBody] = React.useState('')
    const [sortDown, setSortDown] = React.useState({ name: true, price: true, category: false, stock: true })
    const [sortBy, setSortBy] = React.useState({ name: false, price: false, category: false, stock: false })
    const [currentPage, setCurrentPage] = React.useState(0)
    
    const sortByName = () => {
        const dataToSort = [...productsData]
        if (sortDown.name) dataToSort.sort((a, b) => a.name.localeCompare(b.name))
        else dataToSort.sort((a, b) => b.name.localeCompare(a.name))
        setSortDown({ ...sortDown, name: !sortDown.name, price: true, category: true, stock: true })
        setProductsData(dataToSort)
        setSortBy({ ...sortBy, name: !sortBy.name })
    }
    const sortByPrice = () => {
        const dataToSort = [...productsData]
        if (sortDown.price) dataToSort.sort((a, b) => a.price - b.price)
        else dataToSort.sort((a, b) => b.price - a.price)
        setSortDown({ ...sortDown, name: true, price: !sortDown.price, category: true, stock: true })
        setProductsData(dataToSort)
        setSortBy({ ...sortBy, price: !sortBy.price })
    }
    const sortByCategory = () => {
        const dataToSort = [...productsData]
        if (sortDown.category) dataToSort.sort((a, b) => a.category.localeCompare(b.category))
        else dataToSort.sort((a, b) => b.category.localeCompare(a.category))
        setSortDown({ ...sortDown, name: true, price: true, category: !sortDown.category, stock: true })
        setProductsData(dataToSort)
        setSortBy({ ...sortBy, category: !sortBy.category })
    }
    const sortByStock = () => {
        const dataToSort = [...productsData]
        if (sortDown.stock) dataToSort.sort((a, b) => a.total_stock - b.total_stock)
        else dataToSort.sort((a, b) => b.total_stock - a.total_stock)
        setSortDown({ ...sortDown, name: true, price: true, category: true, stock: !sortDown.stock })
        setProductsData(dataToSort)
        setSortBy({ ...sortBy, stock: !sortBy.stock })
    }
    
    React.useEffect(() => {
        Axios.post('http://localhost:2000/product/showAllProductsForAdmin')
            .then(res => setProductsData(res.data))
            .catch(err => console.log(err))
    }, [])
    
    const handleAddProduct = () => {
        if (!newItem.name || !newItem.price) {
            setShowModal({ ...showModal, error: true })
            setModalBody('Input cannot be empty')
        } else if (newItem.price < 1) {
            setShowModal({ ...showModal, error: true })
            setModalBody('Price cannot be zero or less')
        }
        Axios.post(`http://localhost:2000/product/add`, { id_product: newItem.idProduct, name: newItem.name, price: newItem.price })
            .then(res => {
                setProductsData(res.data)
                setNewItem({ ...newItem, idProduct: newItem.idProduct + 1, name: '', price: '' })
            })
            .catch(err => {
                setShowModal({ ...showModal, error: true })
                setModalBody(err.response.data)
            })
    }
    const handleEditProduct = (index) => {
        if (!editItem.name || !editItem.price || !editItem.categoryId || !editItem.stock1 || !editItem.stock2) {
            setShowModal({ ...showModal, edit: false, error: true })
            setModalBody('Input cannot be empty')
        } else if (editItem.price < 1) {
            setShowModal({ ...showModal, edit: false, error: true })
            setModalBody('Price cannot be zero or less')
        }
        const edit = { name: editItem.name, price: editItem.price, id_category: editItem.categoryId, stock1: editItem.stock1, stock2: editItem.stock2 }
        Axios.post(`http://localhost:2000/product/edit/${index}`, edit)
            .then(res => {
                setProductsData(res.data)
                setShowModal({ ...showModal, edit: false })
            })
            .catch(err => console.log(err))
    }
    const handleDeleteProduct = (index) => {
        Axios.post(`http://localhost:2000/product/delete/${index}`)
            .then(res => setProductsData(res.data))
            .catch(err => console.log(err))
    }
    
    const displayProducts = productsData.slice(currentPage * 6, currentPage * 6 + 6)
        .map((item, index) => {
            return (
                <tr key={index}>
                    <td><div style={{ marginTop: 6 }}>{item.category}</div></td>
                    <td><div style={{ marginTop: 6 }}>{item.name}</div></td>
                    <td><div style={{ marginTop: 6 }}>{item.total_stock ? item.total_stock + ' units' : '-'}</div></td>
                    <td><div style={{ marginTop: 6 }}>${Intl.NumberFormat('en-US', { currency: 'USD', style: 'decimal' }).format(item.price)}</div></td>
                    <td><div style={{ marginTop: 6 }}>{item.status}</div></td>
                    <td>
                        <div>
                            <Button variant="outline-info" onClick={() => {
                                setShowModal({ ...showModal, edit: true });
                                setEditItem({ ...editItem, idProduct: item.id_product, name: item.name, price: item.price, category: item.category, categoryId: item.id_category, stock1: item.stocks[0], stock2: item.stocks[1] });
                            }} style={{ marginRight: 5 }}>Edit</Button>
                            <Button style={{ marginLeft: 5 }} variant="outline-info" onClick={() => handleDeleteProduct(item.id_product)}>Delete</Button>
                        </div>
                    </td>
                </tr>
            )
        })
    
    return (
        <div style={{ padding: 20, marginTop: 35 }}>
            <Table striped bordered style={{ textAlign: "center" }}>
                <thead>
                    <tr>
                        <th>
                            <Button variant="transparent" onClick={sortByCategory}>
                                <b>Category</b>
                                <i style={{ marginLeft: 10 }} className={sortDown.category ? "fas fa-chevron-down" : "fas fa-chevron-up"}></i>
                            </Button>
                        </th>
                        <th>
                            <Button variant="transparent" onClick={sortByName}>
                                <b>Product Name</b>
                                <i style={{ marginLeft: 10 }} className={sortDown.name ? "fas fa-chevron-down" : "fas fa-chevron-up"}></i>
                            </Button>
                        </th>
                        <th>
                            <Button variant="transparent" onClick={sortByStock}>
                                <b>Total Stock</b>
                                <i style={{ marginLeft: 10 }} className={sortDown.stock ? "fas fa-chevron-down" : "fas fa-chevron-up"}></i>
                            </Button>
                        </th>
                        <th>
                            <Button variant="transparent" onClick={sortByPrice}>
                                <b>Price/unit</b>
                                <i style={{ marginLeft: 10 }} className={sortDown.price ? "fas fa-chevron-down" : "fas fa-chevron-up"}></i>
                            </Button>
                        </th>
                        <th><div style={{ marginTop: -31 }}>Status</div></th>
                        <th><div style={{ marginTop: -31 }}>Action</div></th>
                    </tr>
                </thead>
                <tbody>
                    {displayProducts}
                    <tr>
                        <td><div style={{ marginTop: 7 }}>-</div></td>
                        <td><Form.Control placeholder="Enter product name" value={newItem.name} onChange={event => setNewItem({ ...newItem, name: event.target.value })} /></td>
                        <td><div style={{ marginTop: 7 }}>-</div></td>
                        <td><Form.Control placeholder="Enter price" value={newItem.price} onChange={event => setNewItem({ ...newItem, price: event.target.value })} type="number" /></td>
                        <td><div style={{ marginTop: 7 }}>-</div></td>
                        <td><Button variant="info" onClick={handleAddProduct}>Submit New Item</Button></td>
                    </tr>
                    <tr>
                        <td colSpan="6">
                            {/* <Button style={{marginRight: 5}} variant="info" onClick={() => setShowModal({...showModal, category: true})}>Manage Categories</Button> */}
                            <Button variant="info" onClick={() => setShowModal({ ...showModal, category: true })}>Manage Categories</Button>
                            {/* <Button style={{marginLeft: 5}} variant="info" onClick={() => setShowModal({...showModal, stock: true})}>Manage Stocks</Button> */}
                        </td>
                    </tr>
                </tbody>
            </Table>
            <Pagination style={{ justifyContent: "center" }}>
                <Pagination.Prev onClick={() => currentPage <= 0 ? setCurrentPage(0) : setCurrentPage(currentPage - 1)} />
                <Pagination.Next onClick={() => currentPage >= 3 ? setCurrentPage(3) : setCurrentPage(currentPage + 1)} />
            </Pagination>
            <Modal show={showModal.edit} onHide={() => setShowModal({ ...showModal, edit: false })}>
                <Modal.Header>Edit Product</Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover style={{ textAlign: "center" }}>
                        <tbody>
                            <tr>
                                <td><b>Category</b></td>
                                <td><b>Name</b></td>
                                <td><b>Price ($)</b></td>
                            </tr>
                            <tr>
                                <td>
                                    <div style={{ width: 150 }}>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="outline-dark">{editItem.category}</Dropdown.Toggle>
                                            <Dropdown.Menu style={{ width: 171 }}>
                                                {categoriesData.map((item, index) => {
                                                    return (
                                                        <Dropdown.Item key={index} onClick={() => setEditItem({ ...editItem, categoryId: item.id_category, category: item.category })}>{item.category}</Dropdown.Item>
                                                    )
                                                })}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </td>
                                <td><Form.Control style={{}} defaultValue={editItem.name} onChange={event => setEditItem({ ...editItem, name: event.target.value })} /></td>
                                <td><Form.Control style={{ width: 90 }} defaultValue={editItem.price} onChange={event => setEditItem({ ...editItem, price: event.target.value })} type="number" /></td>
                            </tr>
                        </tbody>
                    </Table>
                    <Table striped bordered hover style={{textAlign: "center"}}>
                        <tbody>
                            <tr>
                                <td colSpan="3"><div style={{marginTop: 0}}><b>Stock</b></div></td>
                            </tr>
                            <tr>
                                <td><b>Warehouse JKT</b></td>
                                <td><b>Warehouse BDG</b></td>
                                <td><b>Total</b></td>
                            </tr>
                            <tr>
                                <td style={{width: 170}}><Form.Control defaultValue={editItem.stock1} onChange={event => setEditItem({ ...editItem, stock1: event.target.value })} type="number" /></td>
                                <td style={{width: 170}}><Form.Control defaultValue={editItem.stock2} onChange={event => setEditItem({ ...editItem, stock2: event.target.value })} type="number" /></td>
                                <td>{parseInt(editItem.stock1) + parseInt(editItem.stock2)}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-info" onClick={() => handleEditProduct(editItem.idProduct)}>Save</Button>
                    <Button variant="outline-info" onClick={() => setShowModal({ ...showModal, edit: false })}>Cancel</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showModal.error} onHide={() => setShowModal({ ...showModal, error: false })} style={{ marginTop: 280 }}>
                <Button variant="transparent" onClick={() => setShowModal({ ...showModal, error: false })}>
                    <Modal.Body>
                        <div style={{ textAlign: "center" }}>{modalBody}</div>
                    </Modal.Body>
                </Button>
            </Modal>
        </div>
    )
}

export default MasterProduct