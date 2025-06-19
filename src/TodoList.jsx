import React, { useState } from 'react'

const TodoList = () => {
    const [todos, settodos] = useState([]);


    const [name, setname] = useState('');

    const handleAdd = (name) => {
        settodos((prev) => [...prev, { id: Math.floor(Math.random() * 100), name }]);

        setname('')
    }
    return (
        <div>
            <h1>Todo list</h1>
            <input type="text"
                value={name}
                onChange={(e)=>setname(e.target.value)}
            />
            <button onClick={()=>handleAdd(name)}> add</button>
            {todos && todos.map((todo) => (
                <p>{todo.name}</p>
            ))}
        </div>
    )
}

export default TodoList