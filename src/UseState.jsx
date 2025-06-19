// Dữ liệu thay đổi mà bạn muốn giao diện thay đổi theo
// =>áp dụng useState

import React, { useState } from 'react'

const UseState = () => {
  const [counter, setCounter] = useState(1)

  // Initial state voi callback

  const order=[100,200,300]
  const [countercallback, setCountercallback] = useState(() =>
  {
    const total = order.reduce((total, cur) => total + cur)
    return total
  })



  const [info, setInfo] = useState({
    name:'abc',diachi:'def',phone:'122345'
  })
  const handleCounter = () => {
    setCounter(counter + 1)
    // #set state voi callback
    // setCounter(preCounter => preCounter + 1)
    // setCounter(preCounter => preCounter + 1)
    // setCounter(preCounter => preCounter + 1)
    setCountercallback(preCounter => preCounter + 1)



    
  }

  // set state thay doi hoan toan initial state
  const handleUpdate=() => {
    
    setInfo({...info,name:"ntpc"})
  }

  return (
    <>
      <h1>{counter}</h1>
      <h1>{countercallback}</h1>
      <button onClick={handleCounter}>Click me</button>

      <hr />

      <h1>{info.name}</h1>
      <button onClick={handleUpdate}>Update</button>


    </>
   
  )
}

export default UseState