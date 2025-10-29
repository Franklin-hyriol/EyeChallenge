'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import tests from "@/data/tests";
import TestCard from "../TestCard/TestCard";
import Link from "next/link";

function Suggestion() {
  const pathname = usePathname();
  const [suggested, setSuggested] = useState<typeof tests>([]);

  useEffect(() => {
    // Filter out the current test based on the pathname
    const filteredTests = tests.filter(test => !pathname.includes(test.link));

    // Shuffle the filtered array and get the first 3
    const shuffled = filteredTests.sort(() => 0.5 - Math.random());
    setSuggested(shuffled.slice(0, 3));
  }, [pathname]);

  return (
    <div className="flex flex-col items-center pt-10 md:pt-12 border-t border-base-300 mt-10 md:mt-12">
      <h3 className="font-bold text-2xl mb-10 md:mb-12">Discover our other tests</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
        {suggested.map((test) => (
          <TestCard
            key={test.link}
            image={test.image}
            title={test.title}
            description={test.description}
            link={test.link}
          />
        ))}
      </div>
      <Link href="/tests" className="btn btn-xl btn-primary mx-auto">See all tests</Link>
    </div>
  );
}

export default Suggestion;
