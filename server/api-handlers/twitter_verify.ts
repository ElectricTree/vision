import { Request, Response } from "express"
import { TwitterApi } from "twitter-api-v2"

import { Services } from "../types"

export const twitterVerify =
  ({ prisma }: Services) =>
  async (req: Request, res: Response) => {
    const { contributionId: id, signature, twitter } = req.body
    console.time("prisma.findFirst")
    const contribution = await prisma.contribution.findFirst({ where: { id } })
    console.timeEnd("prisma.findFirst")
    if (!id || !signature || !twitter || !contribution) {
      throw new Error("INVALID_PARAMS")
    }

    if (Boolean(contribution.signature)) {
      res.status(200).json({ message: "Already verified!" })
    } else if (await tweetWithSignature(twitter, signature)) {
      try {
        console.time("prisma.update")
        const { authorId } = contribution
        await prisma.$transaction([
          prisma.author.update({ where: { id: authorId }, data: { twitter } }),
          prisma.contribution.update({ where: { id }, data: { signature } }),
        ])
        res.status(201).json({ message: "Verified!" })
      } catch (error) {
        res.status(500).json({ message: (error as Error).message })
      } finally {
        console.timeEnd("prisma.update")
      }
    } else {
      res.status(404).json({ error: "No matching tweets found" })
    }
  }

const twitter = new TwitterApi(process.env.BEARER_TOKEN).readOnly.v2

const tweetWithSignature = async (username: string, signature: string) => {
  try {
    console.time("twitter")

    const { data: user } = await twitter
      .userByUsername(username)
      .catch(error => {
        console.error(`Failed to load user ${username}`)
        throw error
      })
    const { tweets } = await twitter.userTimeline(user.id).catch(error => {
      console.error(`Failed to load tweets ${user.id}`)
      throw error
    })

    return tweets.find(({ text }) => {
      const index = text.indexOf("sig:")
      return (
        index !== -1 &&
        text
          .slice(index + 4)
          .split(" ")[0]
          .trim() === signature
      )
    })
  } catch (error) {
    console.error(error.toJSON ? error.toJSON() : error.toString())
    return null
  } finally {
    console.timeEnd("twitter")
  }
}
