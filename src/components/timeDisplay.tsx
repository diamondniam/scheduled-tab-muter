import type { RootState } from "@/store";
import { set } from "@/store/main";
import type { TimeView } from "@mui/x-date-pickers/models";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  className?: string;
};

export default function TimeDisplay(props: Props) {
  const clock = useSelector((state: RootState) => state.main.clock);
  const view = clock.view;
  const currentClock = clock.currentClock;

  const fromStore = useSelector((state: RootState) => state.main.from);
  const toStore = useSelector((state: RootState) => state.main.to);
  const from = useMemo(() => {
    if (fromStore) return dayjs(fromStore);
    else return null;
  }, [fromStore]);

  const to = useMemo(() => {
    if (toStore) return dayjs(toStore);
    else return null;
  }, [toStore]);

  const dispatch = useDispatch();

  const handleTimeClick = (is: "from" | "to", part: TimeView) => {
    dispatch(set({ name: "step", data: 1 }));
    dispatch(set({ name: "clock", data: { currentClock: is, view: part } }));
  };

  return (
    <div className={`text-2xl flex gap-1 ${props.className || ""}`}>
      <p>
        <span
          className={`timePart ${
            view === "hours" && currentClock === "from" ? "timePartActive" : ""
          }`}
          onClick={() => handleTimeClick("from", "hours")}
        >
          {from?.format("HH") || "--"}
        </span>
        :
        <span
          className={`timePart ${
            view === "minutes" && currentClock === "from"
              ? "timePartActive"
              : ""
          }`}
          onClick={() => handleTimeClick("from", "minutes")}
        >
          {from?.format("mm") || "--"}
        </span>
      </p>
      -
      <p>
        <span
          className={`timePart ${
            view === "hours" && currentClock === "to" ? "timePartActive" : ""
          }`}
          onClick={() => handleTimeClick("to", "hours")}
        >
          {to?.format("HH") || "--"}
        </span>
        :
        <span
          className={`timePart ${
            view === "minutes" && currentClock === "to" ? "timePartActive" : ""
          }`}
          onClick={() => handleTimeClick("to", "minutes")}
        >
          {to?.format("mm") || "--"}
        </span>
      </p>
    </div>
  );
}
