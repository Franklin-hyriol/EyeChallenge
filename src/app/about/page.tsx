import { Metadata } from "next";
import HeadingPage from "@/components/HeadingPage/HeadingPage";

export const metadata: Metadata = {
  title: "About EyeChallenge - Test Your Vision Online",
  description: "Discover EyeChallenge's mission, a platform of mini-games designed to evaluate and challenge your visual acuity, memory, and color perception.",
};

export default function AboutPage() {
  return (
    <section className="py-10 sm:py-18 main-container flex flex-col items-center">
      <HeadingPage
        title="EyeChallenge: Your Online Visual Playground"
        description="Welcome to EyeChallenge, your destination for fun and quick mini-games designed to put your vision and visual memory to the test."
      />
      <div className="prose lg:prose-xl text-center max-w-4xl mx-auto">
        <p className="mb-4">
          Our platform offers a collection of stimulating challenges, lasting from 10 to 30 seconds, each targeting a specific facet of your visual abilities: color perception, acuity, reaction speed, and much more.
        </p>

        <h2 className="mb-2">Our Mission: Making Visual Testing Accessible and Fun</h2>
        <p className="mb-4">
          Our goal is to provide engaging tools that allow you to better understand your own visual capabilities in a playful way. Whether out of curiosity or for simple entertainment, EyeChallenge is the ideal place for a quick and informal self-test.
        </p>

        <h2 className="mb-2">Important Medical Disclaimer</h2>
        <p className="mb-4">
          It is essential to understand that EyeChallenge is an application for entertainment and informational purposes only. <strong>Our tests do not constitute professional medical diagnosis in any way.</strong> If you have any concerns or vision problems, it is imperative to consult an ophthalmologist or another qualified specialist.
        </p>

        <h2 className="mb-2">Contribute to Our Evolution</h2>
        <p className="mb-4">
          Your feedback is invaluable! We are constantly evolving and appreciate input from our community. If you have a suggestion to improve our platform, an idea for a new test, or if you have spotted a bug, please do not hesitate to let us know via our <strong>contact page</strong> or by email.
        </p>
        <p className="mb-4">
          Developed by: <strong>Franklin Hyriol</strong>
          <br />
          <a href="mailto:franklinrazafy@gmail.com" className="text-primary font-bold">franklinrazafy@gmail.com</a>
          <br />
          <a href="https://www.linkedin.com/in/franklin-hyriol-razafinandrasana-4b9a71217/" target="_blank" rel="noopener noreferrer" className="text-primary font-bold">LinkedIn Profile</a>
        </p>
      </div>
    </section>
  );
}
