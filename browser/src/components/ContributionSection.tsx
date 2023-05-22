import "./ContributionSection.css"

import classNames from "classnames"
import sample from "lodash/sample"
import React, { useContext, useEffect, useState } from "react"
import { BiErrorCircle } from "react-icons/bi"
import { MdArrowForward } from "react-icons/md"
import { addAuthor, addContribution, verifyTwitter } from "src/helpers/api"
import { getAuthor } from "src/helpers/api"
import { AuthorContext } from "src/helpers/author"
import { ContributionsContext } from "src/helpers/contexts/ContributionsContext"
import { StatsContext } from "src/helpers/contexts/StatsContext"
import { buttonClass } from "src/types/styles"

import {
  Contribution,
  Prompt,
  Prompts,
  Sense,
} from "../types/common/server-api"
import { ContributionCard } from "./ContributionCard"
import { AutoGrowInput } from "./core/AutoGrowInput"
import { Checkmark } from "./core/Checkmark"
import { Dropdown, DropdownItem } from "./core/Dropdown"

const ResponseCharacterLimit = 99

export const SensePrompts: Record<Sense, string> = {
  [Sense.LooksLike]: `looks like`,
  [Sense.FeelsLike]: `feels like`,
  [Sense.SeemsLike]: `seems like`,
}

const PreviewCard: React.FC<
  Omit<Contribution, "id" | "authorId" | "createdAt" | "priority"> & {
    className?: string
  }
> = ({ className = "", response = "...", ...contribution }) => (
  <ContributionCard
    className={classNames(`preview-card !w-auto md:!w-full`, className)}
    contribution={{
      ...contribution,
      response,
      id: 0,
      authorId: "",
      priority: 0,
      createdAt: new Date(),
    }}
  />
)

const PAGES = ["contribute", "share", "complete"] as const

export function ContributionSection() {
  const { currentAuthor, setCurrentAuthor, connectWallet, signAndValidate } =
    useContext(AuthorContext)
  const { getContribution, getContributions, setContributions } =
    useContext(ContributionsContext)
  const { stats, fetchStats } = useContext(StatsContext)

  const [signature, setSignature] = useState("")
  const [selectedSense, setSelectedSense] = useState<Sense>(Sense.LooksLike)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt>("Children")
  const [promptResponse, setPromptResponse] = useState(() =>
    sample(["serendipity", "flourishing", "blossoming"]),
  )
  const response = `When I imagine ${Prompts[selectedPrompt]}, it ${SensePrompts[selectedSense]} ${promptResponse}`

  const PromptItems: DropdownItem[] = Object.entries(Prompts).map(
    ([name, prompt]) => ({
      name,
      displayName: prompt,
      onClick: () => setSelectedPrompt(name as Prompt),
    }),
  )

  useEffect(() => {
    setSignature("")
  }, [promptResponse])

  const SenseItems: DropdownItem[] = Object.entries(SensePrompts).map(
    ([name, sense]) => ({
      name,
      displayName: sense,
      onClick: () => setSelectedSense(name as Sense),
    }),
  )

  type Page = "contribute" | "share" | "complete"
  const [page, setPage] = useState<Page>("contribute")

  const pageIndex = PAGES.indexOf(page)
  const nextPage =
    pageIndex + 1 < PAGES.length && (PAGES[pageIndex + 1] as Page)

  type State = "sign" | "tweet" | "verify" | "complete"
  const [step, setStep] = useState<State>("sign")

  const [isStepLoading, setStepLoading] = useState({
    sign: false,
    tweet: false,
    verify: false,
  })
  const [error, setError] = useState<string>()
  const handleErr = (err: Error) => setError(err.message)

  const [contribution, setContribution] = useState<Contribution>()

  const findOrCreateAuthor = async (id: string, twitter = "") =>
    currentAuthor.id === id
      ? currentAuthor
      : (await getAuthor({ id })) ?? (await addAuthor({ id, twitter }))

  return (
    <>
      <div id="contribute" className="contributionSection text-base">
        <div className="pageProgressContainer mb-8">
          {PAGES.map(p => (
            <div
              key={p}
              className={classNames(
                "pageProgress",
                page == p && "selectedPageProgress",
              )}
            />
          ))}
        </div>
        {page === "contribute" ? (
          <div className="signContainer">
            <div className="contributionContainer md:grid flex flex-col items-stretch justify-center">
              <div className="selects pr-4">
                <div className="responseContainer w-full pl-16">
                  <p className="text-lg">
                    This vision board is a participatory art piece, where you,
                    vision, become a part of our whole.
                  </p>
                  <div className="flex">
                    <p className="text-lg pb-2">
                      What does <span className="shimmer">Electric Tree</span>{" "}
                      mean to you?
                    </p>
                    <span className="flex-grow" />
                    <p className="text-lg opacity-50 mb-0 pb-2">
                      {promptResponse?.length || 0} / {ResponseCharacterLimit}
                    </p>
                  </div>

                  <label className="block">
                    <Dropdown
                      items={PromptItems}
                      className="patternSelect w-full"
                      selectedItemName={Prompts[selectedPrompt]}
                    />
                  </label>

                  <label className="block">
                    <Dropdown
                      items={SenseItems}
                      className="patternSelect w-full"
                      selectedItemName={SensePrompts[selectedSense]}
                    />
                  </label>

                  <label>
                    <AutoGrowInput
                      value={promptResponse}
                      onChange={setPromptResponse}
                      className="responseInput"
                      extraProps={{
                        placeholder: "",
                        maxLength: ResponseCharacterLimit,
                      }}
                    />
                  </label>
                </div>
              </div>
              {currentAuthor && (
                <PreviewCard
                  className="ml-12 mr-auto"
                  signature={signature}
                  author={currentAuthor}
                  prompt={selectedPrompt}
                  response={response}
                  sense={selectedSense}
                />
              )}
            </div>
          </div>
        ) : page === "share" ? (
          <div className="signContainer">
            <h2 className="text-2xl font-bold text-center shimmer">
              Share your vision and get greenlisted
            </h2>
            <div className="ShareContainer md:grid contributionContainer flex flex-col items-stretch justify-center">
              <PreviewCard
                className="ml-auto mr-12"
                signature={contribution?.signature ?? ""}
                author={currentAuthor}
                prompt={selectedPrompt}
                response={`When I imagine ${Prompts[selectedPrompt]}, it ${SensePrompts[selectedSense]} ${promptResponse}`}
                sense={selectedSense}
              />
              <ol className="list-decimal list-inside mt-2">
                <p
                  className="text-xl"
                  style={{ opacity: step === "sign" ? 1 : 0.3 }}
                >
                  <li>Connect your wallet to sign your vision!</li>
                  <button
                    disabled={step !== "sign" || isStepLoading.sign}
                    className={buttonClass("mt-3")}
                    onClick={async () => {
                      try {
                        setStepLoading(s => ({ ...s, sign: true }))
                        const address = await connectWallet()
                        await Promise.all([
                          new Promise(resolve => setTimeout(resolve, 1000)),
                          findOrCreateAuthor(address).then(setCurrentAuthor),
                        ])
                        await signAndValidate(response).then(setSignature)
                        setStepLoading(s => ({ ...s, sign: false }))
                        setStep("tweet")
                        setError(undefined)
                      } catch (error) {
                        setStep("sign")
                        handleErr(error as Error)
                      }
                    }}
                  >
                    {isStepLoading.sign
                      ? "Signing "
                      : signature
                      ? "Signed "
                      : "Sign "}
                    with Ethereum
                  </button>
                </p>
                <p
                  className="text-xl"
                  style={{ opacity: step === "tweet" ? 1 : 0.3 }}
                >
                  <li>Tweet to verify your contribution!</li>
                  <button
                    disabled={step === "sign" || isStepLoading.tweet}
                    className={buttonClass("mt-2")}
                    onClick={async () => {
                      try {
                        setStepLoading(s => ({ ...s, tweet: true }))

                        const created = addContribution({
                          authorId: currentAuthor.id,
                          prompt: selectedPrompt,
                          sense: selectedSense,
                          response,
                        })

                        const tweetTextParam = encodeURIComponent(
                          `When I imagine @TheEdenDao, it ${SensePrompts[selectedSense]} ${promptResponse} sig:${signature}`,
                        )
                        window.open(
                          `https://twitter.com/intent/tweet?text=${tweetTextParam}`,
                          "_blank",
                        )

                        const [cc] = await Promise.all([created, fetchStats()])
                        const cs = await getContributions({ offset: 0 }).then(
                          cs => cs.flatMap(c => (c.id === cc.id ? [] : [c])),
                        )
                        setContribution(cc)
                        setContributions([cc, ...cs])

                        setStep("verify")
                        setError(undefined)
                      } catch (error) {
                        setStep("tweet")
                        handleErr(error as Error)
                      } finally {
                        setStepLoading(s => ({ ...s, tweet: false }))
                      }
                    }}
                  >
                    Announc
                    {step === "verify"
                      ? "ed "
                      : isStepLoading.tweet
                      ? "ing "
                      : "e "}
                    on Twitter
                  </button>
                </p>
                <p
                  className="text-xl"
                  style={{ opacity: step === "verify" ? 1 : 0.3 }}
                >
                  <li>
                    What is your Twitter username?
                    <span style={{ position: "relative", top: -2, left: 4 }}>
                      <Checkmark />
                    </span>
                  </li>
                  <div className="flex mt-1">
                    <input
                      className="pb-2 px-4 mr-2 rounded-full"
                      disabled={step !== "verify"}
                      maxLength={24}
                      value={`@${currentAuthor.twitter}`}
                      onChange={event => {
                        setCurrentAuthor(author => ({
                          ...author,
                          twitter: event.target.value.replaceAll("@", ""),
                        }))
                      }}
                    />
                    <button
                      onClick={async () => {
                        try {
                          if (!contribution) {
                            throw new Error("Missing contribution")
                          }

                          setStepLoading(s => ({ ...s, verify: true }))

                          await Promise.all([
                            fetchStats(),
                            verifyTwitter({
                              contributionId: contribution.id,
                              twitter: currentAuthor.twitter,
                              signature,
                            }),
                          ])

                          const [cc, cs] = await Promise.all([
                            getContribution({ id: contribution.id }),
                            getContributions({ offset: 0 }).then(cs =>
                              cs.flatMap(c =>
                                c.id === contribution.id ? [] : [c],
                              ),
                            ),
                          ])

                          setContribution(cc)
                          setContributions([cc, ...cs])
                          setStep("complete")
                          setError(undefined)
                        } catch (error) {
                          setStep("verify")
                          handleErr(error as Error)
                        } finally {
                          setStepLoading(s => ({ ...s, verify: false }))
                        }
                      }}
                      disabled={
                        step === "sign" ||
                        !!contribution?.signature ||
                        isStepLoading.verify
                      }
                      className={buttonClass()}
                      style={{ paddingBottom: 15 }}
                    >
                      {contribution?.signature
                        ? "Verified!"
                        : isStepLoading.verify
                        ? "Verifying"
                        : "Verify"}
                    </button>
                  </div>
                </p>
              </ol>
            </div>
          </div>
        ) : page === "complete" ? (
          <div className="welcome">
            <div className="flex mb-6">
              <h2 className="text-3xl font-bold shimmer">
                Thanks, new friend.
              </h2>
            </div>
            {stats && (
              <>
                <p className="text-2xl">
                  You have joined the choir of
                  <strong className="shimmer">
                    {stats.contributionsTotal} beautiful voices
                  </strong>{" "}
                  on the path towards regeneration.
                </p>
                <p className="text-2xl">
                  And ✅ greenlisted for future drops 🌱.
                </p>
              </>
            )}
          </div>
        ) : null}
        {error && (
          <div className="errorContainer text-red-500 flex items-center gap-1 justify-center text-xl ml-4">
            <BiErrorCircle /> {error}
          </div>
        )}
        {nextPage && (
          <div className="flex flex-col md:flex-row mt-8 contributionNavigation mb-4">
            {nextPage && (
              <button
                className={buttonClass(
                  `md:ml-auto bg-gray-600 rounded-full inline-flex gap-1 items-center mt-2 md:mt-0`,
                )}
                disabled={page === "share" && !contribution?.signature}
                onClick={() => setPage(nextPage)}
              >
                Next
                <MdArrowForward
                  className="ml-1"
                  style={{ marginTop: -4, marginRight: -4 }}
                />
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}
