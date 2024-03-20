import Loader from "@/components/Loader";

type nameProps = {
    params: {
      id: string;
    }
  };

function Page({params} : nameProps) {
  
  return (
    <div>
        
        <Loader id={params.id}/>
    </div>
  );
}

export default Page;