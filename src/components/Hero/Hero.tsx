import Link from "next/link";
import SvgHeroImage from "./SvgHeroImage";
import AdSlot from "../AdSlot/AdSlot";

function Hero() {
  return (
    <section className="main-container">
      <div className="py-16 sm:py-24 flex justify-between gap-12">
        <div className="flex-1 flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
          <h1 className="max-w-md text-4xl font-black leading-tight tracking-[-0.033em] sm:text-5xl md:text-6xl">
            Challenge your vision with fun mini-tests 👁️
          </h1>
          <p className="text-base font-normal leading-normal sm:text-lg">
            Explore a series of quick visual challenges to put your color
            perception, shape recognition, detail detection, and contrast
            sensitivity to the test. Perfect for testing your abilities without
            overthinking, directly online.
          </p>
          <Link href="/tests" className="btn btn-primary btn-xl">
            Start a challenge
          </Link>
        </div>

        <div className="flex-1">
          <SvgHeroImage />
        </div>
      </div>

      <AdSlot />
    </section>
  );
}

export default Hero;
