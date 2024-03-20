import Githubinput from "../components/Githubinput";

export default function Home() {
  return (
    <main>
      <div className="relative h-screen w-screen">
        <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2">
          <Githubinput />
        </div>
      </div>
    </main>
  );
}
