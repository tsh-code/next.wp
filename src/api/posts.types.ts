export type Author = {
  name: string;
  slug: string;
  avatar: {
    url: string;
  };
};

export type Term = {
  name: string;
  slug: string;
};

export type Post = {
  id: string;
  author: { node: Author };
  date: string;
  content: string;
  slug: string;
  title: string;
  categories: { edges: { node: Term }[] };
  tags: { edges: { node: Term }[] };
};
