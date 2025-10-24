import tests from "@/data/tests"
import TestCard from "../TestCard/TestCard"

function Suggestion() {
  return (
    <div className="flex flex-col items-center pt-10 md:pt-12 border-t border-base-300 mt-10 md:mt-12">
         <h3 className="font-bold text-2xl mb-10 md:mb-12">Découvrez nos autres tests</h3>

        <div className="flex flex-col md:flex-row max-w-[952px] gap-8 mb-14">
          {tests.slice(0, 3).map((test) => (
            <TestCard
              key={test.link}
              image={test.image}
              title={test.title}
              description={test.description}
              link={test.link}
            />
          ))}
        </div>
    </div>
  )
}

export default Suggestion;