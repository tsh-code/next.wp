import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import { PAGINATION_OFFSET } from "utils/constants";

import { CurrentPage } from "./currentPage/CurrentPage";
import { Ellipsis } from "./ellipsis/Ellipsis";
import { PageLink } from "./pageLink/PageLink";
import { PageLinkProps } from "./pageLink/PageLink.types";
import { PaginationProps } from "./Pagination.types";
import styles from "./Pagination.module.scss";

export const Pagination = ({ currentPage, href, totalPages, className }: PaginationProps) => {
  const paginationFrom = currentPage > PAGINATION_OFFSET + 2 ? currentPage - PAGINATION_OFFSET : 1;
  const paginationTo =
    currentPage + PAGINATION_OFFSET + 2 < totalPages ? currentPage + PAGINATION_OFFSET - 1 : totalPages;
  const paginationPages = Array.from({ length: paginationTo - paginationFrom + 2 }, (_, i) => i + paginationFrom);

  const PaginationLink = (props: Omit<PageLinkProps, "href">) => <PageLink {...props} href={href} />;

  return (
    <nav className={clsx(styles.wrapper, className)}>
      {currentPage !== 1 ? (
        <PaginationLink page={currentPage - 1} className={styles.paginationItem}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </PaginationLink>
      ) : (
        <div />
      )}
      <div className={styles.paginationList}>
        {currentPage > PAGINATION_OFFSET + 2 && (
          <>
            <PaginationLink page={1} className={styles.paginationItem}>
              1
            </PaginationLink>
            <Ellipsis />
          </>
        )}
        {paginationPages.map((page) =>
          page === currentPage ? (
            <CurrentPage key={page} className={styles.paginationItem}>
              {page}
            </CurrentPage>
          ) : (
            <PaginationLink key={page} page={page} className={styles.paginationItem}>
              {page}
            </PaginationLink>
          )
        )}
        {currentPage + PAGINATION_OFFSET + 2 < totalPages && (
          <>
            <Ellipsis />
            <PaginationLink page={totalPages} className={styles.paginationItem}>
              {totalPages}
            </PaginationLink>
          </>
        )}
      </div>
      {currentPage !== totalPages ? (
        <PaginationLink page={currentPage + 1} className={styles.paginationItem}>
          <FontAwesomeIcon icon={faChevronRight} />
        </PaginationLink>
      ) : (
        <div />
      )}
    </nav>
  );
};
