import React,{useEffect,useRef,useState} from 'react'
import { useParams,useHistory,Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {Button} from 'react-bootstrap'
import { getPayment, confirmPayment} from '../actions/orderAction'
export default function Payment() {
    const { id_order } = useParams()
    const { id_user } = useSelector(state => state.user)
    const [image, setImage] = useState({})
    const [paymentData,setPaymentData] = useState({})
    const fileRef = useRef()
    const history = useHistory()
    
    useEffect(() => {
        if (id_user) {
            getPayment(id_order, data => {
                console.log(data)
                if (!data.payment_method || data.id_user !== id_user||data.id_order_status!==2) return history.replace('/')
                setPaymentData(data)
            })
        }
    }, [id_order, id_user, history, image])
    
    const handleUpload = () => {
        const formData = new FormData()
        formData.append('IMG', image)
        formData.append('id_order', id_order)
        confirmPayment(formData, () => setImage({}))
    }

    if(!paymentData.payment_method) return <div></div>

    if (paymentData.payment_method === 'COD') return (
        <div style={{display: 'grid',placeItems: 'center',height:'60vh'}}>
            <div style={{ display: 'flex',flexDirection: 'column',alignItems: 'center'}}>
                <h2>Your order will be processed</h2>
                <Link style={{fontSize:'20px'}} to='/'>Back to Home</Link>
            </div>
        </div>
    )

    return (
        <div style={{ height: '70vh', display: 'grid', placeItems: 'center', margin: '40px 0', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{display:'flex',flexDirection: 'column',justifyContent: 'space-evenly',alignItems: 'center',height:'450px',padding:'20px',border:'2px solid #435560'}}>
                <h1 style={{fontWeight: '400'}}>IKIYA INDONESIA</h1>
                <img style={{height:'50px'}} src="https://image.cermati.com/v1428073854/brands/avqoa9rfng8bklutfhm6.jpg" alt="bca" />
                <h3 style={{fontWeight: '400'}}>123456789012345</h3>
                <h3 style={{ fontWeight: '400' }}>Amount : {paymentData.total.toLocaleString()} IDR</h3>
            <form encType="multipart/form-data">
                <input accept='image/*' style={{ display: 'none', pointerEvents: 'none' }} onChange={i => setImage(i.target.files[0])} type="file" ref={fileRef} />
                <Button variant='dark' onClick={()=>fileRef.current.click()}>Upload My Payment Approvals</Button>
            </form>
            </div>
            { image.name &&
            <div style={{ display: 'flex', flexDirection: 'column', border: '2px solid #435560', padding: '20px', height: '450px',justifyContent: 'space-evenly'}}>
                <img style={{height:'300px',margin:'20px',width:'250px',objectFit:'contain'}} src={URL.createObjectURL(image)} alt="payment"/> 
                <Button variant='dark' onClick={handleUpload}>Upload</Button>
            </div>
            }
        </div>
    )
}
