import { addAsync } from "@awaitjs/express"
import { PrismaClient } from "@prisma/client"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import { ApiErrorsMiddleware } from "express-error-middleware"

import { addAuthor } from "./api-handlers/add_author"
import { addContribution } from "./api-handlers/add_contribution"
import { getAuthor } from "./api-handlers/get_author"
import { getAuthors } from "./api-handlers/get_authors"
import { getContribution } from "./api-handlers/get_contribution"
import { getContributions } from "./api-handlers/get_contributions"
import { getGreenlistStatus } from "./api-handlers/get_greenlist_status"
import { getStats } from "./api-handlers/get_stats"
import { twitterVerify } from "./api-handlers/twitter_verify"

dotenv.config()

const app = addAsync(express())
app.use(express.json())

const origin = process.env.ORIGIN || "http://localhost:3000"
const visionCORS = cors({ origin })

const prisma = new PrismaClient()
const services = { prisma }

app.options("/greenlist/:address", cors())
app.getAsync("/greenlist/:address", cors(), getGreenlistStatus(services))

app.options("/authors/", visionCORS)
app.postAsync("/authors/", visionCORS, addAuthor(services))
app.getAsync("/authors/", visionCORS, getAuthors(services))
app.options("/authors/:id", visionCORS)
app.getAsync("/authors/:id", visionCORS, getAuthor(services))

app.options("/contributions/", visionCORS)
app.getAsync("/contributions/", visionCORS, getContributions(services))
app.options("/contributions/:id", visionCORS)
app.getAsync("/contributions/:id", visionCORS, getContribution(services))
app.postAsync("/contributions/", visionCORS, addContribution(services))

app.options("/twitter/verify", visionCORS)
app.postAsync("/twitter/verify", visionCORS, twitterVerify(services))

app.options("/stats", visionCORS)
app.getAsync("/stats", visionCORS, getStats(services))

// Health Check
app.get("/ping", (_, res) => res.status(200).send("PONG"))

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`Express is listening at ${port}`))
