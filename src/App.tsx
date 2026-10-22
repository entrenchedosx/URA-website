import { Decompiler } from "./components/Decompiler";
import { Downloads } from "./components/Downloads";
import { Docs } from "./components/Docs";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { InteractiveDemo } from "./components/InteractiveDemo";
import { Interfaces } from "./components/Interfaces";
import { Navbar } from "./components/Navbar";
import { OpenSource } from "./components/OpenSource";
import { Progress } from "./components/Progress";
import { Roadmap } from "./components/Roadmap";
import { Showcase } from "./components/Showcase";

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Showcase />
        <Features />
        <Decompiler />
        <Interfaces />
        <InteractiveDemo />
        <Progress />
        <Downloads />
        <Roadmap />
        <Docs />
        <OpenSource />
      </main>
      <Footer />
    </>
  );
}
