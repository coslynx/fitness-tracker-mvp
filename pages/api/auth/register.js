import { getServerSession } from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session = await getServerSession({ req });
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }

    try {
      const user = await prisma.user.create({
        data: {
          email,
          password,
        },
      });

      return res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error && error.code === "P2002") {
        return res.status(409).json({ message: "Email already exists" });
      } else {
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}