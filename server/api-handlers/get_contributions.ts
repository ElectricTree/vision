// GET /contributions

import { Prisma } from "@prisma/client"
import { RequestHandler } from "express"

import {
  Contribution,
  ContributionLimit,
  GetContributionsRequest,
} from "../common/server-api"
import { Services } from "../types"

// Optional fields in body: content
export function getContributions({ prisma }: Services): RequestHandler {
  return async (req, res) => {
    try {
      const { offset = 0, contributionId: highlightedContributionId } =
        req.query as GetContributionsRequest
      const contributionId = Number(highlightedContributionId)

      // TODO: validate request, maybe use autogenerated zod
      const contributions = []
      if (contributionId) {
        const highlightedContribution = await prisma.contribution.findFirst({
          where: { id: contributionId },
          include: {
            author: true,
          },
        })
        if (highlightedContribution) {
          contributions.push(highlightedContribution)
        }
      }

      const storageContributions = await prisma.contribution.findMany({
        where: {
          id: { not: contributionId ? contributionId : undefined },
          rank: { gte: 0 },
        },
        orderBy: [{ rank: "desc" }, { createdAt: "asc" }],
        include: {
          author: true,
        },
        skip: offset,
        take: ContributionLimit,
      })

      contributions.push(...storageContributions)

      res.status(200).json(
        contributions.map(contribution => ({
          ...contribution,
          author: {
            ...contribution.author,
            walletId: contribution.author.id,
          },
        })) as Contribution[],
      )
    } catch (err) {
      console.log(err)
      if (err instanceof Prisma.PrismaClientValidationError) {
        res.status(400).json({ error: `Received invalid data. ${err.message}` })
        return
      }
      res.status(400).json({ error: err.message })
    }
  }
}
