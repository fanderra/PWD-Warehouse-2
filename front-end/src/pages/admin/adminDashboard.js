import Axios from 'axios';
import React from 'react'
import {Card, Pagination, Dropdown} from 'react-bootstrap'

export default function AdminDashboard() {
    const [data, setData] = React.useState([])
    const [currentPage, setCurrentPage] = React.useState(0)
    const [sortDown, setSortDown] = React.useState({ name: true, price: true, category: true, stock: true })
    const [sortBy, setSortBy] = React.useState({ name: false, price: false, category: false, stock: false })

    const display = data.slice(currentPage * 10, currentPage * 10 + 10)
        .map((item, index) => {
            return (
                <Card key={index} style={{ margin: 10, textAlign: "center" }}>
                    <Card.Img style={{ width: 250 }} src={'http://localhost:2000/' + item.image} />
                    <Card.Body>
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Text style={{ fontSize: 19 }}>{item.category}</Card.Text>
                        <Card.Text>
                            <p>{item.storages.map((item, index) => {
                                return (
                                    <div style={{border: 'solid 2px black', marginTop: 10}}>
                                        <p style={{marginTop: 12}}>Storage: {item.name} </p>
                                        <p style={{marginTop: -15}}>Stock: {item.stock} </p>
                                        <p style={{marginTop: -15}}>Purchased_stock: {item.purchased_stock} </p>
                                    </div>
                                )
                            })}</p> 
                        </Card.Text>
                        <Card.Text>${Intl.NumberFormat('en-US', { currency: 'USD', style: 'decimal' }).format(item.price)}</Card.Text>
                        {/* <Button onClick={() => { setModalDetails(true); setQty(1); setIdProd(item.id_product); setDetails(item); setImg(item.images) }}>View Details</Button> */}
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
        Axios.post('http://localhost:2000/admin/showInfo')
        .then(res => setData(res.data))
        .catch(err => console.log(err))
    }, [])
    console.log(data)

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
            <div style={{ display: "flex", flexWrap: "wrap", padding: 20, justifyContent: "center" }}>
                {display}
            </div>
            <Pagination style={{ marginLeft: 1325 }}>
                <Pagination.Prev onClick={() => currentPage <= 0 ? setCurrentPage(0) : setCurrentPage(currentPage - 1)} />
                <Pagination.Next onClick={() => currentPage >= 1 ? setCurrentPage(1) : setCurrentPage(currentPage + 1)} />
            </Pagination>
        </div>
    )
}
