interface InfoProps {
  title: string;
  description: string;
}

function Info({ title, description }: InfoProps) {
  return (
    <>
      <div role="alert" className="alert alert-vertical sm:alert-horizontal max-w-lg mt-10 md:mt-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-info h-6 w-6 shrink-0"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          <div className="text-sm">
            {description}
          </div>
        </div>
      </div>
    </>
  );
}

export default Info;
