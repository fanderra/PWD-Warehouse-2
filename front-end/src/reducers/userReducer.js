const INITIAL_STATE = {
    id_user: null,
    username: '',
    email: '',
    password: '',
}

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                id_user: action.payload.id_user,
                username: action.payload.username,
                email: action.payload.email,
                password: action.payload.password
            }
        case 'LOGOUT':
            return INITIAL_STATE
        default:
            return state
    }
}

export default userReducer