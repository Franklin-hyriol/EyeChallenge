import HeadingPage from "@/components/HeadingPage/HeadingPage";
import TestCard from "@/components/TestCard/TestCard";
import tests from "@/data/tests";

export default function Tests() {
  return (
    <section className="py-10 sm:py-18 main-container flex flex-col items-center">
      <HeadingPage
        title="Explore all our vision tests"
        description="Evaluate different aspects of your visual perception with our comprehensive collection of tests."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
    </section>
  );
}
