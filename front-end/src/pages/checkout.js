import React from 'react'
import { InputGroup, FormControl, Button, Modal, Form, Tab, Row, Col, ListGroup } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, Link } from 'react-router-dom'
import { postAddress, keepLogin, deleteAddress, checkoutCart, changeDataAddress } from "../actions";
import Maps from '../components/maps'

const Checkout = () => {
    const [show, setShow] = React.useState(false)
    const [cordinates, setCordinates] = React.useState({ city: '', postal_code: null })
    const [newAddress, setNewAddress] = React.useState({ address_detail: '', label: '' })
    const [errorMessage, setErrorMessage] = React.useState('')
    const [disButton, setDisButton] = React.useState(true)
    const [add, setAdd] = React.useState(false)
    const [changeAddress, setChangeAddress] = React.useState(false)
    const [value, setValue] = React.useState('TRANSFER')
    const [listShipment, setListShipment] = React.useState('20000')
    const [errPayment, setErrPayment] = React.useState([false, ''])
    const [errAddress, setErrAddress] = React.useState([false, ''])
    const [errShipment, setErrShipment] = React.useState([false, ''])

    const { cart, address, id_user } = useSelector((state) => {
        return {
            cart: state.user.cart,
            address: state.user.address,
            id_user: state.user.id_user,
        }
    })
    console.log(cart)
    console.log(address)


    const dispatch = useDispatch()

    const handleChange = ({ target: { name, value } }) => {
        setNewAddress(p => ({ ...p, [name]: value.slice(0, 200) }))
        setErrorMessage('')
    }

    const handleCancel = () => {
        setCordinates({ city: '', postal_code: null })
        setNewAddress({ address_detail: '', label: '' })
        setErrorMessage('')
        setAdd(false)
        setChangeAddress(false)
    }

    const handleCheck = (val) => {
        setValue(val.target.value)
        // setErrPayment([false, ''])
    }
    const handleList = (val) => {
        setListShipment(val.target.value)
        // setErrShipment([false, ''])
    }
    const handleAddAddress = () => {
        const allAddressData = { ...newAddress, ...cordinates, id_user }

        if (Object.values(allAddressData).some(i => !i)) return setErrorMessage('all input can noy be empty')
        postAddress(allAddressData, err => {
            if (err) return setErrorMessage(err)
            handleCancel()
            dispatch(keepLogin())
        })
    }

    const handleChangeAddress = () => {
        const id_address = address[0].id_address
        const allAddressData = { ...newAddress, ...cordinates, id_user, id_address }
        if (Object.values(allAddressData).some(i => !i)) return setErrorMessage('all input can noy be empty')
        changeDataAddress(allAddressData, err => {
            if (err) return setErrorMessage(err)
            handleCancel()
            dispatch(keepLogin())
        })
    }

    const history = useHistory()

    const handlePayment = () => {
        const address_detail = address[0].address_detail
        const lat = address[0].lat
        const lng = address[0].lng
        const city = address[0].city
        const postal_code = address[0].postal_code
        const payment_method = value
        const shipment_fee = +listShipment
        const id_order = cart[0].id_order
        const allDataPayment = { address_detail, lat, lng, city, postal_code, payment_method, shipment_fee, id_order }
        // if (!address_detail || !lat || !lng || !city || !postal_code) return setErrAddress([true, 'please check your address'])
        console.log(allDataPayment)
        // console.log(id_order)
        // console.log(address_detail)

        checkoutCart(allDataPayment, data => history.replace(`/payment/` + data))
        // history.push(`/payment/:${id_order}`)
    }

    React.useEffect(() => {
        if (address.length === 1) return setDisButton(false)
    }, [address])
    // if(address.length === 1) return setDisButton(false)
    return (
        <div style={{ backgroundColor: 'lightgrey', height: 980, display: "flex"}}>
            <div>
                <div
                    style={{
                        backgroundColor: 'white',
                        marginTop: '6%',
                        width: 'auto',
                        marginLeft: 650,
                        marginRight: 650,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 15,
                        border: '2px black solid',
                        borderRadius: 10
                    }}
                >
                    <div>
                        <p style={{ textAlign: 'center', fontSize: 25 }} > Checkout </p>
                        <p style={{ marginBottom: 5, paddingLeft: 10 }}> Order summary </p>
                    </div>
                    <div style={{ width: '95%', alignSelf: 'center' }}>
                        {cart.map((item, index) => {
                            return (
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} key={index}>
                                    <h6>{item.name}</h6>
                                    <span>Rp {(item.price * item.qty).toLocaleString()}</span>
                                </div>
                            )
                        })}
                    </div>
                    <div style={{ borderBottom: '2px solid grey', width: '500px', alignSelf: 'center', marginTop: 10, marginBottom: 10 }}></div>
                    <div style={{ marginBottom: 10 }}>
                        <div> Payment method </div>
                    </div>
                    <div style={{ width: '95%', alignSelf: 'center' }}>
                        <Form.Group controlId="exampleForm.ControlSelect1"  >
                            <Form.Control as="select" value={value} onChange={handleCheck}>
                                <option value='TRANSFER'>Transfer</option>
                                <option value='COD'>COD</option>
                            </Form.Control>
                        </Form.Group>
                    </div>
                    <div style={{ borderBottom: '2px solid grey', width: '500px', alignSelf: 'center', marginBottom: 10 }}></div>
                    <div> Shipment fee <small>{errShipment[1]}</small></div>
                    <Form.Group controlId="exampleForm.ControlSelect1" >
                        <Form.Control as="select" value={listShipment} onChange={handleList}>
                            <option value='20000'>Express Rp 20.000</option>
                            <option value='10000'>Reguler Rp 10.000</option>
                        </Form.Control>
                    </Form.Group>
                    <div style={{ borderBottom: '2px solid grey', width: '500px', alignSelf: 'center', marginBottom: 10 }}></div>
                    <div>
                        <p>Shipping Address</p>
                        {add ?
                            (
                                <Form style={{ width: '400px', padding: '20px 20px 10px 20px', }}>
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                        <Form.Label>Label</Form.Label>
                                        <Form.Control onChange={handleChange} value={newAddress.label} name='label' size='sm' type="text" placeholder="Home/Apartment..." />
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>Address Detail</Form.Label>
                                        <Form.Control style={{ minHeight: '100px', maxHeight: '200px' }} onChange={handleChange} value={newAddress.address_detail} name='address_detail' size='sm' as="textarea" placeholder='Address detail' />
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlInput133">
                                        <Form.Label>City & Postal Code</Form.Label>
                                        <div onClick={() => setShow(true)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                            <Form.Control size='sm' type="email" placeholder={cordinates.city || 'City'} readOnly />
                                            <Form.Control size='sm' type="email" placeholder={cordinates.postal_code || 'Postal Code'} readOnly />
                                        </div>
                                    </Form.Group>
                                    <Form.Text style={{ color: 'red' }}>
                                        {errorMessage}
                                    </Form.Text>
                                    <Form.Group style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                                        <Button onClick={() => setShow(true)} size='sm'>Select Postal code</Button>
                                        <div>
                                            <Button style={{ borderRadius: '3px 0 0 3px' }} onClick={handleCancel} variant='danger' size='sm'>Cancel</Button>
                                            <Button onClick={handleAddAddress} style={{ borderRadius: '0 3px 3px 0' }} variant='success' size='sm'>Add</Button>
                                        </div>
                                    </Form.Group>
                                </Form>
                            )
                            :
                            <div></div>
                        }
                        {address.length !== 0 ?
                            (
                                <>
                                    <a onClick={() => setChangeAddress(true)} style={{ fontSize: 13, cursor: 'pointer', marginLeft: 450, color: 'blue', marginTop: -50 }}>change address</a>
                                    <a style={{ display: 'flex', width: '100%' }}>
                                        <div style={{ height: '90px', width: 300, border: '1px solid #435560', boxShadow: '0 0 2px 1px black', borderRadius: '3px', padding: '0 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            {address.map((item, index) => {
                                                const { label, city, postal_code, address_detail, id_address } = item
                                                return (
                                                    <>
                                                        <h4 style={{ fontWeight: '400' }}>{label}</h4>
                                                        <p>
                                                            {city},{postal_code} <br />
                                                            {address_detail}
                                                        </p>
                                                    </>
                                                )
                                            })}
                                        </div>
                                    </a>
                                </>
                            )
                            :
                            <a onClick={() => setAdd(true)} style={{ fontSize: 13, cursor: 'pointer', color: 'blue' }}> Add Address</a>
                        }
                        {changeAddress ?
                            (
                                <Form style={{ width: '400px', padding: '20px 20px 10px 20px', }}>
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                        <Form.Label>Label</Form.Label>
                                        <Form.Control onChange={handleChange} value={newAddress.label} name='label' size='sm' type="text" placeholder="Home/Apartment..." />
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>Address Detail</Form.Label>
                                        <Form.Control style={{ minHeight: '100px', maxHeight: '200px' }} onChange={handleChange} value={newAddress.address_detail} name='address_detail' size='sm' as="textarea" placeholder='Address detail' />
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlInput133">
                                        <Form.Label>City & Postal Code</Form.Label>
                                        <div onClick={() => setShow(true)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                            <Form.Control size='sm' type="email" placeholder={cordinates.city || 'City'} readOnly />
                                            <Form.Control size='sm' type="email" placeholder={cordinates.postal_code || 'Postal Code'} readOnly />
                                        </div>
                                    </Form.Group>
                                    <Form.Text style={{ color: 'red' }}>
                                        {errorMessage}
                                    </Form.Text>
                                    <Form.Group style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                                        <Button onClick={() => setShow(true)} size='sm'>Select Postal code</Button>
                                        <div>
                                            <Button style={{ borderRadius: '3px 0 0 3px' }} onClick={handleCancel} variant='danger' size='sm'>Cancel</Button>
                                            <Button onClick={handleChangeAddress} style={{ borderRadius: '0 3px 3px 0' }} variant='success' size='sm'>Add</Button>
                                        </div>
                                    </Form.Group>
                                </Form>
                            ) :
                            <div></div>
                        }
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
                        <Button variant="outline-danger" as={Link} to='/cart'>Back to cart</Button>
                        <Button variant="outline-success" onClick={() => handlePayment()} disabled={disButton}>Continue to payment</Button>
                    </div>
                </div>
                <Maps show={show} setShow={() => setShow(false)} setUserCordinates={setCordinates} />
            </div>
        </div>
    )
}

export default Checkout