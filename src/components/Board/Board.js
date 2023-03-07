import { useCallback, useRef, useState } from "react";
import Elevator from "../Elevator/Elevator";
import Floor from "../floor/floor";
import "./Board.css";

const Board = () => {
  const [elevators, setElevators] = useState([
    { id: 1, available: true, ref: useRef(null) },
    { id: 2, available: true, ref: useRef(null) },
    { id: 3, available: true, ref: useRef(null) },
    { id: 4, available: true, ref: useRef(null) },
    { id: 5, available: true, ref: useRef(null) },
  ]);

  const [floors, setFloors] = useState([
    { id: 1, wait: false, arrive: false },
    { id: 2, wait: false, arrive: false },
    { id: 3, wait: false, arrive: false },
    { id: 4, wait: false, arrive: false },
    { id: 5, wait: false, arrive: false },
    { id: 6, wait: false, arrive: false },
    { id: 7, wait: false, arrive: false },
    { id: 8, wait: false, arrive: false },
    { id: 9, wait: false, arrive: false },
    { id: 10, wait: false, arrive: false },
  ]);
  const findElevator = useCallback((floor) => {
    let n = elevators
      .filter((obj) => obj.available === true)
      .map((obj) => {
        const eleRect = obj.ref.current.getBoundingClientRect();
        const fRect = floor.current.getBoundingClientRect();
        return { id: obj.id, dist: Math.abs(eleRect.top - fRect.top) };
      });
    return n.reduce((p, c) => (p.dist > c.dist ? c : p));
  }, [elevators]);

  const handleCall = useCallback(
    (fRef, fId) => {
      floors[fId - 1].wait = true;
      setFloors([...floors]);
      let minObj = findElevator(fRef);
      elevators[minObj.id - 1].available = false;
      setElevators([...elevators]);
      
      const interval = setInterval(function () {
        moving(fRef, elevators[minObj.id - 1].ref);
      }, 50);

      const moving = (fRef, eRef) => {
        let floor = fRef.current.getBoundingClientRect().top;
        let ele = eRef.current.getBoundingClientRect().top;
        if (floor === ele) {
          clearInterval(interval);
          floors[fId - 1].arrive = true;
          setFloors([...floors]);
          setTimeout(() => {
            floors[fId - 1].arrive = false;
            setFloors([...floors]);
            floors[fId - 1].wait = false;
            setFloors([...floors]);
            elevators[minObj.id - 1].available = true;
            setElevators([...elevators]);
          }, 2000);
          return;
        }
        if (Math.abs(floor - ele) >= 5) {
          eRef.current.style.transform +=
            floor > ele ? `translateY(${5}px)` : `translateY(${-5}px)`;
        } else {
          eRef.current.style.transform +=
            floor > ele
              ? `translateY(${floor - ele}px)`
              : `translateY(${floor - ele}px)`;
        }
      };
    },
    [elevators, floors, findElevator]
  );

  return (
    <div className="board_container">
      <div className="numbers"></div>
      <table className="board">
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            {elevators.map((v, i) => (
              <td key={i}>
                <div ref={v.ref}>
                  <Elevator id={v.id} available={v.available} />
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <div className="floors">
        {floors.map((v, i) => (
          <div key={i}>
            <Floor
              id={v.id}
              wait={v.wait}
              arrive={v.arrive}
              handleCall={handleCall}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
