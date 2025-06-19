// dung useCallback kèm với React.memo để tránh re render component và tạo lại hàm khi
// truyền tham chiều (props) không cần thiết
// với component dùng React.memo thì khi mà props dc truyền qua k thay đổi dù 1
// thì nó k re render lại còn với nếu nó thay đổi dù chỉ 1 props nó cũng sẽ re render 

import React, { useCallback, useState } from 'react'
import Content from './Content'


// mỗi lần component dc render lại làm cho tạo ra 1 phạm vi mới 

const UseCallBack = () => {

  const [count, setcount] = useState(0);

  // const handleIncrease = () => {
  //   setcount(count=>count+1)
  // }
  // dung useCallback thay cho ham tren de tranh re render
  // lại component khi ma state thay đổi tạo lại tham 
  // chiếu mới cho hàm 
  const handleIncrease = useCallback(() => {
    setcount(count => count + 1)
  }, [])
  // dùng useCallback giống hết useEffect thôi
  // component vẫn sẽ render lại nhưng nhờ có 
  // denpdencies [] mỗi lần tạo hàm nó sẽ dc lấy lại
  // tham chiếu cũ do đó k thay đổi tham chiếu so với trước đó
  //nên k render lại component con của nó dùng memo
  // còn [] thì giống useEffect có thể thêm [a,b,c]
  // khi nó thay đổi thì component sẽ render lại và tạo 
  // tham chiếu mới cho hàm và React.memo nhận thấy và
  // re render lại
  
  
  return (

    <>
      <div>UseCallBack</div>
      
      <Content onIncrease={ handleIncrease} />
      <h1>{count}</h1>
      

      {/* // t sẽ đưa nút này quá content để có thể 
      // áp dụng dc usecallback 
      // vì mỗi lần bấm thì tăng count dẫn tới state thay đổi 
      //làm re render component này nó sẽ khởi tạo là hàm 
      // handleIncrease làm tạo ra tham chiều mới ,
      //  tham chiếu mới này thay đổi so với 
      // tham chiếu ở bên Content React.memo nhận thấy sự 
      // thay đổi và nó re render lại 
      // */}
    {/* <button onClick={handleIncrease}>click</button> */}
    </>
  )
}

export default UseCallBack