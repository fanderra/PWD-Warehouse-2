const INITIAL_STATE = {
    id_user: null,
    username: '',
    id_status: null,
    id_role: null,
    address: [],
    cart: []
}

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                ...payload
            }
        case 'LOGOUT':
            return INITIAL_STATE
        case 'VERIFICATION' : 
            return {
                ...state,
                id_status : 2
            }
        case 'LOGOUT':
            return INITIAL_STATE
        default:
            return state
    }
}

export default userReducer