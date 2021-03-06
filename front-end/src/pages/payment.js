import React,{useEffect,useRef,useState} from 'react'
import { useParams,useHistory,Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import AlertModal from '../components/alertModal'
import { getPayment, confirmPayment} from '../actions/orderAction'
export default function Payment() {
    const { id_order } = useParams()
    const { id_user } = useSelector(state => state.user)
    const [image, setImage] = useState({})
    const [paymentData,setPaymentData] = useState({})
    const [alertMessage,setAlertMessage] = useState('')
    const fileRef = useRef()
    const history = useHistory()
    
    useEffect(() => {
        if (id_user) {
            getPayment(id_order, data => {
                console.log(data)
                if (!data.payment_method || +data.id_user !== +id_user||+data.id_order_status!==2) return history.replace('/')
                setPaymentData(data)
            })
        }
    }, [id_order, id_user, history, image])
    
    const handleUpload = () => {
        const formData = new FormData()
        formData.append('IMG', image)
        formData.append('id_order', id_order)
        confirmPayment(formData, () => setAlertMessage('Your payment has been received. Thank you!'))
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
        <div style={{ height: 757, display: 'grid', placeItems: 'center', gridTemplateColumns: '1fr 1fr', backgroundColor: "lightgrey" }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', height: '450px', padding: '20px', borderRadius: 5, backgroundColor: "white"}}>
                <h1 style={{fontWeight: '400'}}>IKIYA INDONESIA</h1>
                <img style={{height:'50px'}} src="https://image.cermati.com/v1428073854/brands/avqoa9rfng8bklutfhm6.jpg" alt="bca" />
                <h3 style={{fontWeight: '400'}}>123456789012345</h3>
                <h3 style={{ fontWeight: '400' }}>Amount : ${paymentData.total.toLocaleString()}</h3>
            <form encType="multipart/form-data">
                <input accept='image/*' style={{ display: 'none', pointerEvents: 'none' }} onChange={i => setImage(i.target.files[0])} type="file" ref={fileRef} />
                <Button variant='info' onClick={()=>fileRef.current.click()}>Upload My Payment Approvals</Button>
            </form>
            </div>
            { image.name &&
            <div style={{ display: 'flex', flexDirection: 'column', padding: '20px', height: '450px',justifyContent: 'space-evenly', borderRadius: 5, backgroundColor: "white"}}>
                <img style={{height:'300px',margin:'20px',width:'250px',objectFit:'contain'}} src={URL.createObjectURL(image)} alt="payment"/> 
                <Button variant='info' onClick={handleUpload}>Upload</Button>
            </div>
            }
            <AlertModal message={alertMessage} setShow={() => {
                setAlertMessage('')
                setImage({})
            }} />
        </div>
    )
}
