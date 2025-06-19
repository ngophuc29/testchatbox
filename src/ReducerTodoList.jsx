import React, { useReducer, useRef } from 'react'
// useReducer

// 1. Init state: 
const initState = {
    job: '',
    jobs: []
}

// 2. Actions: 
const SET_JOB = 'set_job'
const ADD_JOB = 'add_job'
const DELETE_JOB = 'delete_job'

const setJob = (payload) => {
    return {
        type: SET_JOB,
        payload
    }
}

const addjob = (payload) => {
    return {
        type: ADD_JOB,
        payload
    }
}
const deletejob = (payload) => {
    return {
        type: DELETE_JOB,
        payload
    }
}
// 3. Reducer

const reducer = (state, action) => {

    switch (action.type) {
        case SET_JOB:
            return {
                ...state,
                job: action.payload
            }
        case ADD_JOB:
            return {
                ...state,
                jobs: [...state.jobs, action.payload]
            }
        case DELETE_JOB:
            const newJobs = [...state.jobs].splice(action.payload, 1)
            return {
                ...state,
                jobs: newJobs
            }
        default:
            throw new Error("Invalid Action")
    }
}
// 4. Dispatch
const ReducerTodoList = () => {
    const [state, dispatch] = useReducer(reducer, initState);

    const { job, jobs } = state

    const input = useRef()
    const handleAdd = () => {
        dispatch(addjob(job))
        dispatch(setJob(''))
        input.current.focus()

    }
    return (

        <>
            <div>ReducerTodoList</div>

            <input
                type="text"
                placeholder='Enter job'
                value={job}
                onChange={(e) => {
                    //ben trong cai dispatch nay gui len reducer no se la action dc nhan vao
                    dispatch(setJob(e.target.value))
                }}
                ref={input}
            />
            <button
                onClick={handleAdd}
            >Add</button>

            {jobs.map((j, index) => (
                <p key={index}>{j}
                    <span
                        onClick={() => dispatch(deletejob(index))}
                    >&times;</span>
                </p>
            ))}
        </>
    )
}

export default ReducerTodoList