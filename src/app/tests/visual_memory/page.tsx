import VisualMemoryGame from "./VisualMemoryGame";
import HeadingPage from "@/components/HeadingPage/HeadingPage";
import Info from "@/components/Info/Info";
import Suggestion from "@/components/Suggestion/Suggestion";
import AdSlot from "@/components/AdSlot/AdSlot";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visual Memory Test - EyeChallenge",
  description: "How good is your visual short-term memory? Memorize the shapes and then identify them. A test of focus and memory.",
};

export default function VisualMemoryPage() {
  return (
    <section className="py-10 sm:py-18 main-container flex flex-col items-center">
      <HeadingPage
        title="Visual Memory Test"
        description="Memorize the highlighted shapes. The number of shapes to remember will increase with each level."
      />

      <VisualMemoryGame />

      <Info
        title="Did you know?"
        description="Visual memory is a key part of cognitive function. It involves the ability to store and recall visual information. Like any skill, it can be improved with practice!"
      />

      <Suggestion />

      <AdSlot />
    </section>
  );
}
