// import classNames from "classnames"
import React, { useEffect, useRef } from "react"

// import { ContributionSection } from "../components/ContributionSection"
import Hero from "../components/Hero"
import { VisionBody } from "../components/VisionBody"
import { gsap } from "../helpers/gsap"

// import { ContributionCard } from "src/components/ContributionCard"

const useGsapEffects = () => {
  const visionContentRef = useRef<HTMLDivElement>(null)
  const fixedOpacity = 0.05

  useEffect(() => {
    gsap.fromTo(
      ".fadeInOnTermsOnContributionSection",
      { opacity: fixedOpacity },
      {
        opacity: 0.2,
        scrollTrigger: { trigger: "#contributionSection", scrub: true },
      },
    )
  }, [])

  useEffect(() => {
    gsap.fromTo(
      ".fadeOutOnScroll",
      { opacity: 1 },
      {
        opacity: fixedOpacity,
        scrollTrigger: {
          trigger: visionContentRef.current,
          start: 100,
          end: " top top",
          scrub: true,
        },
      },
    )
  }, [])

  useEffect(() => {
    gsap.fromTo(
      visionContentRef.current,
      { opacity: fixedOpacity },
      {
        opacity: 1,
        scrollTrigger: {
          trigger: visionContentRef.current,
          start: 0,
          end: "top top",
          scrub: true,
        },
      },
    )
  }, [])

  return { visionContentRef }
}
export const Main: React.FC = () => {
  const { visionContentRef } = useGsapEffects()
  // const { contributions } = useContext(ContributionsContext)

  return (
    <>
      <div className="fadeOutOnScroll">
        <Hero />
      </div>
      <div className="mainContent px-4 md:px-8">
        <div id="vision-content" ref={visionContentRef}>
          <article className="container w-full px-2 md:px-0 md:max-w-2xl mx-auto">
            <VisionBody />
          </article>
        </div>
        {/* <div
          id="contributionSection"
          className="container w-full md:max-w-4xl mx-auto my-64"
        >
          <ContributionSection />
        </div>
        <div id="contributions" ref={contributionsContentRef}>
          <div className="container w-full mx-auto my-32">
            <h2
              id="contributions"
              className="font-title text-6xl font-bold text-center shimmer"
            >
              Visions of a Regenerative Future
            </h2>
            {contributions?.length ? (
              <div className="my-16 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                {contributions.map((contribution, index) => (
                  <ContributionCard
                    key={contribution.id}
                    contribution={contribution}
                    className={classNames(
                      "mx-auto",
                      index === 0 && "highlight",
                    )}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div> */}
      </div>
    </>
  )
}
