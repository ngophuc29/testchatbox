// dung useEffect khi muon thuc hien cac side effect
//side effect là đang nói tới một ct phần mềm khi có 1
// tác động xảy ra nó dẫn tới việc dữ liệu bị thay đổi

// vd khi update dom ,call api,list dom event(scrool,resize),clean up event

import React, { useEffect,useState } from 'react'

export default function UseEffect() {


    // useEffect(callback )
    // useEffect(callback,[])
    // useEffect(callback,[deps])

    // callback tự viết để thực hiện các side effect
    

    // cả 3 trường hợp trên thì
    // (1) callback luôn được gọi sau khi component mounted

    // (2) Clean up function luôn được gọi trước khi component unmounted
    //==>có nghĩa là khi bạn nghĩ component của bạn có thể bị unmounted 
    // mà trong component của bạn có setInterval,setTimeout,async bất đồng bộ hoặc event
    // thì phải có clean up trong UseEffect để tránh rò rỉ bộ nhớ
    
    
    // (3)Clean up function luôn được gọi trước khi callback dc gọi (trừ lần umounted)

    
    // với useEffect(callback ) thì 
    // nó sẽ gọi callback mỗi khi component re-render
    // nó sẽ gọi callback sau khi component thêm element vào DOM
    // nghĩ là nó sẽ return ra element trong dom trc r moi chạy callback
    // trong useEffect
    
    
    
    // với useEffect(callback,[] ) thì 
    // chỉ gọi callback 1 lần sau khi component mount
    
    
    
    // với useEffect(callback,[deps] ) thì 
    // callback sẽ dc gọi lại mỗi khi deps thay đổi như vd dưới thì là 
    // tabs
    
    
    //update dom
    
    const [title, settitle] = useState();
    const [posts, setPosts] = useState([])
    
    // nên có đối số [] để tránh call api liên tục
    // useEffect(() => {
        
    //     fetch(`https://jsonplaceholder.typicode.com/posts`)
    //         .then(res => res.json())
    //         .then(posts=>setPosts(posts))
    // });
    
    //có đối số chỉ call 1 lên khi component mount

    const [tabs, settabs] = useState('posts');

    const [contents, setcontents] = useState([]);
    useEffect(() => {
        
        fetch(`https://jsonplaceholder.typicode.com/${tabs}`)
            .then(res => res.json())
            .then(posts => setcontents(posts))
        
        
    }, [tabs]);



    // ứng dụng với event
    // (2) Clean up function luôn được gọi trước khi component unmounted
    const [showbtn, setshowbtn] = useState(false);
    useEffect(() => {

        const handleScroll = () => {
            if (window.scrollY>=200) {
                setshowbtn(true)
            } else {
                setshowbtn(false)
            }
            
        }
        window.addEventListener('scroll', handleScroll)


        //Cleanup Function để tránh rò rỉ bộ nhớ khi componen unmounted

        return () => {
            window.removeEventListener('scroll', handleScroll)

        }
    }, [])
    
    // resize

    const [width, setwidth] = useState(window.innerWidth);

    useEffect(() => {
        
        const handleResize = () => {
            setwidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        // đây là gọi clean up nè
        return () => {
            window.removeEventListener('resize', handleResize)

        }
    }, []);

//     - Sử dụng js thuần để listen DOM event(window.addEventListener('eventName', callback)
//         - Khi eventlistener được kích hoạt, nó được lắng nghe từ đối tượng window nên chỉ khi nào close tab, hoặc browser thì mới kết thúc.Component unmount thì evenListener vẫn hoạt động.Khi mount lại thì sinh ra 1 eventlistener mới
//         => dẫn đến tình trạng memory leak, khi component được mount lại thì eventlistener cũ vẫn đang lắng nghe từ component cũ
//         => sử dụng cleanup funtion, dùng để sử lý khi component bị unmount(áp dụng cho cả 3 trường hợp của useEffect)
    // => return ra 1 function trong useEffect
    



    // với timer : setInterval,setTimeout,clearInterval,clearTimeout


    // với đếm ngược nhé
    const [countDown, setcountDown] = useState(180);

    useEffect(() => {
        
        const timeIds=setInterval(() => {
            setcountDown(countDown=>countDown-1)   
        },1000)
        // (2) Clean up function luôn được gọi trước khi component unmounted
        return () => {
            clearInterval(timeIds)
            
        }
    }, []);


    // (3)Clean up function luôn được gọi trước khi callback dc gọi (trừ lần umounted)

    const [previewImage, setPreviewImage] = useState('')
    
    //với cách làm này thì có thể chọn nhiều kiểu ảnh khác
    //nhưng chỉ dùng ảnh hiện tại ảnh trc đó vẫn dc lưu trong bộ 
    // nhớ vì vậy cần tạo thêm 1 clean up
    
    useEffect(() => {
        
        return () => {
            previewImage && URL.revokeObjectURL(previewImage.previewImage)
        }
    }, [previewImage]);
    const handlePreviewAvaTar = (e) => {
        const file = e.target.files[0]
        file.previewImage = URL.createObjectURL(file)
        setPreviewImage(file)
        
    }

//     // sử dụngEffect
// // 1
// . Cập nhật lại state
//     //
//     2
//         .Cập nhật DOM(mutated)
//     //
//     3. Render lại UI
//     //
//     4.
// Gọi cleanup nếu deps thay đổi
//     //
//     5.Gọi useEffect gọi lại

 
//     useLayoutEffect

//     1
//         .Cập nhật lại state
//     //
//     2 . Cập nhật DOM(mutated)

//     3 .Gọi cleanup nếu deps thay đổi(sync)

//     4. Gọi useLayoutEffect callback(đồng bộ)
 
//     5. Render lại UI
  return (
      <div>
          {/* // (3)Clean up function luôn được gọi trước khi callback dc gọi (trừ lần umounted) */}

          <input type="file" name="" id=""
              onChange={handlePreviewAvaTar}
          />

          {previewImage && 
          
          <img src={previewImage.previewImage} alt="" srcset="" width='20%' />
          }
          {/* <p>Width : { width}</p> */}

          <h1>{countDown}</h1>
          <input type="text"
          value={title}
          />

          {showbtn && <button style={{
              position: 'fixed',
              bottom: 40,
              right: 20
          }}>domEventshow</button> }
          
          <div>
              
              <button onClick={() => settabs('posts')}
              style={tabs==='posts'?{backgroundColor:'red'}:{}}
              >Post</button>
              <button onClick={() => settabs('comments')}
                  style={tabs === 'comments' ? { backgroundColor: 'red' } : {}}

              >Comments</button>
              <button onClick={() => settabs('albums')}
                  style={tabs === 'albums' ? { backgroundColor: 'red' } : {}}

              >Albums</button>

          </div>
          <ul>
              {contents.map((content) => (
                  <li key={content.id}>
                      {tabs === 'comments' ? content.name : content.title}

                  </li>
              ))}
          </ul>
    </div>
  )
}
