import Githubinput from "../components/Githubinput";

export default function Home() {
  return (
    <main>
      <div className="flex pt-10 justify-center">
          <img src="/READMEasy.png" alt="" className="w-[300px] md:h-[10vw] md:w-[40vw]" />
        </div>
      <div className="relative h-screen w-screen">
        <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2">
          <Githubinput />
        </div>
      </div>
    </main>
  );
}
