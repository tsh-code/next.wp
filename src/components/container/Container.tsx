import { ContainerProps } from "./Container.types";
import styles from "./Container.module.scss";

export const Container = ({ children }: ContainerProps) => <div className={styles.container}>{children}</div>;
