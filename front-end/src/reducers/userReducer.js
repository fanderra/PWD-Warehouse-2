const INITIAL_STATE = {
    id_user: null,
    username: '',
    id_status: null,
    id_role: null,
    address: [],
    cart: [],
    profile_picture:''
}

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                ...action.payload
            }
        case 'LOGOUT':
            return INITIAL_STATE
        case 'VERIFICATION' : 
            return {
                ...state,
                id_status : 2
            }
        default:
            return state
    }
}

export default userReducer