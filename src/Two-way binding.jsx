import React, { useState } from 'react'


const courses = [
    {
        id: 1, name: 'js'
    },
    {
        id: 2, name: 'php'
    }
    , {
        id: 3, name: 'java'
    }
]
function TwoWayBinding() {


    const [name, setname] = useState('');


    const [checkRadio, setcheckRadio] = useState(1);

    const [checkCheckBox, setcheckCheckBox] = useState([]);

    const gift = [
        'CPI I9', 'RAM 32G RGB', 'RGB KeyBoard'
    ]
    const [gifts, setgifts] = useState('Chua co phan thuong');

    const handleGetGift = () => {
        setgifts(gift[Math.floor(Math.random() * 3)])
    }

    const handleChangeCheckRadio = (id) => {
        setcheckRadio(id)
    }
    const handleChangeCheckBox = (id) => {
        
        
        const isCheck = checkCheckBox.includes(id)
        if (isCheck) {
            setcheckCheckBox(checkCheckBox.filter(item=>item!==id))
        
        }
        else{
            setcheckCheckBox(prev => [...prev, id])
        }
        console.log(checkCheckBox); 
    }
    return (
        <div>
            <h1>{gifts}</h1>
            <button onClick={handleGetGift}>Lay Thuong</button>

            <hr />
            <h1>Two way biding input</h1>
            <input type="text" value={name}
                onChange={(e) => {
                    setname(e.target.value)
                    console.log(e.target.value);

                }
                }
            />

            <hr />
            <h1>2 way bidding voi radio</h1>
 
            {courses.map((course) => (
                <div>
                    <input type='radio'
                        checked={checkRadio === course.id}
                        onChange={() => handleChangeCheckRadio(course.id)}
                    />
                    <label htmlFor="">{course.name}</label>
                </div>
            ))}
            <h1>2 way bidding voi CheckBox</h1>

            {courses.map((course) => (
                <div>
                    <input type='checkbox'
                        checked={checkCheckBox.includes(course.id)}
                        onChange={() => handleChangeCheckBox(course.id)}
                    />
                    <label htmlFor="">{course.name}</label>
                </div>
            ))}
        </div>
    )
}

export default TwoWayBinding