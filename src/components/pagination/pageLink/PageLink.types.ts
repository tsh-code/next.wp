import { ReactNode } from "react";

export type PageLinkProps = {
  href: string;
  page: number;
  children: ReactNode;
  className?: string;
};
