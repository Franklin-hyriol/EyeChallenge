
interface HeadingPageProps {
    title: string;
    description: string;
}

function HeadingPage({ title, description }: HeadingPageProps) {
  return (
    <div className="mb-4 text-center md:mb-6 max-w-4xl">
      <h1 className="text-4xl font-black leading-tight tracking-tighter text-text-title-dark md:text-5xl">
        {title}
      </h1>
      <p className="mx-auto mt-4 text-base font-normal leading-normal text-text-main-dark md:text-lg">
        {description}
      </p>
    </div>
  );
}

export default HeadingPage;
