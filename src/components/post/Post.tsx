import { Fragment } from "react";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import { Element } from "domhandler/lib/node";
import parseHTML, { HTMLReactParserOptions } from "html-react-parser";
import Link from "next/link";
import { pl } from "date-fns/locale";

import { Avatar } from "./avatar/Avatar";
import { Category } from "./category/Category";

import { PostProps } from "./Post.types";
import styles from "./Post.module.scss";

export const Post = ({
  post: {
    author: { node: author },
    date,
    content,
    slug,
    title,
    categories: { edges: categories },
  },
  isExcerpt,
}: PostProps) => {
  const currentPostHref = `/${format(parseISO(date), "yyyy/MM/dd")}/${slug}/`;
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.attribs.class === "read-more") {
        return (
          <div className={styles.readMore}>
            <Link href={currentPostHref}>
              <a>Czytaj dalej</a>
            </Link>
          </div>
        );
      }
    },
  };

  return (
    <article className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.categories}>
          {categories.map(({ node }, index) => (
            <Fragment key={node.slug}>
              <Category {...node} />
              {index !== categories.length - 1 && ", "}
            </Fragment>
          ))}
        </div>
        {isExcerpt ? (
          <h2 className={styles.title}>
            <Link href={currentPostHref}>
              <a>{title}</a>
            </Link>
          </h2>
        ) : (
          <h1 className={styles.title}>{title}</h1>
        )}
        <span className={styles.date}>{format(parseISO(date), "do MMMM yyyy", { locale: pl })}</span>
      </header>
      <div className={styles.content}>{parseHTML(content, options)}</div>
      <footer className={styles.footer}>
        <Avatar {...author} />
      </footer>
    </article>
  );
};
