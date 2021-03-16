import React from 'react'
import Axios from 'axios'
import { Card, Dropdown, Pagination } from 'react-bootstrap'

const Product = () => {
    const [data, setData] = React.useState([])
    const [currentPage, setCurrentPage] = React.useState(0)
    
    const display = data.slice(currentPage * 10, currentPage * 10 + 10)
        .map((item, index) => {
            return (
                <Card key={index} style={{ margin: 10, textAlign: "center" }}>
                    <Card.Img style={{ width: 250 }} src={'http://localhost:2000/' + item.images[1]} />
                    <Card.Body>
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Text style={{ fontSize: 20 }}>{item.category}</Card.Text>
                        <Card.Text>IDR {Intl.NumberFormat('in-ID', { currency: 'IDR', style: 'decimal' }).format(item.price)}</Card.Text>
                    </Card.Body>
                </Card>
            )
        })
        
    const [sortDown1, setSortDown1] = React.useState(true)
    const [sortDown2, setSortDown2] = React.useState(true)
    const [sortDown3, setSortDown3] = React.useState(true)
    const [sortName, setSortName] = React.useState(false)
    const [sortPrice, setSortPrice] = React.useState(false)
    const [sortCategory, setSortCategory] = React.useState(false)
    const sortByName = () => {
        setCurrentPage(0)
        const copy = [...data]
        if (sortDown1) copy.sort((a, b) => a.name.localeCompare(b.name))
        else copy.sort((a, b) => b.name.localeCompare(a.name))
        setSortDown1((prev) => !prev)
        setData(copy)
        setSortName(!sortName)
        setSortPrice(false)
        setSortCategory(false)
        setSortDown2(true)
        setSortDown3(true)
    }
    const sortByPrice = () => {
        setCurrentPage(0)
        const copy = [...data]
        if (sortDown2) copy.sort((a, b) => a.price - b.price)
        else copy.sort((a, b) => b.price - a.price)
        setSortDown2((prev) => !prev)
        setData(copy)
        setSortName(false)
        setSortPrice(!sortPrice)
        setSortCategory(false)
        setSortDown1(true)
        setSortDown3(true)
    }
    const sortByCategory = () => {
        setCurrentPage(0)
        const copy = [...data]
        if (sortDown3) copy.sort((a, b) => a.category.localeCompare(b.category))
        else copy.sort((a, b) => b.category.localeCompare(a.category))
        setSortDown3((prev) => !prev)
        setData(copy)
        setSortName(false)
        setSortPrice(false)
        setSortCategory(!sortCategory)
        setSortDown1(true)
        setSortDown2(true)
    }
    
    React.useEffect(() => {
        Axios.post('http://localhost:2000/product/showAll')
        .then((res) => setData(res.data))
        .catch(err => console.log(err))
    }, [])
    
    return (
        <div>
            <div style={{ marginLeft: 1290, marginTop: 30, marginBottom: -10 }}>
                <Dropdown>
                    <Dropdown.Toggle variant="success">Sort By</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={sortByName}>{sortName ? 'Name (Z-A)' : 'Name (A-Z)'}</Dropdown.Item>
                        <Dropdown.Item onClick={sortByPrice}>{sortPrice ? 'Price (High - Low)' : 'Price (Low - High)'}</Dropdown.Item>
                        <Dropdown.Item onClick={sortByCategory}>{sortCategory ? 'Category (Z-A)' : 'Category (A-Z)'}</Dropdown.Item>
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

export default Product