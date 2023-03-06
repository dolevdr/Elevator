import './Elevator.css';
import elevate from '../../source/elevator.jpeg'

const Elevator = (props)=>{
    const available = props.available;

    const style = (available) ? 'Green' : 'Red';
    return (
        <div className='elevator_container'>
            <img className='el' id={style} src={elevate} alt='' />

        </div>
    )
}

export default Elevator;