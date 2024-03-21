import Editor from "@/components/Editor";

type nameProps = {
  params: {
    id: string;
  }
};

function page({params} : nameProps) {
  
  return (
    <>
      <Editor id={params.id}/>
    </>
  )
}

export default page;