import { TimeClock } from "@mui/x-date-pickers/TimeClock";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { styled } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import type { PickerValue } from "@mui/x-date-pickers/internals";
import type { TimeView } from "@mui/x-date-pickers/models";
import "@/styles/timePicker.css";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { set } from "@/store/main";

export default function TimePicker() {
  const width = 250;

  const CustomClock = styled(TimeClock)(() => ({
    width: `${width}px`,

    "& .MuiButtonBase-root": {
      backgroundColor: "var(--primary-darker)",
      color: "var(--color)",
      transition: "all 0.3s",

      "&:hover": {
        backgroundColor: "var(--primary-darker)",
        filter: "brightness(0.9)",
      },
    },
    "& .Mui-selected": {
      backgroundColor: "var(--primary)",
      transition: "all 0.3s",

      "&:hover": {
        backgroundColor: "var(--primary)",
      },
    },
    "& .MuiClockPointer-thumb": {
      borderColor: "var(--primary)",
    },
    "& .MuiClock-squareMask": {
      backgroundColor: "var(--gray)",
    },
    "& .MuiClockNumber-root": {
      color: "var(--color)",
    },
    "& .MuiClock-pin": {
      backgroundColor: "var(--primary)",
    },
    "& .MuiClockPointer-root": {
      backgroundColor: "var(--primary)",
    },
    "& .MuiTimeClock-root": {
      margin: "0px",
    },
    "& .MuiClock-root": {
      width: "250px",
      height: "250px",
      margin: "0px",
    },
    "& .Mui-disabled": {
      color: "var(--color) !important",
      opacity: 0.2,
    },
  }));

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
  const [minTimeForTo, setMinTimeForTo] = useState<Dayjs | undefined>(
    undefined
  );
  const dispatch = useDispatch();

  const handleChange = (is: "from" | "to", newValue: PickerValue) => {
    const valueDjs = dayjs(newValue);
    if (is === "to") {
      dispatch(set({ name: "to", data: valueDjs.toISOString() }));
    } else {
      if (!to || to.toDate() < valueDjs.toDate()) {
        const dateMore = valueDjs.add(1, "minute");
        dispatch(set({ name: "to", data: dateMore.toISOString() }));
      }
      dispatch(set({ name: "from", data: valueDjs.toISOString() }));
    }
  };

  const handleFocusedViewChange = (view: TimeView) => {
    dispatch(set({ name: "clock", data: { ...clock, view } }));
  };

  useEffect(() => {
    setMinTimeForTo(dayjs(from).add(1, "minute"));
  }, [from]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CustomClock
        view={view}
        value={currentClock === "from" ? from : to}
        ampmInClock={true}
        minTime={currentClock === "to" ? minTimeForTo : undefined}
        onChange={(newValue) => handleChange(currentClock, newValue)}
        onFocusedViewChange={(view) => handleFocusedViewChange(view)}
      />
    </LocalizationProvider>
  );
}
