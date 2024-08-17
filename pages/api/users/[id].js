import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = session.user.id;
  const id = parseInt(req.query.id as string);

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          goals: true,
          activities: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch user" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}