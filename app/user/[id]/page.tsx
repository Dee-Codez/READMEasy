import GithubRepos from "../../../components/GithubRepos";
import { HomeBTN } from "@/components/HomeBTN";

type nameProps = {
  params: {
    id: string;
  }
};

function Page({params} : nameProps) {
  return (
    <div className="text-white">
      
      <div>
        <div className="relative h-screen w-screen">
          <div className="absolute top-5 right-[5vw] sm:right-[10vw]"><HomeBTN/></div>
          <div className="absolute left-1/2 top-40 transform -translate-x-1/2 ">
            <GithubRepos id={params.id} />
          </div>
        </div>

      </div>
      
    </div>
  );
}

export default Page;