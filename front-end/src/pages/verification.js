import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { verificationEmail } from '../actions'

import {
    Button
} from 'react-bootstrap'

const Verification = () => {
    // const [verified, setVerified] = React.useState(false)
    const dispatch = useDispatch()

    const { status } = useSelector((state) => {
        return {
            status: state.user.id_status
        }
    })

    React.useEffect(() => {
        const token = window.location.search.substring(1)
        dispatch(verificationEmail(token))
    }, [dispatch])

    return (
        <div>
            {status === 2
                ?
                <>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 300}}>
                        <h1>Your account has been verified</h1>
                        <h2>Happy Shopping!</h2>
                        <Button variant='info' as={Link} to='/' style={{width: 200,marginTop: 50}}>
                            Shop Now!
                        </Button>
                    </div>
                </>
                :
                <>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 300}}>
                        <h2>Waiting for verification...</h2>
                        <h3>A verification link has been sent to your email account</h3>
                    </div>
                </>
            }
        </div>
    )
}

export default Verification