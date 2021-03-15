const INITIAL_STATE = {
    id_user: null,
    username: '',
    password: '',
    id_status: 1
}

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'LOGOUT':
            return INITIAL_STATE
        default:
            return state
    }
}

export default userReducer