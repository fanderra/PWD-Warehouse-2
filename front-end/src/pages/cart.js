import React, { useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux'
import CartCard from '../components/cartCard'
import { keepLogin } from '../actions'
const c = {
    white: '#eceace',
    lightGreen: '#c8c6a7',
    green: '#92967d',
    blue: '#6e7c7c',
    blueDarker: '#435560',
}
export default function Cart() {
    const { cart, username } = useSelector(state => state.user)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(keepLogin())
    }, [])
    if (!username) return <Redirect to='/' />
    console.log('cart', cart)
    return (
        <div style={{ backgroundColor: "lightgrey", height: 700 }}>
            <div style={{ display: 'grid', padding: '20px 40px 100px 20px', gridTemplateColumns: 'repeat(auto-fit,400px)', gap: '50px', justifyContent: "center" }}>
                {cart.map((item, index) => <CartCard key={index} item={item} />)}
                <div
                    style={{
                        position: 'fixed',
                        backgroundColor: c.blueDarker,
                        height: '80px',
                        left: 0, right: 0, bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 50px',
                        justifyContent: 'space-between',
                        boxShadow: '0 -1px 5px 1px black'
                    }}
                >
                    {cart.length !== 0 ? 
                        <h2 style={{ color: "lightgrey", marginTop: 7 }}>TOTAL: ${cart.reduce((a, b) => a + (b.price * b.qty), 0).toLocaleString()}</h2>
                    :<></>}
                    {(cart.length > 0 && cart.every(itm => itm.qty <= itm.stock&&+itm.id_product_status===1)) && <Button style={{width: 500, height: 50}} as={Link} to='/checkout' variant='info'><div style={{marginTop: 6}}>Checkout</div></Button>}
                </div>
            </div>
            <Modal centered show={cart.length === 0}>
                <Modal.Header>OOPS!</Modal.Header>
                <Modal.Body>It seems that your cart is empty...</Modal.Body>
                <Modal.Footer>
                    <Button variant="info" as={Link} to="/">Look at IKIYA products!</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

//cart.every(itm=>itm.qty<=item.stock)