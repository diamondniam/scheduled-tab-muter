import "@/styles/input.css";
import { useClickOutside } from "@/utils";
import { useEffect, useState } from "react";

type Props = {
  className?: Record<"container" | "input" | "placeholder", string>;
  placeholder: string;
  onBeforeInput?: (e: React.InputEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  value?: string;
  onChange?: (val: string) => void;
  isError?: boolean;
};

export default function Input(props: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  const input = useClickOutside<HTMLInputElement>(() => {
    setIsFocused(false);
  });

  const handleClick = () => {
    setIsFocused(true);
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (props.onChange) {
      props.onChange(e.currentTarget.value);
    }
  };

  useEffect(() => {
    if (props.value !== undefined && props.value !== null) {
      setValue(props.value);
    }
  }, [props.value]);

  return (
    <div
      className={`inputContainer ${
        props.className?.container ? props.className.container : ""
      } ${props.isError ? "inputError" : ""}`}
    >
      <input
        ref={input}
        value={value}
        type="text"
        onClick={handleClick}
        onInput={(e) => handleChange(e)}
        onBeforeInput={(e) => props.onBeforeInput?.(e)}
      />

      {props?.icon && <div className={`inputIcon`}>{props.icon}</div>}

      <div
        className={`inputPlaceholder ${
          isFocused || value.length ? "inputPlaceholderActive" : ""
        } ${props.isError ? "!text-[var(--error)]" : ""}`}
      >
        {props.placeholder}
      </div>
    </div>
  );
}
