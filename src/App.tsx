import AddDomain from "@/components/addDomain";
import TimeDisplay from "@/components/timeDisplay";
import TimePicker from "@/components/timePicker";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { set } from "@/store/main";
import { useEffect, useState } from "react";
import {
  conditionallyInstantMute,
  getStorage,
  resetStorage,
  scheduleAlarm,
  sendInitStorage,
  setStorage,
} from "@/utils";

export default function App() {
  const step = useSelector((state: RootState) => state.main.step);
  const domains = useSelector((state: RootState) => state.main.domains);
  const from = useSelector((state: RootState) => state.main.from);
  const to = useSelector((state: RootState) => state.main.to);
  const [isTimeSelected, setIsTimeSelected] = useState(false);
  const [animateTimeNotSelected, setAnimateTimeNotSelected] = useState(false);
  const [animateNoDomains, setAnimateNoDomains] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const browserStorage = useSelector(
    (state: RootState) => state.main.browserStorage
  );

  let animateTimeNotSelectedTimeout: NodeJS.Timeout | null = null;
  let animateNoDomainsTimeout: NodeJS.Timeout | null = null;

  const dispatch = useDispatch();

  useEffect(() => {
    const handleStorageInit = async () => {
      const storage = await getStorage();

      if (storage) {
        const { from, to, domains } = storage;
        dispatch(set({ name: "from", data: from }));
        dispatch(set({ name: "to", data: to }));
        dispatch(set({ name: "domains", data: domains }));

        if (domains.length > 0) {
          setIsRunning(true);
        }
      }
    };

    handleStorageInit();
  }, []);

  useEffect(() => {
    if (from && to) {
      setIsTimeSelected(true);
    } else {
      setIsTimeSelected(false);
    }
  }, [from, to]);

  const variants = {
    initial: {
      clipPath: "circle(0% at 50% 50%)",
      opacity: 0,
    },
    animate: {
      clipPath: "circle(150% at 50% 50%)",
      opacity: 1,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    exit: {
      clipPath: "circle(0% at 50% 50%)",
      opacity: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };

  const handleNextStep = () => {
    setAnimateNoDomains(false);

    if (step < 2 && isTimeSelected) {
      dispatch(set({ name: "step", data: step + 1 }));
    } else if (!isTimeSelected) {
      setAnimateTimeNotSelected(true);

      if (animateTimeNotSelectedTimeout)
        clearTimeout(animateTimeNotSelectedTimeout);
      animateTimeNotSelectedTimeout = setTimeout(() => {
        setAnimateTimeNotSelected(false);
      }, 1 * 1000);
    } else if (step === 2) {
      if (domains.length > 0) {
        setStorage({
          data: { domains, from, to },
          storage: browserStorage,
        });
        setIsRunning(true);
        if (from && to) {
          scheduleAlarm("muteAlarm", from);
          scheduleAlarm("unmuteAlarm", to);
          conditionallyInstantMute(from, to);
        }
        sendInitStorage({ domains, from, to });
        alert("Schedule set!");
      } else {
        setAnimateNoDomains(true);

        if (animateNoDomainsTimeout) clearTimeout(animateNoDomainsTimeout);
        animateNoDomainsTimeout = setTimeout(() => {
          setAnimateNoDomains(false);
        }, 1 * 1000);
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      dispatch(set({ name: "step", data: step - 1 }));
    }
  };

  const reset = () => {
    resetStorage();
    setIsRunning(false);
    dispatch(set({ name: "step", data: 1 }));
    dispatch(set({ name: "domains", data: [] }));
    dispatch(set({ name: "from", data: "" }));
    dispatch(set({ name: "to", data: "" }));
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[var(--background)] p-5">
      <div className="flex flex-col justify-center items-center gap-2">
        <div className="flex flex-col items-center">
          <TimeDisplay
            className={`transtion-all duration-300 ${
              animateTimeNotSelected ? "scale-[1.2]" : ""
            }`}
          />

          <div className="h-[250px] w-[250px] flex justify-center">
            <AnimatePresence mode="wait" initial={false}>
              {step === 1 && (
                <motion.div
                  key="time"
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <TimePicker />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="add"
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full h-full"
                >
                  <AddDomain />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className={`relative w-full flex justify-center items-center`}>
          <motion.button
            className="absolute !rounded-full !p-0 !border-none w-[30px] h-[30px] !bg-[var(--gray)]"
            animate={step === 2 ? "animate" : "initial"}
            variants={{
              animate: {
                transform: "translateX(-33px)",
                opacity: 1,
              },
              initial: {
                transform: "translateX(0px)",
                opacity: 0,
              },
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onClick={() => handlePrevStep()}
          >
            {"<"}
          </motion.button>

          <motion.button
            className={`!rounded-full !p-0 !border-none w-[50px] h-[50px] z-1 ${
              animateNoDomains ? "shake" : ""
            }`}
            onClick={() => handleNextStep()}
          >
            {step === 1 ? "Next" : "Save"}
          </motion.button>

          {isRunning && (
            <motion.button
              className="group absolute right-0 !rounded-full !p-0 !border-none w-[40px] h-[40px] z-1 !bg-[var(--gray)] flex items-center justify-center hover:!brightness-[1.1] active:!brightness-[1.2]"
              onClick={() => reset()}
            >
              <img
                src="icons/trashGray.svg"
                className="group-hover:brightness-150 transition-all duration-200"
              />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
