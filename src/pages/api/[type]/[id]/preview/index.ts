import Cookies from "cookies";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import type { NextApiRequest, NextApiResponse } from "next";

import { getPageRevisions } from "api/pages";
import { getPostById, getPostRevisions } from "api/posts";

import { authorizationCookieName } from "utils/wordpress";

enum PreviewType {
  Post = "post",
  Page = "page",
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = new Cookies(req, res);

  if (!req.query.nonce) {
    return res.status(401).json({ message: "Invalid nonce token!" });
  }

  const cookieName = authorizationCookieName();
  const id = parseInt(req.query.id as string, 10);
  const headers = { "X-WP-Nonce": req.query.nonce as string, Cookie: `${cookieName}=${cookies.get(cookieName)}` };

  try {
    let revisions;

    if (req.query.type === PreviewType.Page) {
      const { data } = await getPageRevisions(id, { headers });
      revisions = data.page.revisions.edges;
    } else {
      const { data } = await getPostRevisions(id, { headers });
      revisions = data.post.revisions.edges;
    }

    const databaseId = revisions.find(({ node: { isPreview } }) => isPreview)?.node.databaseId || null;

    const {
      data: { post },
    } = databaseId ? await getPostById(databaseId, { headers }) : { data: { post: null } };

    if (!databaseId || !post) {
      res.status(200).json({ message: "No preview." });
      return;
    }

    const url =
      req.query.type === PreviewType.Page
        ? `/${post.slug}`
        : `/${format(parseISO(post.date), "yyyy/MM/dd")}/${post.slug}/`;

    res.setPreviewData({ id: databaseId, headers });
    res.redirect(url);
  } catch (error) {
    console.log(error);
    res.status(200).json({ error });
  }
};
