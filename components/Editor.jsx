"use client"

import { useState,useEffect } from "react";
import { FloatingNav } from "./ui/floating-navbar";
import { ToggleButtonGroup } from '@mui/material';
import { ToggleButton } from '@mui/material';
import { ReadmeText } from "./ReadmeText";



function Editor({id}) {

    let [userId, setUserId] = useState();
    let [readme, setReadme] = useState([]);
    let[selectedRepo, setSelectedRepo] = useState();

    const [mode, setMode] = useState('Preview');



    const fetchReadme = async () => {
        const response = await fetch(`/api/db/readme/?id=${userId}`);
        const data = await response.json();
        readme = data;
        setReadme(readme);
        selectedRepo = data[0].repoID;
        setSelectedRepo(selectedRepo);
    }

    useEffect(() => {
        userId = localStorage.getItem("userId");
        setUserId(userId);
        fetchReadme();
    }, []);
  
  return (
    <div>
        <div className="flex">
        
            <div className="min-w-[15vw] h-[150vh] bg-indigo-900/20">
                <div className="flex flex-col gap-5 mt-5">
                    {readme.map((item) => {
                        if(item.repoID === selectedRepo){return (
                            <div key={item.repoID} className="flex transition-all cursor-pointer rounded-3xl mr-2 bg-white/5 justify-center p-5 w-full">
                                <h1 className="text-xl text-sky-500 transition-all">{item.repoName}</h1>
                            </div>
                        )}else{return (
                            <div onClick={()=>{
                                selectedRepo = item.repoID;
                                setSelectedRepo(selectedRepo);
                            }} key={item.repoID} className="flex cursor-pointer justify-center p-5 w-full">
                                <h1 className="text-xl text-white">{item.repoName}</h1>
                            </div>
                        )}
                    })}
                </div>
            </div>
            <div className="flex">
                 <div className="flex flex-col w-[85vw] items-center" >
                    <div className="flex mt-5 rounded-full w-fit bg-indigo-900/20 gap-3 py-2 px-3">
                        {mode === 'Preview' ? (<>
                            <div className="flex justify-center items-center p-3 bg-white/20 rounded-full transition-all">Preview</div>
                            <div className="flex justify-center items-center cursor-pointer pr-2" onClick={()=>{setMode('Markdown')}}>Markdown</div>
                        </>):(<>
                            <div className="flex justify-center items-center cursor-pointer pl-2" onClick={()=>{setMode('Preview')}}>Preview</div>
                            <div className="flex justify-center items-center p-3 bg-white/20 rounded-full transition-all">Markdown</div>
                        </>)}
                    </div>
                    <div className="mt-10">
                        <ReadmeText list={readme} repo={selectedRepo} mode={mode}/>
                    </div>  
                </div>
                
            </div>
        </div>
    </div>
  );
}

export default Editor ;