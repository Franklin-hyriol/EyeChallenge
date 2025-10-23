import Hero from "../components/Hero/Hero";
import TestCard from "../components/TestCard/TestCard";
import Link from "next/link";
import AdSlot from "../components/AdSlot/AdSlot";

const tests = [
  {
    image: "/color_test.jpg",
    title: "Color differences",
    description: "Can you detect the subtle differences?",
    link: "/color_test",
  },
  {
    image: "/speed_test.png",
    title: "Reaction speed",
    description: "Click as soon as you see the signal.",
    link: "/speed_test",
  },
  {
    image: "/night_vision.png",
    title: "Night vision",
    description: "Can you see the objects in the dark?",
    link: "/night_vision",
  },
  {
    image: "/ishihara.jpg",
    title: "Color blindness (Ishihara)",
    description: "Can you see the hidden numbers?",
    link: "/ishihara",
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      <section className="main-container flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {tests.map((test) => (
            <TestCard
              key={test.link}
              image={test.image}
              title={test.title}
              description={test.description}
              link={test.link}
            />
          ))}
        </div>

        <Link href="/tests" className="btn btn-xl btn-primary mx-auto">
          See all tests
        </Link>

        <AdSlot />
      </section>
    </>
  );
}
