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
    }, [])

    return (
        <div>
            {status === 2
                ?
                <>
                    <h3>Your account has been verified</h3>
                    <Button as={Link} to='/'>
                        Go to Home
                    </Button>
                </>
                :
                <>
                    <h2>Waiting for verification...</h2>
                    <h3>Open your email to verify this account</h3>
                </>
            }
        </div>
    )
}

export default Verification