import { styled } from "@mui/material/styles";
import { TimeClock } from "@mui/x-date-pickers/TimeClock";

export default function TimeClockStyled(width: number) {
  return styled(TimeClock)(() => ({
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
}
