import AdSlot from "@/components/AdSlot/AdSlot";
import HeadingPage from "@/components/HeadingPage/HeadingPage";
import Info from "@/components/Info/Info";
import Progress from "@/components/Progress/Progress";
import Suggestion from "@/components/Suggestion/Suggestion";
import { TbReload } from "react-icons/tb";

function ColorTest() {
  return (
    <section className="py-10 sm:py-18 main-container flex flex-col items-center">
      <HeadingPage
        title="Color Sensitivity Test"
        description="This test evaluates your ability to distinguish color nuances. The difficulty
          increases progressively to refine your chromatic sensitivity score."
      />
      <Progress value={50} maxValue={100} />

      <div className="w-full mt-10 md:mt-12 max-w-4xl">
        <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
          <div className="text-center flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              NIVEAU
            </span>
            <span className="text-4xl font-bold leading-normal">5 / 10</span>
          </div>

          <div className="w-px h-16 bg-slate-500 dark:bg-slate-400 hidden sm:block"></div>

          <div className="text-center flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              TEMPS RESTANT
            </span>
            <span className="text-primary text-4xl font-bold leading-normal">
              25s
            </span>
          </div>

          <div className="w-px h-16 bg-slate-500 dark:bg-slate-400 hidden sm:block"></div>

          <div className="text-center flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              MEILLEUR SCORE
            </span>
            <span className=" text-4xl font-bold leading-normal">12</span>
          </div>
        </div>

        <div
          role="alert"
          className="alert alert-info alert-soft flex justify-center mt-4 md:mt-6"
        >
          <span>Cliquez sur le carré le plus foncé</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 max-w-lg mx-auto w-full sm:grid-cols-2 my-10 md:my-12">
        <button
          aria-label="Option de couleur 1"
          className="flex flex-col gap-3 group focus:outline-none focus:ring-4 focus:ring-primary/50 rounded-xl transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <div
            className="w-full bg-[#60a5fa] aspect-square rounded-xl"
            data-alt="carré de couleur bleu clair"
          ></div>
        </button>
        <button
          aria-label="Option de couleur 2"
          className="flex flex-col gap-3 group focus:outline-none focus:ring-4 focus:ring-primary/50 rounded-xl transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <div
            className="w-full bg-[#60a5fa] aspect-square rounded-xl"
            data-alt="carré de couleur bleu clair"
          ></div>
        </button>
        <button
          aria-label="Option de couleur 3"
          className="flex flex-col gap-3 group focus:outline-none focus:ring-4 focus:ring-primary/50 rounded-xl transition-transform duration-200 hover:scale-105 active:scale-95 ring-4 ring-green-500"
        >
          <div
            className="w-full bg-[#3b82f6] aspect-square rounded-xl"
            data-alt="carré de couleur bleu plus foncé"
          ></div>
        </button>
        <button
          aria-label="Option de couleur 4"
          className="flex flex-col gap-3 group focus:outline-none focus:ring-4 focus:ring-primary/50 rounded-xl transition-transform duration-200 hover:scale-105 active:scale-95 ring-4 ring-red-500"
        >
          <div
            className="w-full bg-[#60a5fa] aspect-square rounded-xl"
            data-alt="carré de couleur bleu clair"
          ></div>
        </button>
      </div>

      <button className="btn btn-lg btn-primary">
        <TbReload />
        Recommencer le test
      </button>

      <Info
        title="Le saviez-vous ?"
        description="L'œil humain peut distinguer environ 10 millions de couleurs
            différentes. Cependant, certaines personnes, comme les
            tétrachromates, peuvent en voir jusqu'à 100 millions !"
      />

      <Suggestion />

      <AdSlot />
    </section>
  );
}

export default ColorTest;
