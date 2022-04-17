// POST /verify/:handle
// must include signature in json body

import { RequestHandler } from "express"
import Twitter from "twitter"

import { VerifyTwitterRequest } from "../common/server-api"
import { Services } from "../types"

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  bearer_token: process.env.BEARER_TOKEN,
})

// signature is their handle signed with their address
export function verify({ prisma }: Services): RequestHandler {
  return async (req, res) => {
    const {
      walletId,
      twitterUsername,
      signature: inputSig,
    } = req.body as VerifyTwitterRequest

    try {
      const existingUser = await prisma.user.findFirst({
        where: { id: walletId },
      })

      if (!existingUser) {
        throw new Error("No error found for the given wallet address.")
      }

      const { twitterVerified, signature } = existingUser

      if (signature !== inputSig) {
        res.status(401).json({ error: `Signature does not match!` })
        return
      }

      if (twitterVerified) {
        console.log(`already verified user: @${existingUser.twitterUsername}`)
        res.status(200).json({ message: "already verified!" })
        return
      }

      client.get(
        "statuses/user_timeline",
        {
          screen_name: twitterUsername,
          include_rts: false,
          count: 25,
          tweet_mode: "extended",
        },
        async (error, tweets) => {
          if (error) {
            console.log(error)
            res.status(500).json({ error: "Internal Error" })
            return
          }

          const tweetsWithSig = tweets.filter(t => t.full_text.includes("sig:"))

          for (const tweet of tweetsWithSig as any) {
            const tweetText = tweet.full_text
            const parsedSignature = tweetText
              .slice(tweetText.indexOf("sig:") + 4)
              .split(" ")[0]
            if (parsedSignature === signature) {
              await prisma.user.update({
                where: { id: walletId },
                data: {
                  twitterVerified: true,
                  twitterUsername,
                },
              })

              console.log(
                `new verified user: @${twitterUsername}, ${signature}`,
              )
              res.status(201).json({ message: "success!" })
              return
            }
          }
          res.status(400).json({ error: "No matching Tweets found" })
        },
      )
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}
