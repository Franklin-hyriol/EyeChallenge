import Image from "next/image";
import Link from "next/link";
import ToggleTheme from "../ToggleTheme/ToggleTheme";

const Header = () => {
  return (
    <header className="main-container mt-5">
      <div className="navbar bg-base-100 border-b border-base-300">
        <div className="flex-1">
          <Link
            href="/"
            className="text-xl size-fit font-bold leading-tight tracking-[-0.015em] flex items-center gap-2"
          >
            <Image
              src="/EyeChallenge.svg"
              alt="EyeChallenge"
              width={32}
              height={32}
            />
            <span>EyeChallenge</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/tests" className="btn btn-link btn-lg no-underline">
            All Tests
          </Link>
          <ToggleTheme />
        </div>
      </div>
    </header>
  );
};

export default Header;
