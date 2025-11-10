import { Metadata } from "next";
import HeadingPage from "@/components/HeadingPage/HeadingPage";

export const metadata: Metadata = {
  title: "Contact Us - EyeChallenge",
  description: "Get in touch with the EyeChallenge team.",
};

export default function ContactPage() {
  return (
    <section className="py-10 sm:py-18 main-container flex flex-col items-center">
      <HeadingPage
        title="Contact Us"
        description="We'd love to hear from you. Please fill out the form below to get in touch."
      />
      <div className="prose lg:prose-xl text-center max-w-4xl mx-auto">
        <p>
          If you have any questions, feedback, or suggestions, please don't hesitate to reach out. You can contact us by email at:
        </p>
        <a href="mailto:contact@eyechallenge.fun" className="text-primary text-2xl font-bold">
          contact@eyechallenge.fun
        </a>
        <p className="mt-8">
          We do our best to respond to all inquiries within 48 hours.
        </p>
      </div>
    </section>
  );
}
