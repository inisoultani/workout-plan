import { ACTIONS } from "@/reducers/workoutTimerReducer";
import { Button } from "./button";
import { memo } from "react";

function TimerController({dispatch}) {

  console.log("TimerController rendered");

  function dispatchStart() {
    dispatch({ type: ACTIONS.START });
  }

  function dispatchPause() {
    dispatch({ type: ACTIONS.PAUSE });
  }

  function dispatchNext() {
    dispatch({ type: ACTIONS.NEXT });
  }

  function dispatchReset() {
    dispatch({ type: ACTIONS.RESET });
  }

  function dispatchRestart() {
    dispatch({ type: ACTIONS.RESTART });
  }
  
  function dispatchGoToPrevious() {
    dispatch({ type: ACTIONS.GO_TO_PREVIOUS });
  }

  return (
    <div className="flex gap-4">
      <Button onClick={dispatchStart}>Start</Button>
      <Button onClick={dispatchPause}>Pause</Button>
      <Button onClick={dispatchReset}>Reset Movement</Button>
      <Button onClick={dispatchNext}>Next Movement</Button>
      <Button onClick={dispatchGoToPrevious}>Previous Movement</Button>
      <Button onClick={dispatchRestart}>Restart</Button>
    </div>
  );
}

const MemoizedTimerController = memo(TimerController);

export default MemoizedTimerController;