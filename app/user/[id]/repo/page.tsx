import Loader from "@/components/Loader";

type nameProps = {
    params: {
      id: string;
    }
  };

function Page({params} : nameProps) {
  
  return (
    <div className="">
        
        <Loader id={params.id}/>
    </div>
  );
}

export default Page;