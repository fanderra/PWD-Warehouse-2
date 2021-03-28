import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Badge, Button, Form, OverlayTrigger, Popover, ButtonGroup } from 'react-bootstrap'
import { postAddress, keepLogin, deleteAddress, editAddress, uploadProfilePicture, deleteProfilePicture } from "../actions";
import AlertModal from '../components/alertModal'
import Maps from '../components/maps'
import { Redirect } from 'react-router';
import noProfile from '../assets/no-profile.png'
import AddressCard from '../components/addressCard';
export default function Profile() {
    const { username, address, email, id_user, id_status, profile_picture } = useSelector(state => state.user)
    const [errorMessage, setErrorMessage] = useState('')
    const [newAddress, setNewAddress] = useState({ address_detail: '', label: '' })
    const [show, setShow] = useState(false)
    const [add, setAdd] = useState(false)
    const [cordinates, setCordinates] = useState({ city: '', postal_code: null })
    const [newAddressDetail, setNewAddressDetail] = useState('')
    const [alertMessage, setAlertMessage] = useState('')
    const fileRef = useRef()
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

    const handleProfPict = e => {
        const formData = new FormData()
        formData.append('IMG', e.target.files[0])
        formData.append('id_user', id_user)
        uploadProfilePicture(formData, () => dispatch(keepLogin()))
    }

    const handleDeleteProfPict = () => {
        deleteProfilePicture(id_user, () => dispatch(keepLogin()))
    }

    const handleAddAddress = () => {
        const allAddressData = { ...newAddress, ...cordinates, id_user }

        if (Object.values(allAddressData).some(i => !i)) return setErrorMessage('Input label and/or address detail')
        postAddress(allAddressData, err => {
            if (err) return setErrorMessage(err)
            handleCancel()
            dispatch(keepLogin())
        })
    }

    const handleSave = id_address => {
        console.log(id_address)
        if (!newAddressDetail) return setAlertMessage('Input label and/or address detail')
        editAddress({ id_address, address_detail: newAddressDetail, id_user }, err => {
            if (err) return setAlertMessage(err)
            dispatch(keepLogin())
        })
    }

    const popover = (
        <Popover style={{ zIndex: 20 }} id="popover-basic">
            <Popover.Title as="h3" style={{textAlign: "center"}}>Your email is not verified</Popover.Title>
            <Popover.Content>
                <p>Verify your email address to access all features</p>
            </Popover.Content>
        </Popover>
    );


    if (!username) return <Redirect to='/' />

    return (
        <div style={{ display: 'grid', placeItems: 'center', minHeight: '40vh', backgroundColor: "lightgrey" }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', columnGap: '100px', backgroundColor: "white", border: "1px solid grey", padding: 30, marginTop: 100, borderRadius: 5, width: 900, marginBottom: 110 }}>
                <div style={{ display: 'grid', rowGap: '20px', height: '200px' }}>
                    <h2>Profile</h2>
                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }} >
                        <img src={profile_picture ? 'http://localhost:2000/' + profile_picture : noProfile} style={{ width: '100px', borderRadius: '5px', border: '1px solid #435560', height: '100px', objectFit: 'cover', }} alt="" />
                        <ButtonGroup>
                            <Button onClick={() => fileRef.current.click()} variant='info'>Change Profile</Button>
                            {
                                profile_picture &&
                                <Button onClick={handleDeleteProfPict} variant='danger'>
                                    <i className='fa fa-trash' ></i>
                                </Button>
                            }
                        </ButtonGroup>
                        <input ref={fileRef} type='file' accept='image/*' onChange={handleProfPict} style={{ display: 'none', pointerEvents: 'none' }} />
                    </div>
                    <div style={{ height: '90px', border: '1px solid lightgrey', boxShadow: '0 0 2px 1px lightgrey', borderRadius: 5, padding: '0 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ flexDirection: 'column', justifyContent: 'center' }}>
                            <h4 style={{ fontWeight: '400', marginTop: 10, marginLeft: 5 }}><u>Email</u></h4>
                            <p style={{marginLeft: 5}}>{email}</p>
                        </div>
                        {id_status === 2 ?
                            <Badge style={{ marginRight: 15}} variant='success'>Verified</Badge>
                            :
                            <OverlayTrigger trigger={["hover", "focus"]} delay={{ hide: 500 }} placement="right" overlay={popover}>
                                <Badge style={{ cursor: 'pointer', marginRight: 15 }} variant='danger'>Not Verified</Badge>
                            </OverlayTrigger>
                        }
                    </div>
                    <div style={{ height: '90px', border: '1px solid lightgrey', boxShadow: '0 0 2px 1px lightgrey', borderRadius: 5, padding: '0 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h4 style={{ fontWeight: '400', marginTop: 10, marginLeft: 5 }}><u>Username</u></h4>
                        <p style={{marginLeft: 5}}>{username}</p>
                    </div>
                </div>
                <div style={{ display: 'grid', rowGap: '20px' }}>
                    <h2>Address</h2>
                    <div style={{ height: '420px', border: '1px solid lightgrey', boxShadow: '0 0 2px 1px lightgrey', borderRadius: 5, padding: '10px', display: 'flex', flexDirection: 'column', overflowY: 'scroll' }}>
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
                            <Form style={{ padding: '20px 20px 10px 20px', }}>
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
                                    <Button variant="info" onClick={() => setShow(true)} size='sm'>Select Postal code</Button>
                                    <div>
                                        <Button style={{ borderRadius: '3px 0 0 3px' }} onClick={handleCancel} variant='outline-danger' size='sm'>Cancel</Button>
                                        <Button onClick={handleAddAddress} style={{ borderRadius: '0 3px 3px 0' }} variant='outline-success' size='sm'>Add</Button>
                                    </div>
                                </Form.Group>
                            </Form>
                        ) : address.length === 0 ?
                            <Button size='sm' style={{ marginTop: '15px' }} onClick={() => setAdd(true)} variant='info'>Add New Address</Button>
                            :
                            <></>
                        }
                    </div>
                </div>
            </div>
            <AlertModal message={alertMessage} setShow={() => setAlertMessage('')} />
            <Maps show={show} setShow={() => setShow(false)} setUserCordinates={setCordinates} />
        </div>
    )
}


