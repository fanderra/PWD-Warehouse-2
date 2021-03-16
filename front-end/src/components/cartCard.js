import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
const c = {
    white: '#eceace',
    lightGreen: '#c8c6a7',
    green: '#92967d',
    blue: '#6e7c7c',
    blueDarker: '#435560',
}
export default function CartCard({index,item={}}) {
    const [edit, setEdit] = useState(false)
    const [editQty,setEditQty]=useState(0)
    const stock=10
    const {}=item

    const handleSave = () => {
        
    }

    return (
        <div id='cartCard' style={{ backgroundColor: c.blueDarker, width: '100%', height: '200px', padding: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flexBasis: '40%', gap: '20px' }}>
                <img style={{ objectFit: 'contain', height: '100%', width: '100%', backgroundColor: c.white }} alt='items' src='http://localhost:2000/images/products/FORVAR_1.jpg' />
                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                    <div>
                        <h2 style={{ color: c.white }}>Forvak</h2>
                        <p style={{ color: c.white }}>
                            100,000 IDR
                        </p>
                        <div style={{ display: 'flex', minWidth: '50px', alignItems: 'center' }}>
                            {edit ?
                                <>
                                    <Button  onClick={()=>setEditQty(p=>p<=1?p:p-1)} size='sm' variant='danger' style={{ borderRadius: 0 }}>-</Button>
                                    <Form.Control
                                        size="sm"
                                        type="number"
                                        value={editQty}
                                        onChange={i => {
                                            let {value} = i.target
                                            setEditQty(value<=0?1:value>stock?stock:value)
                                        }}
                                        style={{ borderRadius: 0, width: '70px', textAlign: 'center' }}
                                    />
                                    <Button onClick={()=>setEditQty(p=>p>=stock?p:p+1)} size='sm' variant='success' style={{ borderRadius: 0 }}>+</Button>
                                </>
                                :

                                <>
                                    <h6 style={{ color: c.white, marginRight: '10px', textJustify: 'center', }}>20pcs</h6>
                                </>
                            }
                        </div>
                    </div>
                    <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Button size='sm' variant='outline-dark' >
                            <i className="fa fa-trash" aria-hidden="true" style={{ color: 'white' }}></i>
                        </Button>
                        <div style={{ display: 'flex', height: '100%', minWidth: '50px', alignItems: 'center' }}>
                            {edit ?
                                <>
                                    <Button onClick={handleSave} style={{ width: '40px', borderRadius: 0 }} size='sm' variant='success' >
                                        <i className="fa fa-save" aria-hidden="true" style={{ color: 'white' }}></i>
                                        </Button>
                                    <Button style={{ width: '40px', borderRadius: 0 }} size='sm' variant='danger' onClick={() => setEdit(false)}>
                                        <i className="fa fa-ban" aria-hidden="true" style={{ color: 'white' }}></i>
                                        </Button>
                                </>
                                :
                                <Button size='sm' variant='success' onClick={() => setEdit(true)}>
                                    <i className="fa fa-pen" aria-hidden="true" style={{ color: 'white' }}></i>
                                    </Button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
