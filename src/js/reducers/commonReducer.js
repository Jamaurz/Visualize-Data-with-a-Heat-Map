export default function reducer(state={
    array: []
}, action) {

    if (action.type ==  "ADD_ARRAY") {
        return {
            ...state,
            array: [...state.array, action.payload],
        }
    }

    return state
}
