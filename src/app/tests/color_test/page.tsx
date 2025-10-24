import AdSlot from "@/components/AdSlot/AdSlot";
import HeadingPage from "@/components/HeadingPage/HeadingPage";
import Info from "@/components/Info/Info";
import Suggestion from "@/components/Suggestion/Suggestion";
import ColorTestGame from "./ColorTestGame";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Sensitivity Test - Test Your Color Vision Online | EyeChallenge",
  description:
    "How well do you distinguish colors? Take our free online Color Sensitivity Test to evaluate your ability to perceive subtle color nuances. A fun and quick challenge for your eyes.",
};

function ColorTest() {
  return (
    <section className="py-10 sm:py-18 main-container flex flex-col items-center">
      <HeadingPage
        title="Color Sensitivity Test"
        description="This test evaluates your ability to distinguish color nuances. The difficulty
          increases progressively to refine your chromatic sensitivity score."
      />

      <ColorTestGame />

      <Info
        title="Did you know?"
        description="The human eye can distinguish about 10 million different colors. However, some people, like tetrachromats, can see up to 100 million!"
      />

      <Suggestion />

      <AdSlot />
    </section>
  );
}

export default ColorTest;
