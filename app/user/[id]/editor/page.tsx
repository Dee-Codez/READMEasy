import Editor from "@/components/Editor";
import { StyledEngineProvider } from '@mui/material/styles';


type nameProps = {
  params: {
    id: string;
  }
};

function page({params} : nameProps) {
  
  return (
    <>
    <StyledEngineProvider injectFirst>
      <Editor id={params.id}/>
    </StyledEngineProvider>
    </>
  )
}

export default page;