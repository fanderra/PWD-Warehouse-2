import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Badge, Button, Form, OverlayTrigger, Popover, } from 'react-bootstrap'
import { postAddress, keepLogin, deleteAddress, sendVerificationEmail, editAddress } from "../actions";
import AlertModal from '../components/alertModal'
import Maps from '../components/maps'
import { Redirect } from 'react-router';
import AddressCard from '../components/addressCard';
export default function Profile() {
    const { username, address, email, id_user, id_status } = useSelector(state => state.user)
    const [errorMessage, setErrorMessage] = useState('')
    const [newAddress, setNewAddress] = useState({ address_detail: '', label: '' })
    const [show, setShow] = useState(false)
    const [add, setAdd] = useState(false)
    const [cordinates, setCordinates] = useState({ city: '', postal_code: null })
    const [newAddressDetail, setNewAddressDetail] = useState('')
    const [alertMessage, setAlertMessage] = useState('')
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
    }
    const handleDelete = (id_address) => {
        deleteAddress(id_address, err => {
            if (err) return alert(err)
            handleCancel()
            dispatch(keepLogin())
        })
    }

    const handleVerify = () => {
        sendVerificationEmail(username, msg => setAlertMessage(msg))
    }

    const handleAddAddress = () => {
        const allAddressData = { ...newAddress, ...cordinates, id_user }

        if (Object.values(allAddressData).some(i => !i)) return setErrorMessage('all input can not be empty')
        postAddress(allAddressData, err => {
            if (err) return setErrorMessage(err)
            handleCancel()
            dispatch(keepLogin())
        })
    }

    const handleSave = id_address => {
        console.log(id_address)
        if (!newAddressDetail) return setAlertMessage('input can not be empty')
        editAddress({ id_address, address_detail: newAddressDetail, id_user }, err => {
            if (err) return setAlertMessage(err)
            dispatch(keepLogin())
        })
    }

    const popover = (
        <Popover style={{ zIndex: 20 }} id="popover-basic">
            <Popover.Title as="h3">You are not verified</Popover.Title>
            <Popover.Content>
                <p>Verify your email address to access all the features</p>
                <Button size='sm' onClick={handleVerify} variant='success'>Verify !</Button>
            </Popover.Content>
        </Popover>
    );


    if (!username) return <Redirect to='/' />

    return (
        <div style={{ display: 'grid', placeItems: 'center', minHeight: '40vh' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', columnGap: '100px', padding: '50px 0' }}>
                <div style={{ display: 'grid', rowGap: '20px', height: '200px' }}>
                    <h2>Profile</h2>
                    <div style={{ height: '90px', border: '1px solid #435560', boxShadow: '0 0 2px 1px black', borderRadius: '3px', padding: '0 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ flexDirection: 'column', justifyContent: 'center' }}>
                            <h4 style={{ fontWeight: '400' }}>email</h4>
                            <p>{email}</p>
                        </div>
                        {id_status === 2 ?
                            <Badge variant='success'>verified</Badge>
                            :
                            <OverlayTrigger trigger={["hover", "focus"]} delay={{ hide: 3000 }} placement="right" overlay={popover}>
                                <Badge style={{ cursor: 'pointer' }} variant='danger'> not-verified</Badge>
                            </OverlayTrigger>
                        }
                    </div>
                    <div style={{ height: '90px', border: '1px solid #435560', boxShadow: '0 0 2px 1px black', borderRadius: '3px', padding: '0 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h4 style={{ fontWeight: '400' }}>username</h4>
                        <p>{username}</p>
                    </div>
                </div>
                <div style={{ display: 'grid', rowGap: '20px' }}>
                    <h2>Address</h2>
                    <div style={{ height: '350px', border: '1px solid #435560', boxShadow: '0 0 2px 1px black', borderRadius: '3px', padding: '10px', display: 'flex', flexDirection: 'column', overflowY: 'scroll', }}>
                        {
                            address.map((item, index) => {
                                return (
                                    <AddressCard
                                        key={index}
                                        item={item}
                                        handleSave={handleSave}
                                        handleDelete={handleDelete}
                                        newAddressDetail={newAddressDetail}
                                        setNewAddressDetail={setNewAddressDetail}
                                    />
                                )
                            })
                        }
                        {address.length <= 3 &&
                            add ? (
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
                        ) :
                            <Button size='sm' style={{ marginTop: '15px' }} onClick={() => setAdd(true)} variant='success'>Add New Address</Button>
                        }
                    </div>
                </div>
            </div>
            <AlertModal message={alertMessage} setShow={() => setAlertMessage('')} />
            <Maps show={show} setShow={() => setShow(false)} setUserCordinates={setCordinates} />
        </div>
    )
}


