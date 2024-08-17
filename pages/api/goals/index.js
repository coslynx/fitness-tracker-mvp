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

  if (req.method === "GET") {
    try {
      const goals = await prisma.goal.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json(goals);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch goals" });
    }
  } else if (req.method === "POST") {
    const { name, target, deadline } = req.body;

    if (!name || !target || !deadline) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const goal = await prisma.goal.create({
        data: {
          name,
          target,
          deadline,
          userId,
        },
      });

      return res.status(201).json(goal);
    } catch (error) {
      return res.status(500).json({ message: "Failed to create goal" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}