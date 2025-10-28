import AdSlot from "@/components/AdSlot/AdSlot";
import HeadingPage from "@/components/HeadingPage/HeadingPage";
import Info from "@/components/Info/Info";
import PrecisionPerceptionGame from "./PrecisionPerceptionGame";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Precision Perception Test - Spot the Difference | EyeChallenge",
  description:
    "Test your visual precision by identifying the slightly larger circle. A quick and engaging challenge to assess your ability to detect subtle visual differences.",
};

function PrecisionPerceptionPage() {
  return (
    <section className="py-10 sm:py-18 main-container flex flex-col items-center">
      <HeadingPage
        title="Precision Perception Test"
        description="This test evaluates your ability to detect subtle differences in size between similar objects."
      />

      <PrecisionPerceptionGame />

      <Info
        title="Did you know?"
        description="The human eye can distinguish between two objects that differ in size by as little as 1-2% under optimal conditions."
      />

      <AdSlot />
    </section>
  );
}

export default PrecisionPerceptionPage;
