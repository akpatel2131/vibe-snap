import { Children, ReactNode } from "react";
import styles from "./cards.module.css";
import { clsx } from "clsx";

export default function Cards({
  children,
  className,
  style
}: {
  children: ReactNode;
  className?: string;
  style?: object
}) {
  return <div className={clsx(styles.card, className)} style={style}>{children}</div>;
}
