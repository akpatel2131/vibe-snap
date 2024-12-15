import { ReactNode } from "react";
import styles from "./button.module.css";
import {clsx} from "clsx";

export default function Button({
  children,
  isBusy,
  disabled,
  onClick,
  className,
}: {
  children: ReactNode;
  isBusy?: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      className={clsx(styles.button, className, {
        [styles.isDisabled]: disabled || isBusy
      })}
      disabled={disabled || isBusy}
      onClick={onClick}
    >
      {isBusy ? "Loading...." : children}
    </button>
  );
}
