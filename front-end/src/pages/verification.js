import React from 'react'
import Axios from 'axios'
import { Link, Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { verificationEmail } from '../actions'

import {
    Button
} from 'react-bootstrap'

const Verification = () => {
    const [verified, setVerified] = React.useState(false)
    const dispatch = useDispatch()

    const { status } = useSelector((state) => {
        return {
            status: state.user.id_status
        }
    })

    React.useEffect(() => {
        const token = window.location.search.substring(1)
        dispatch(verificationEmail(token))
    }, [])

    return (
        <div>
            {status === 2
                ?
                <>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 300}}>
                        <h1>Your account has been verified</h1>
                        <h2>Happy Shopping!</h2>
                        <Button variant='success' as={Link} to='/' style={{width: 200,marginTop: 50}}>
                            Shopping Now
                        </Button>
                    </div>
                </>
                :
                <>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 300}}>
                        <h2>Waiting for verification...</h2>
                        <h3>Open your email to verify this account</h3>
                    </div>
                </>
            }
        </div>
    )
}

export default Verification