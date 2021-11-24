import Link from "next/link";

import styles from "./Category.module.scss";
import { CategoryProps } from "./Category.types";

export const Category = ({ name, slug }: CategoryProps) => (
  <Link href={`/category/${slug}/`}>
    <a className={styles.category}>{name}</a>
  </Link>
);
