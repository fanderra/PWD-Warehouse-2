import React, { useState, useEffect } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { useDispatch } from 'react-redux'
import { editCart, keepLogin } from '../actions'
// import {keepLogin}from '../actions'

const c = {
    white: '#eceace',
    lightGreen: '#c8c6a7',
    green: '#92967d',
    blue: '#6e7c7c',
    blueDarker: '#435560',
}
export default function CartCard({ index, item = {} }) {
    const [edit, setEdit] = useState(false)
    const [editQty, setEditQty] = useState(0)
    const { id_product, image, price, qty, stock, name, id_order } = item
    const history = useHistory()
    const dispatch = useDispatch()
    useEffect(() => {
        if (qty !== editQty) setEditQty(qty)
    }, [qty])


    const handleSave = () => {
        if (editQty === qty) return setEdit(false)
        const editedData = { oldQty: qty, newQty: editQty, id_product, id_order }
        editCart(editedData, () => {
            setEdit(false)
            dispatch(keepLogin())
        })
    }
    const handleDelete = () => {
        const editedData = { oldQty: qty, newQty: 0, id_product, id_order }
        editCart(editedData, () => {
            setEdit(false)
            dispatch(keepLogin())
        })
    }

    return (
        <div id='cartCard' style={{ backgroundColor: c.blueDarker, width: '100%', height: '200px', padding: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flexBasis: '40%', gap: '20px' }}>
                <img onClick={() => history.push('/detail/' + id_product)} style={{ objectFit: 'contain', height: '100%', cursor: 'pointer', width: '100%', backgroundColor: c.white }} alt='items' src={'http://localhost:2000/' + image} />
                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                    <div>
                        <h2 style={{ color: c.white }}>{name}</h2>
                        <p style={{ color: c.white }}>
                            {(price * editQty).toLocaleString()} IDR
                        </p>
                        <div style={{ display: 'flex', minWidth: '50px', alignItems: 'center', margin: '15px 0' }}>
                            {edit ?
                                <>
                                    <Button onClick={() => setEditQty(p => p < 1 ? p : p - 1)} size='sm' variant='danger' style={{ borderRadius: 0 }}>-</Button>
                                    <Form.Control
                                        size="sm"
                                        type="number"
                                        value={editQty}
                                        onChange={i => {
                                            let { value } = i.target
                                            setEditQty(value <= 0 ? 1 : value > stock ? stock : value)
                                        }}
                                        style={{ borderRadius: 0, width: '70px', textAlign: 'center' }}
                                    />
                                    <Button onClick={() => setEditQty(p => p >= stock ? p : p + 1)} size='sm' variant='success' style={{ borderRadius: 0 }}>+</Button>
                                </>
                                :

                                <>
                                    <h6 style={{ color: c.white, marginRight: '10px', textJustify: 'center', }}>{editQty}pcs</h6>
                                </>
                            }
                        </div>
                    </div>
                    <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {edit ?
                            <>
                                <Button size='sm' variant='danger' onClick={() => {
                                    setEditQty(qty)
                                    setEdit(false)
                                }}>
                                    <i className="fa fa-ban" aria-hidden="true" style={{ color: 'white' }}></i>
                                </Button>
                                <Button onClick={handleSave} size='sm' variant='success' >
                                    <i className="fa fa-save" aria-hidden="true" style={{ color: 'white' }}></i>
                                </Button>
                            </>
                            :
                            <>
                                <Button onClick={handleDelete} size='sm' variant='danger' >
                                    <i className="fa fa-trash" aria-hidden="true" style={{ color: 'white' }}></i>
                                </Button>
                                <Button size='sm' variant='success' onClick={() => setEdit(true)}>
                                    <i className="fa fa-pen" aria-hidden="true" style={{ color: 'white' }}></i>
                                </Button>
                            </>
                        }
                        {/* </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
