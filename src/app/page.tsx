import Hero from "../components/Hero/Hero";
import TestCard from "../components/TestCard/TestCard";
import Link from "next/link";
import AdSlot from "../components/AdSlot/AdSlot";
import Why from "@/components/Why/Why";
import tests from "@/data/tests";


export default function Home() {
  return (
    <>
      <Hero />

      <AdSlot />

      <section className="py-10 sm:py-18 main-container flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
          {tests.slice(0, 4).map((test) => (
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
      </section>

      <AdSlot />

      <Why />
    </>
  );
}
