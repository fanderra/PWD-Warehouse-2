import React from 'react'
import Axios from 'axios'
import { useSelector } from 'react-redux'
import { Dropdown, Form, Pagination } from 'react-bootstrap'
import CardAdmin from '../../components/cardAdmin'

const filter = [
    { name: 'Show all', id: 'tes' },
    { name: 'waiting for payment', id: 2 },
    { name: 'Confrimed', id: 3 },
    { name: 'on delivery', id: 4 },
    { name: 'completed', id: 5 },
    { name: 'canceled', id: 6 }
]

const AdminOrder = () => {
    const [data, setData] = React.useState([])
    const [currentPage, setCurrentPage] = React.useState(0)
    const [filterStatus, setFilterStatus] = React.useState('tes')
    // const [modal, setModal] = React.useState(false)

    const display = data.slice(currentPage * 10, currentPage * 10 + 10)
        .map((item, index) => {
            if (!isNaN(filterStatus)) {
                if (+item.id_order_status === +filterStatus) return (
                    <CardAdmin item={item} index={index} />
                )
            } else {
                return (
                    <CardAdmin item={item} index={index} />
                )
            }
        })

    const [sortDown1, setSortdown1] = React.useState(true)
    const [sortName, setSortName] = React.useState(false)
    const sortByName = () => {
        setCurrentPage(0)
        const copy = [...data]
        if (sortDown1) copy.sort((a, b) => a.username.localeCompare(b.username))
        else copy.sort((a, b) => b.username.localeCompare(a.username))
        setSortdown1((prev) => !prev)
        setData(copy)
        setSortName(!sortName)
    }

    // const [sortDown2, setSortdown2] = React.useState(true)
    // const [sortStatus, setSortStatus] = React.useState(false)
    // const sortByStatus = () => {
    //     setCurrentPage(0)
    //     const copy = [...data]
    //     if (sortDown2) copy.sort((a, b) => a.status.localeCompare(b.status))
    //     else copy.sort((a, b) => b.status.localeCompare(a.status))
    //     setSortdown2((prev) => !prev)
    //     setData(copy)
    //     setSortStatus(!sortStatus)
    // }

    const { cart } = useSelector((state) => {
        return {
            cart: state.user.cart
        }
    })

    React.useEffect(() => {
        Axios.post('http://localhost:2000/admin/showOrder')
            .then(res => {
                console.log(res.data)
                setData(res.data)
            })
            .catch(err => console.log(err))
    }, [cart])

    console.log(filterStatus)
    return (
        <div>
            <div>
                <div style={{ display: 'flex', marginLeft: 1290, marginTop: 30, marginBottom: -10 }}>
                    <Dropdown>
                        <Dropdown.Toggle variant="success">Sort By</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={sortByName}>{sortName ? 'Name (Z-A)' : 'Name (A-Z)'}</Dropdown.Item>
                            {/* <Dropdown.Item onClick={sortByStatus}>{sortStatus ? 'Status (High - Low)' : 'status (Low - High)'}</Dropdown.Item> */}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form.Group controlId="formGridState" style={{ width: 200, marginLeft: 10 }}>
                        <Form.Control as="select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            {filter.map((item, index) => {
                                return (
                                    <option key={index} value={item.id}>{item.name}</option>
                                )
                            })}
                        </Form.Control>
                    </Form.Group>
                </div>
                <div>
                    <Pagination style={{ marginLeft: 1600, marginTop: 50 }}>
                        <Pagination.Prev disabled={currentPage <= 0} onClick={() =>  setCurrentPage(currentPage - 1)} />
                        <Pagination.Next onClick={() =>  setCurrentPage(currentPage + 1)} />
                    </Pagination>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", padding: 50, flexDirection: 'row', justifyContent: 'center', marginTop: -40 }}>
                    {display}
                </div>
            </div>
        </div>
    )
}

export default AdminOrder