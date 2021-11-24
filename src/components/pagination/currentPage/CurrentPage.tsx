import clsx from "clsx";

import { CurrentPageProps } from "./CurrentPage.types";
import styles from "./CurrentPage.module.scss";

export const CurrentPage = ({ children, className }: CurrentPageProps) => (
  <div className={clsx(styles.currentPage, className)}>{children}</div>
);
