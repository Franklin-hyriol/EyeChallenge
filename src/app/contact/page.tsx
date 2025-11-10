import { Metadata } from "next";
import HeadingPage from "@/components/HeadingPage/HeadingPage";
import ContactForm from "@/components/ContactForm/ContactForm";

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
      <ContactForm />
    </section>
  );
}
