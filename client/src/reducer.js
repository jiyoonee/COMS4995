export const initialState = {
    user: null,
    token: null,
    recs: []
}

const reducer = (state, action) => {
    console.log(action)

    // Action -> type, [payload]

    switch(action.type) {
        case 'SET_USER':
          return {
              ...state,
              user: action.user 
          }
        case 'SET_TOKEN':
          return {
              ...state, 
              token: action.token
          }
        default:
          return state
    }
}

export default reducer;