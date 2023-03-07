import { useRef } from "react";
import "./floor.css";
import audio from "../../source/Sound.mp3";

const Floor = (props) => {
  const { id, handleCall, wait, arrive, elevators } = props;
  const floorRef = useRef(null);
  if (arrive) {
    new Audio(audio).play();
  }

  const style = !wait
    ? { name: "Call", id: "green" }
    : !arrive
    ? { name: "Waiting", id: "red" }
    : { name: "Arrived", id: "arrive" };
  return (
    <div ref={floorRef} className="floor_container">
      {!wait ? (
        <button
          className="float"
          onClick={() => handleCall(floorRef, id)}
          id={style.id}
        >
          {style.name}
        </button>
      ) : (
        <button className="float" id={style.id}>
          {style.name}
        </button>
      )}
      {elevators >= 0 && (
        <div className="numberOfElevators float">
          {elevators} elevators left
        </div>
      )}
    </div>
  );
};

export default Floor;
