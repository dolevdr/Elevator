import { useRef } from 'react';
import './floor.css';

const Floor = (props)=>{
    const {id,handleCall, wait, arrive} = props;
    const floorRef =  useRef(null);
    
    const style = (!wait) ? {name:'Call', id:'green'} : (!arrive) ? {name:'Waiting', id:'red'}: {name:'Arrived', id:'arrive'};
    return (
        <div ref={floorRef} className='floor_container'>
            {!wait
            ? <button onClick={()=>handleCall(floorRef, id)} id={style.id}>{style.name}</button>
            : <button id={style.id}>{style.name}</button>

            }
            
        </div>
    )
}

export default Floor;