// POST /contributions

import { Prisma } from "@prisma/client";
import { RequestHandler } from "express";
import { Services } from "../types";
import {
  AddContributionRequest,
  AddContributionResponse,
} from "common/server-api";

// Optional fields in body: content
// TODO: can grab location here from request using vercel edge function
// req.geo.city
// req.geo.country
// https://vercel.com/changelog/ip-geolocation-now-available-for-all-plans
// TODO: should we reject same answers?
export function addContribution({ prisma }: Services): RequestHandler {
  return async (req, res) => {
    const { walletId, response, prompt, pattern } =
      req.body as AddContributionRequest;

    // TODO: validate request, maybe use autogenerated zod

    try {
      const existingUser = await prisma.user.findFirst({
        where: { id: walletId },
      });
      if (!existingUser) {
        throw new Error("Please sign the document to add a contribution.");
      }

      const result = await prisma.contribution.create({
        data: {
          authorWalletId: walletId,
          response,
          prompt,
          pattern: pattern as any,
        },
      });

      res.json(result.id as AddContributionResponse);
    } catch (err) {
      console.log(err);
      if (err instanceof Prisma.PrismaClientValidationError) {
        res
          .status(400)
          .json({ error: `Received invalid data. ${err.message}` });
        return;
      }
      res.status(400).json({ error: err.message });
    }
  };
}
