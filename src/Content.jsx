import React, { memo } from 'react'

const Content = ({ onIncrease }) => {
    console.log('render content');
    
  return (
    <>
    <div>Content</div>
    <button onClick={onIncrease}>click</button>
    </>

  )
}

export default memo(Content)