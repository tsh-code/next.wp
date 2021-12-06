import type { NextApiRequest, NextApiResponse } from "next";

// eslint-disable-next-line import/no-anonymous-default-export
export default (_: NextApiRequest, res: NextApiResponse) => {
  try {
    res.clearPreviewData();

    return res.status(200).json({ message: "Everything clear!" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
