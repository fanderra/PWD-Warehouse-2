import React from 'react'
import Axios from 'axios'
import { Button, Modal, Card } from 'react-bootstrap'

const Product = () => {
    const [data, setData] = React.useState([])
    
    React.useEffect(() => {
        Axios.post('http://localhost:2000/product/showAll')
        .then((res) => setData(res.data))
        .catch(err => console.log(err))
    }, [])
    
    return (
        <div>
            <div style={{ display: "flex", flexWrap: "wrap", padding: 20, justifyContent: "center" }}>
                {data.map((item, index) => {
                    return (
                        <Card key={index} style={{margin: 10, textAlign: "center"}}>
                            <Card.Img style={{width: 250}} src="https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/804/0780479_PE759996_S5.jpg"/>
                            <Card.Body>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text>IDR {Intl.NumberFormat('in-ID', { currency: 'IDR', style: 'decimal' }).format(item.price)}</Card.Text>
                            </Card.Body>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}

export default Product