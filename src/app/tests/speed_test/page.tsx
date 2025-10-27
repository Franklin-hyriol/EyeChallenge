import AdSlot from "@/components/AdSlot/AdSlot";
import HeadingPage from "@/components/HeadingPage/HeadingPage";
import Info from "@/components/Info/Info";
import SpeedTestGame from "./SpeedTestGame";

function SpeedTest() {
  return (
    <section className="py-10 sm:py-18 main-container flex flex-col items-center">
      <HeadingPage
        title="Reaction Speed Test"
        description="This test measures your visual processing speed and reaction time. Challenge your reflexes by clicking the target as soon as it appears."
      />

      <SpeedTestGame />

      <Info
        title="Did you know?"
        description="The average human reaction time to a visual stimulus is around 250 milliseconds. F1 drivers can get it down to under 100ms!"
      />

      <AdSlot />
    </section>
  );
}

export default SpeedTest;
