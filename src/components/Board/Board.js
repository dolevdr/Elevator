import { useCallback, useRef, useState } from "react";
import Elevator from "../Elevator/Elevator";
import Floor from "../floor/floor";
import "./Board.css";
import { queue } from "../../RequestManager/RequestManager";

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

  const findElevator = useCallback(
    (floor, fId) => {
      //if nothing available send to queue
      let availableElevators = elevators.filter(
        (obj) => obj.available === true
      );
      if (availableElevators.length > 0) {
        let n = availableElevators.map((obj) => {
          const eleRect = obj.ref.current.getBoundingClientRect();
          const fRect = floor.current.getBoundingClientRect();
          return { id: obj.id, dist: Math.abs(eleRect.top - fRect.top) };
        });
        return n.reduce((p, c) => (p.dist > c.dist ? c : p));
      }
      queue.enqueue({ id: fId, ref: floor });
      return null;
    },
    [elevators]
  );

  const movingElevator = useCallback(
    (fRef, fId, eId) => {
      elevators[eId - 1].available = false;
      setElevators([...elevators]);
      const interval = setInterval(function () {
        moving(fRef, elevators[eId - 1].ref);
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
            elevators[eId - 1].available = true;
            setElevators([...elevators]);
            if(!queue.isEmpty()){
              const next = queue.dequeue();
              movingElevator(next.ref, next.id, eId);
            }
          }, 2000);
        } else if (Math.abs(floor - ele) >= 5) {
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
    [elevators, floors]
  );

  const handleCall = useCallback(
    (fRef, fId) => {
      floors[fId - 1].wait = true;
      setFloors([...floors]);
      //if queue is empty find for current floor
      //else put current last in queue and take the first in line
      let minObj = null;
      if (queue.isEmpty()) {
        minObj = findElevator(fRef,fId);
      } else {
        queue.enqueue({ id: fId, ref: fRef });
      }
      if (minObj) {
        movingElevator(fRef, fId, minObj.id);
      }
    },
    [floors, findElevator, movingElevator]
  );

  return (
    <div className="board_container">
      <div className="numbers"></div>
      <table className="board">
        <tbody>
          {floors.map((fVal, fInd) =>
            fInd !== 9 ? (
              <tr key={fInd}>
                {elevators.map((v, i) => (
                  <td key={i}></td>
                ))}
              </tr>
            ) : (
              <tr key={fInd}>
                {elevators.map((eVal, eInd) => (
                  <td key={eInd}>
                    <div ref={eVal.ref}>
                      <Elevator id={eVal.id} available={eVal.available} />
                    </div>
                  </td>
                ))}
              </tr>
            )
          )}
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
