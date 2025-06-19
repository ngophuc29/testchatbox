import React, { useReducer } from 'react'
// useState

// 1. Init state: 0

// 2. Actions: Up (state + 1) / Down (state 1) -

// useReducer

// 1. Init state: 0

// 2. Actions: Up (state + 1)/ Down (state - 1)

// 3. Reducer

// 4. Dispatch

const initState = 0

const UP_ACTION = 'up'
const DOWN_ACTION = 'down'


const reducer = (state, action) => {

    switch (action) {
        case UP_ACTION:
            return state + 1
        case DOWN_ACTION:
            return state - 1
        default:
            throw new Error('Invalid Action')
    }

}
const UseReducer = () => {
    const [state, dispatch] = useReducer(reducer, initState);
    return (
        <div>UseReducer
            <h1>{state}</h1>
            <button
                onClick={() => {
                    dispatch(DOWN_ACTION)
                }}
            > giam</button>
            <button
                onClick={() => {
                    dispatch(UP_ACTION)
                }}>
                tang
            </button>
        </div>
    )
}

export default UseReducer