import AdSlot from "@/components/AdSlot/AdSlot";
import HeadingPage from "@/components/HeadingPage/HeadingPage";
import Info from "@/components/Info/Info";
import IshiharaGame from "./IshiharaGame";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ishihara Color Blindness Test - Check Your Vision Online | EyeChallenge",
  description:
    "Take our free online Ishihara test to check for color blindness. This test uses classic plates to assess your ability to distinguish between different colors.",
};

function IshiharaPage() {
  return (
    <section className="py-10 sm:py-18 main-container flex flex-col items-center">
      <HeadingPage
        title="Ishihara Color Blindness Test"
        description="This test is designed to provide a quick assessment of color vision deficiency. Identify the numbers hidden in the dotted plates."
      />

      <IshiharaGame />

      <Info
        title="Did you know?"
        description="The Ishihara test was named after its designer, Dr. Shinobu Ishihara, a professor at the University of Tokyo, who first published his tests in 1917."
      />

      <AdSlot />
    </section>
  );
}

export default IshiharaPage;
