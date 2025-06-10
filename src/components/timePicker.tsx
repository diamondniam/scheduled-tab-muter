import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMemo } from "react";
import dayjs from "dayjs";
import type { PickerValue } from "@mui/x-date-pickers/internals";
import "@/styles/timePicker.css";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { set } from "@/store/main";
import { setStorage } from "@/utils";
import TimeClockStyled from "@/components/styled/timePicker";

export default function TimePicker() {
  const width = 250;

  const TimeClock = TimeClockStyled(width);

  const windowId = useSelector((state: RootState) => state.main.windowId);
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

  const clock = useSelector((state: RootState) => state.main.clock);
  const view = clock.view;
  const currentClock = clock.currentClock;
  const dispatch = useDispatch();

  const handleChange = (is: "from" | "to", newValue: PickerValue) => {
    const valueDjs = dayjs(newValue);
    if (is === "to") {
      dispatch(set({ name: "to", data: valueDjs.toISOString() }));
      setStorage(windowId, "to", valueDjs.toISOString());
    } else {
      dispatch(set({ name: "from", data: valueDjs.toISOString() }));
      setStorage(windowId, "from", valueDjs.toISOString());
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimeClock
        view={view}
        value={currentClock === "from" ? from : to}
        ampmInClock={true}
        onChange={(newValue) => handleChange(currentClock, newValue)}
      />
    </LocalizationProvider>
  );
}
