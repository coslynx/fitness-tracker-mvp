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
      const activities = await prisma.activity.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json(activities);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch activities" });
    }
  } else if (req.method === "POST") {
    const { type, duration, calories, date, goalId } = req.body;

    if (!type || !duration || !calories || !date) {
      return res
        .status(400)
        .json({ message: "Missing required fields: type, duration, calories, date" });
    }

    try {
      const activity = await prisma.activity.create({
        data: {
          type,
          duration,
          calories,
          date: new Date(date),
          userId,
          goalId: goalId ? parseInt(goalId) : null,
        },
      });

      return res.status(201).json(activity);
    } catch (error) {
      return res.status(500).json({ message: "Failed to create activity" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}