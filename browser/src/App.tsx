import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import { Route, Routes } from "react-router-dom"

import BlobContributionsScissorCanvasRendererWithContributions from "./components/BlobContributionsScissorCanvasRendererWithContributions"
import { LoadingIndicator } from "./components/core/LoadingIndicator"
import { Navbar } from "./components/Navbar"
import UniverseScene from "./components/UniverseScene"
import { AuthorProvider } from "./helpers/author"
import { ContributionsProvider } from "./helpers/contexts/ContributionsContext"
import { StatsProvider } from "./helpers/contexts/StatsContext"
import { Main } from "./pages/Main"

export default function App() {
  return (
    <div className="mainContainer">
      <main>
        {/* <DevelopmentBanner /> */}
        <Navbar />
        <AuthorProvider>
          <ContributionsProvider>
            <BlobContributionsScissorCanvasRendererWithContributions />
            <StatsProvider>
              <Routes>
                <Route index={true} element={<Main />} />
              </Routes>
            </StatsProvider>
          </ContributionsProvider>
        </AuthorProvider>
        <footer className="pt-2 pb-16 px-2 text-center">
          <span>
            a drop from{" "}
            <a href="https://twitter.com/TheEdenDao">Electric Tree</a>, which is
            grateful to <a href="https://verses.xyz">Verses</a> for their{" "}
            <a href="https://pluriverse.world">Pluriverse</a>
          </span>
        </footer>
      </main>
      <Routes>
        <Route
          index={true}
          element={
            <>
              <div className="canvas-container fadeOutOnScroll fadeInOnTermsOnContributionSection">
                <Suspense fallback={<LoadingIndicator />}>
                  <Canvas
                    camera={{ position: [0, 0, 20], fov: 50 }}
                    frameloop="demand"
                  >
                    <UniverseScene />
                  </Canvas>
                </Suspense>
              </div>
            </>
          }
        />
        <Route path="about" />
        <Route path="contributions/*" />
      </Routes>
      <div className="universe-gradient" />
    </div>
  )
}
