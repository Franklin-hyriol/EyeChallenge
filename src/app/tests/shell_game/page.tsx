import ShellGame from "./ShellGame";
import HeadingPage from "@/components/HeadingPage/HeadingPage";
import Info from "@/components/Info/Info";
import Suggestion from "@/components/Suggestion/Suggestion";
import AdSlot from "@/components/AdSlot/AdSlot";

export const metadata = {
  title: "Shell Game - EyeChallenge",
  description: "Test your visual tracking skills with the classic shell game. Follow the ball as the cups move and try to keep up!",
};

export default function ShellGamePage() {
  return (
    <section className="py-10 sm:py-18 main-container flex flex-col items-center">
      <HeadingPage
        title="Shell Game"
        description="Follow the ball as the cups move — can your eyes keep up?"
      />

      <ShellGame />

      <Info
        title="Did you know?"
        description="The shell game is an ancient game of chance, but it also tests your visual tracking and attention skills. Practicing can improve your focus!"
      />

      <Suggestion />

      <AdSlot />
    </section>
  );
}
