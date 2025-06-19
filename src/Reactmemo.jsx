import React, { useState } from 'react'
import Content from './Content'

const Reactmemo = () => {
    const [count, setcount] = useState(0);
  return (
      <div>
          
          {/* // meme giup  cho việc render k cần thiết
          // khi state ở component này thay đổi 
          // k liên quan tới component content 
          // thì nó giúp content tránh re render lại 
          // k cần thiết khi mà component nay thay đổi 
          // muốn content thay đổi thì truyển props quá 
          // chỉ cần 1 duy props thay đổi nó sẽ re render */}
          <Content />
          <button onClick={()=>setcount(count+1)}>click</button>
          
    </div>
  )
}

export default Reactmemo