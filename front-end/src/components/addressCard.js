import React, { useState } from 'react'

import { Button, ButtonGroup, Form, } from 'react-bootstrap'

export default function AddressCard({ item = {}, newAddressDetail, setNewAddressDetail, handleDelete, handleSave }) {
    const [edit, setEdit] = useState(false)
    const { label, city, postal_code, address_detail, id_address } = item
    return (
        <div style={{ borderBottom: '1px solid #435560', width: '400px', padding: '20px', }}>
            <h4 style={{ fontWeight: '400' }}>{label}</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                <div style={{ width: '100%' }}>
                    <p style={{ margin: 0, marginBottom: '5px' }}>
                        {city},{postal_code}
                    </p>
                    {
                        edit ?
                            <Form.Control style={{ minHeight: '50px', maxHeight: '100px' }} value={newAddressDetail} onChange={e => setNewAddressDetail(e.target.value.slice(0,200))} placeholder='address detail' as='textarea' /> :
                            <p style={{ overflowY: 'scroll', maxHeight: '100px', width: '100%' }}>
                                {address_detail}
                            </p>
                    }
                </div>
                {edit ?
                    <ButtonGroup>
                        <Button onClick={() => setEdit(false)} size='sm' variant='danger'>
                            <i className='fa fa-minus'></i>
                        </Button>
                        <Button onClick={() => {
                            handleSave(id_address)
                            setEdit(false)
                        }} size='sm' variant='success'>
                            <i className='fa fa-save'></i>
                        </Button>
                    </ButtonGroup> :
                    <ButtonGroup >
                        <Button onClick={() => handleDelete(id_address)} size='sm' variant='danger'>
                            <i className='fa fa-trash'></i>
                        </Button>
                        <Button onClick={() => {
                            setEdit(true)
                            setNewAddressDetail(address_detail)
                        }} size='sm' variant='success'>
                            <i className='fa fa-pen'></i>
                        </Button>
                    </ButtonGroup>
                }
            </div>
        </div>
    )
}