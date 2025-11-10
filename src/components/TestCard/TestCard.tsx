import Image from "next/image";
import Link from "next/link";
interface TestCardProps {
  image: string;
  title: string;
  description: string;
  link: string;
}

function TestCard({ image, title, description, link }: TestCardProps) {
  return (
    <div className="flex flex-col gap-4 p-5 bg-base-300 rounded-2xl shadow-md transition-all hover:shadow-lg">
      <div className="w-full h-32 rounded-xl flex items-center justify-center overflow-hidden">
        <Image className="w-full object-cover" src={image} alt={title} width={296} height={128} />
      </div>
      <div className="flex flex-col gap-2 grow">
        <h2 className="text-primary text-lg font-bold leading-normal">
          {title}
        </h2>
        <p className="text-sm font-normal leading-normal">
          {description}
        </p>
      </div>
      <Link className="btn btn-primary" href={"/"+link}>Take the test</Link>
    </div>
  );
}

export default TestCard;
