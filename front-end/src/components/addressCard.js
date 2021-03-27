import React, { useState } from 'react'

import { Button, ButtonGroup, Form, } from 'react-bootstrap'

export default function AddressCard({ item = {}, newAddressDetail, setNewAddressDetail, handleDelete, handleSave }) {
    const [edit, setEdit] = useState(false)
    const { label, city, postal_code, address_detail, id_address } = item
    return (
        <div style={{ borderBottom: '1px solid #435560', padding: '20px', display: "flex" }}>
            <div style={{ width: 600}}>
                <h4>{label}</h4>
                <p>{city}, {postal_code}</p>
                {edit ?
                    <Form.Control value={newAddressDetail} onChange={e => setNewAddressDetail(e.target.value.slice(0,200))} placeholder='Address detail' as='textarea' />
                    :
                    <div style={{ width: 200 }}><p style={{ overflowY: 'scroll', maxHeight: '100px' }}> {address_detail} </p></div>
                }
            </div>
            <div style={{marginTop: 35}}>
                {edit ?
                    <ButtonGroup>
                        <Button onClick={() => setEdit(false)} variant='danger'>
                            <i className='fa fa-minus'></i>
                        </Button>
                        <Button onClick={() => {
                            handleSave(id_address)
                            setEdit(false)
                        }} variant='success'>
                            <i className='fa fa-save'></i>
                        </Button>
                    </ButtonGroup> 
                :
                    <ButtonGroup >
                        <Button onClick={() => handleDelete(id_address)} variant='danger'>
                            <i className='fa fa-trash'></i>
                        </Button>
                        <Button onClick={() => {
                            setEdit(true)
                            setNewAddressDetail(address_detail)
                        }} variant='success'>
                            <i className='fa fa-pen'></i>
                        </Button>
                    </ButtonGroup>
                }
            </div>
        </div>
    )
}