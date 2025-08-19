import { ACTIONS } from "@/reducers/workoutTimerReducer";
import { Button } from "./button";
import { usePauseTimer } from "@/hooks/usePauseTimer";

export default function TimerController({dispatch, state}) {
  const { setIsPaused } = usePauseTimer(state);

  function dispatchStart() {
    setIsPaused(false);
    dispatch({ type: ACTIONS.START });
  }

  function dispatchPause() {
    setIsPaused(true);
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