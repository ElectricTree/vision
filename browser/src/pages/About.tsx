import { useContext } from "react"
import { ContributionCard } from "src/components/ContributionCard"
import { ContributionsContext } from "src/helpers/contexts/ContributionsContext"
import { Contribution } from "src/types/common/server-api"

// TODO
const CoreStewards = new Set([0])

export function About() {
  const { contributions } = useContext(ContributionsContext)
  const stewardContributions: Contribution[] = contributions.filter(c =>
    CoreStewards.has(c.id),
  )

  return (
    <div>
      <div className="container w-full md:px-0 md:max-w-2xl mx-auto pb-6 md:pb-12 px-4 md:px-8">
        <h2 className="font-title text-3xl pt-12 md:pt-16 font-bold pb-3">
          About This Artifact
        </h2>
        <div className="text-center">
          <h3 className="font-title text-3xl pt-8 md:pt-16 pb-0 text-center pb-2">
            stewards 🌱
          </h3>
          <p className="pt-0 text-xl">
            <a href="">Dave</a> <a href="">Cyrus</a>
          </p>
          <p className="!text-left">
            The above people stewarded this artifact to completion, but so many
            have given attention and care to making this piece a reality. A
            gallery of those contributors' cards lie below.
          </p>
        </div>
      </div>
      <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 justify-center mx-auto max-w-max gap-6 mt-2 mb-8">
        {stewardContributions.map(contribution => (
          <ContributionCard contribution={contribution} key={contribution.id} />
        ))}
      </div>
    </div>
  )
}
