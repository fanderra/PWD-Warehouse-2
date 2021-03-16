import React from 'react'
import { Button } from 'react-bootstrap'
import CartCard from '../components/cartCard'
const c = {
    white:'#eceace',
    lightGreen:'#c8c6a7',
    green: '#92967d',
    blue:'#6e7c7c',
    blueDarker:'#435560',
}
export default function Cart() {
    return (
        <div style={{ display: 'grid', padding: '20px 20px 100px 20px',gridTemplateColumns:'repeat(auto-fit,400px)' ,gap:'20px'}}>
            {[1].map((item, index) => <CartCard key={index} item={item}/>)}
            <div
                style={{
                    position: 'fixed',
                    backgroundColor: c.blueDarker,
                    height: '80px',
                    left: 0, right: 0, bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 50px',
                    justifyContent: 'space-between'
                }}
            >
                <h2 style={{color:c.white}}>50000</h2>
                <Button variant='success'>Checkout</Button>
        </div>
        </div>
    )
}
