"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";

const contactSchema = z.object({
  title: z.string().min(2, { message: "Title is required" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters long" }),
});

type ContactSchemaType = z.infer<typeof contactSchema>;

function ContactFormContent() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    if (currentTheme && currentTheme.includes("visiontest-dark")) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactSchemaType>({ resolver: zodResolver(contactSchema) });

  const submitData = async (data: ContactSchemaType) => {
    if (!executeRecaptcha) {
      toast.error("Recaptcha not available. Please try again later.");
      return;
    }

    setIsLoading(true);
    const token = await executeRecaptcha("contactForm");

    const templateParams = {
      ...data,
      "g-recaptcha-response": token,
    };

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )
      .then(
        () => {
          setIsLoading(false);
          reset();
          toast.success("Message sent successfully!");
        },
        (error) => {
          setIsLoading(false);
          toast.error("An error occurred while sending the message.");
          console.error("EmailJS Error:", error);
        }
      );
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <form
            onSubmit={handleSubmit(submitData)}
            className="flex flex-col gap-4"
          >
            <div className="form-control">
              <label className="label block mb-2">
                <span className="label-text font-medium">Title</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Suggestion for a new test"
                className={`input input-bordered w-full ${
                  errors.title ? "input-error" : ""
                }`}
                {...register("title")}
              />
              {errors.title && (
                <small className="text-error mt-1">
                  {errors.title.message}
                </small>
              )}
            </div>

            <div className="form-control">
              <label className="label block mb-2">
                <span className="label-text font-medium">
                  Your Email (Optional)
                </span>
              </label>
              <input
                type="email"
                placeholder="your.email@example.com"
                className={`input input-bordered w-full ${
                  errors.email ? "input-error" : ""
                }`}
                {...register("email")}
              />
              {errors.email && (
                <small className="text-error mt-1">
                  {errors.email.message}
                </small>
              )}
            </div>

            <div className="form-control">
              <label className="label block mb-2">
                <span className="label-text font-medium">Message</span>
              </label>
              <textarea
                className={`textarea textarea-bordered w-full min-h-46 ${
                  errors.message ? "textarea-error" : ""
                }`}
                placeholder="Your detailed message here..."
                {...register("message")}
              ></textarea>
              {errors.message && (
                <small className="text-error mt-1">
                  {errors.message.message}
                </small>
              )}
            </div>

            <div className="card-actions justify-end mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Send Message"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
        transition={Bounce}
      />
    </div>
  );
}

export default function ContactForm() {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!recaptchaKey) {
    console.error(
      "ReCaptcha site key is not defined in environment variables."
    );
    // You might want to render a message to the user in this case
    return <p>Contact form is currently unavailable.</p>;
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
      <ContactFormContent />
    </GoogleReCaptchaProvider>
  );
}
