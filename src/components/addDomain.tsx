import Input from "@/components/input";
import type { RootState } from "@/store";
import { push, splice } from "@/store/main";
import { validateUrl, validateUrlChar } from "@/utils";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import type { AddDomainProps } from "@/components/types";

export default function AddDomain(props: AddDomainProps) {
  const [inputValue, setInputValue] = useState("");
  const maxDomains = 7;

  const domains = useSelector((state: RootState) => state.main.domains);
  const dispatch = useDispatch();

  const [isError, setIsError] = useState(false);

  const handleBeforeInput = (e: React.InputEvent<HTMLInputElement>) => {
    if (e.data === " ") {
      e.preventDefault();
    }

    if (e.data && !validateUrlChar(e.data)) {
      e.preventDefault();
    }
  };

  const handleAddDomain = () => {
    if (validateUrl(inputValue) && domains.length < maxDomains) {
      dispatch(push({ name: "domains", data: inputValue }));
      setInputValue("");
    } else {
      setIsError(true);
    }
  };

  return (
    <div className={`flex flex-col h-[220px] gap-3 mt-5 ${props.className}`}>
      <Input
        value={inputValue}
        placeholder="Add Domain"
        onBeforeInput={handleBeforeInput}
        icon={
          <button
            className="bg-[var(--primary)] !p-0 w-6 h-6 rounded-sm flex items-center justify-center cursor-pointer"
            onClick={() => handleAddDomain()}
          >
            +
          </button>
        }
        onChange={(val) => {
          setInputValue(val);
          setIsError(false);
        }}
        isError={isError}
      />

      <div className="flex flex-col gap-1 h-full overflow-y-scroll smallScrollbar">
        <AnimatePresence mode="wait" initial={false}>
          {domains.map((domain, index) => (
            <motion.div
              key={domain}
              className="flex items-center justify-between gap-2 border-b pb-1 border-[var(--gray)]"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { height: "auto", opacity: 1 },
                collapsed: { height: 0, opacity: 0 },
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <p className="truncate">{domain}</p>
              <button
                className="!bg-[var(--gray)] !p-0 w-6 h-6 rounded-sm flex items-center justify-center cursor-pointer flex-none"
                onClick={() =>
                  dispatch(splice({ name: "domains", data: index }))
                }
              >
                -
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
