import AcuityRingGame from "./AcuityRingGame";
import HeadingPage from "@/components/HeadingPage/HeadingPage";
import Info from "@/components/Info/Info";
import Suggestion from "@/components/Suggestion/Suggestion";
import AdSlot from "@/components/AdSlot/AdSlot";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visual Acuity Test (Landolt Ring) - EyeChallenge",
  description:
    "Test your visual acuity with the Landolt Ring chart. Identify the direction of the gap in the ring as it gets smaller. A classic test for sharpness of vision.",
};

export default function AcuityRingPage() {
  return (
    <>
      <section className="py-10 sm:py-18 main-container flex flex-col items-center">
        <HeadingPage
          title="Visual Acuity Test"
          description="This test measures the sharpness of your vision using the Landolt Ring. Identify the direction of the gap in the ring."
        />

        <AcuityRingGame />

        <Info
          title="Did you know?"
          description="The Landolt C (or Landolt ring) is a standardized optotype used for acuity testing. The test is considered the gold standard and is more repeatable than other tests."
        />

        <Suggestion />
      </section>
      <AdSlot />
    </>
  );
}
