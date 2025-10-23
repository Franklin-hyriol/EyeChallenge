import Link from "next/link";
import Image from "next/image";

const Footer = () => (
  <footer className="mt-16 border-t border-base-300 py-8 main-container text-neutral">
    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="text-lg font-bold leading-tight tracking-[-0.015em] flex items-center gap-2"
        >
          <Image
            src="/EyeChallenge.svg"
            alt="EyeChallenge"
            width={25}
            height={25}
          />
          <span>EyeChallenge</span>
        </Link>
      </div>
      <nav className="flex gap-6 text-sm">
        <Link className="hover:text-primary transition-colors" href="#">
          À propos
        </Link>
        <Link className="hover:text-primary transition-colors" href="#">
          Contact
        </Link>
        <Link className="hover:text-primary transition-colors" href="#">
          Mentions légales
        </Link>
      </nav>
      <p className="text-sm">
        © {new Date().getFullYear()} EyeChallenge. Tous droits réservés.
      </p>
    </div>
  </footer>
);

export default Footer;
