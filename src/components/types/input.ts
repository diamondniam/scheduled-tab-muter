export type InputProps = {
  className?: Record<"container" | "input" | "placeholder", string>;
  placeholder: string;
  onBeforeInput?: (e: React.InputEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  value?: string;
  onChange?: (val: string) => void;
  isError?: boolean;
};
