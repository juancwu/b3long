import { SimulationNodeDatum } from "d3";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from "../../lib/prisma";
import axios from "axios";

export interface DiscordGuildData extends SimulationNodeDatum {
  id: string;
  name: string;
  icon: string | null;
  iconType: "gif" | "png";
  isCenter: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  const discordApi = "https://discord.com/api";

  if (!session) {
    return res.status(401).json({
      message: "You must be logged in.",
    });
  }

  if (session.user && session.user.email) {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        accounts: {
          take: 1,
        },
      },
    });

    if (user) {
      const axiosRes = await axios.get(`${discordApi}/users/@me/guilds`, {
        headers: {
          Authorization: `Bearer ${user.accounts[0].access_token}`,
        },
        responseType: "json",
      });

      const nodes: DiscordGuildData[] = axiosRes.data;
      // check for icon type
      for (let node of nodes) {
        if (!node.icon) {
          continue;
        }

        try {
          await axios.get(
            `https://cdn.discordapp.com/icons/${node.id}/${node.icon}.gif?size=128`
          );
          node.iconType = "gif";
        } catch (error) {
          node.iconType = "png";
        }
      }

      return res.status(200).json({
        nodes,
      });
    }
  }

  return res.status(404).json({
    message: "Could not find any data.",
  });
}
