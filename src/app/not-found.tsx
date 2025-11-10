import Link from 'next/link';

export default function NotFound() {
  return (
    <section
      className="flex flex-col items-center justify-center bg-base-100 text-base-content p-4"
      style={{ height: 'calc(100vh - var(--header-height) - var(--footer-height) - 32px)', '--header-height': '65px', '--footer-height': '90px' } as React.CSSProperties}
    >
      <h1 className="text-primary tracking-tight text-8xl md:text-9xl font-black leading-tight">
        404
      </h1>

      <div className="flex flex-col gap-3 max-w-lg text-center">
        <p className="text-base-content tracking-tight text-3xl md:text-4xl font-bold leading-tight">
          This page seems to have lost focus.
        </p>
        <p className="text-base-content/80 text-base font-normal leading-normal">
          The link you followed might be incorrect or the page has been moved. Don't worry, we can help you find your way back.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full pt-4 max-w-md justify-center">
        <Link href="/" className="btn btn-primary btn-lg">
          Return Home
        </Link>
        <Link href="/tests" className="btn btn-outline btn-lg">
          Explore all our tests
        </Link>
      </div>
    </section>
  );
}
