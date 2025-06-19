import React, { useEffect, useRef, useState } from 'react'
// cái quan trọng không phải là useRef sẽ đc call ở mounted,
//  nó sẽ được call ở lần đầu render component.
// và mỗi khi setState qua useState sẽ dẫn đến rerender component,
// nhưng set giá trị cho ref thì không.
// việc dùng useRef thay vì move biến ra ngoài component(tạo closure)
// là bởi do logic sẽ cần phải duy trì trong vòng đời của component,
//  nếu move ra closure thì sinh ra nhiều instances của component
// đó sẽ dùng cùng 1 data(semi global), nó sẽ phù hợp với các chức năng cần thế,
//  ví dụ tạo unique ID cho mỗi component chẳng hạn.

// tóm lại biến sử dụng useRef thì nó sẽ k bị set lại sau mỗi lần render
// initial dc khởi tạo chỉ dùng cho lần đầu mounted

const UseRef = () => {


  let timeIds=useRef()

  const [count, setcount] = useState(60);
  const handleStart = () => {

    timeIds.current=setInterval(() => {
      setcount(count=>count - 1)
    }, 1000)
    console.log(timeIds.current);
    

  }
  const handleStop = () => {

    clearInterval(timeIds.current)
    console.log(timeIds.current);
    
  }

  //lay gia tri hien tai va gia tri truoc do

  const preCount = useRef()
  //nếu dùng useRef trong Useeffect thì ngay khi mà
  // component dc mounted thì nó đã chạy 1 lần nên ngay trong 
  // lần đầu thì dc mounted thì ref đã dc set là 60 luôn r 
  // nếu nhìn console.log nó sẽ k chạy đúng theo logic render 
  // của useEffect 
  // ==> tóm lại vd ui là 59 nhưng current vẫn là 60 thì 
  // state thay đổi trước render Ui rồi useefect mới thì vì vậy
  // nó sẽ chậm hơn 1 nhịp khi log ra
  useEffect(() => {
    
  
    preCount.current=count
  }, [count]);
  console.log(count,preCount.current);
  
  return (
    <div>
      <h1>{count}</h1>

      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>

    </div>
  )
}

export default UseRef