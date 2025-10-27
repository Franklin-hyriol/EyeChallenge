import AdSlot from "@/components/AdSlot/AdSlot";
import HeadingPage from "@/components/HeadingPage/HeadingPage";
import Info from "@/components/Info/Info";
import NightVisionGame from "./NightVisionGame";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Night Vision Test - How Well Do You See in the Dark? | EyeChallenge",
  description:
    "Test your ability to detect low-contrast objects in the dark. This challenge measures your night vision adaptation by tracking your reaction time to a slowly appearing target.",
};

function NightVisionPage() {
  return (
    <section className="py-10 sm:py-18 main-container flex flex-col items-center">
      <HeadingPage
        title="Night Vision Test"
        description="This test evaluates your ability to perceive low-contrast stimuli in a dark environment, a key aspect of night vision."
      />

      <NightVisionGame />

      <Info
        title="Did you know?"
        description="Human eyes can take up to 30-45 minutes to fully adapt to darkness. This process, called dark adaptation, significantly increases your sensitivity to light."
      />

      <AdSlot />
    </section>
  );
}

export default NightVisionPage;
