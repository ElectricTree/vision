import { Canvas } from "@react-three/fiber";
import UniverseScene from "./components/UniverseScene";
import { DevelopmentBanner } from "./components/DevelopmentBanner";
import { Routes, Route } from "react-router-dom";
import { About } from "./pages/About";
import { ContributionsPage } from "./pages/ContributionsPage";
import { Navbar } from "./components/Navbar";
import { Main } from "./pages/Main";
import { UserProvider } from "./helpers/user";
import { ArweaveProvider } from "./helpers/contexts/ArweaveContext";
import { ModalProvider } from "./helpers/contexts/ModalContext";
import { ContributionsProvider } from "./helpers/contexts/ContributionsContext";
import BlobContributionsScissorCanvasRendererWithContributions from "./components/BlobContributionsScissorCanvasRendererWithContributions";
import { StatsProvider } from "./helpers/contexts/StatsContext";

function App() {
  return (
    <div className="mainContainer">
      <main>
        <DevelopmentBanner />
        <Navbar />
        <UserProvider>
          <ArweaveProvider>
            <ContributionsProvider>
              <BlobContributionsScissorCanvasRendererWithContributions />
              <ModalProvider>
                <StatsProvider>
                  <Routes>
                    <Route index={true} element={<Main />} />
                    <Route path="about" element={<About />} />
                    <Route
                      path="contributions"
                      element={<ContributionsPage />}
                    />
                    <Route
                      path="contributions/:contributionId"
                      element={<ContributionsPage />}
                    />
                  </Routes>
                </StatsProvider>
              </ModalProvider>
            </ContributionsProvider>
          </ArweaveProvider>
        </UserProvider>
        <footer className="pt-2 pb-16">
          <span>
            a drop from <a href="https://verses.xyz">Verses</a>, which is
            supported with 💜&nbsp; by <a href="https://gitcoin.co">Gitcoin</a>{" "}
            and <a href="https://fil.org/">Filecoin Foundation</a>
          </span>
        </footer>
      </main>
      <Routes>
        <Route
          index={true}
          element={
            <>
              <div className="canvas-container fadeOutOnScroll fadeInOnTermsOnContributionSection">
                <Canvas camera={{ position: [0, 0, 20], fov: 50 }}>
                  <UniverseScene />
                </Canvas>
              </div>
            </>
          }
        />
        <Route path="about" />
        <Route path="contributions*" />
      </Routes>
      <div className="universe-gradient" />
    </div>
  );
}

export default App;
