import { Children, ReactNode } from "react";
import styles from "./cards.module.css";
import { clsx } from "clsx";

export default function Cards({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx(styles.card, className)}>{children}</div>;
}
