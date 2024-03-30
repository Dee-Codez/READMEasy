"use client"

import { useState,useEffect } from "react";
import { FloatingNav } from "./ui/floating-navbar";
import { ReadmeText } from "./ReadmeText";
import { IoMenu } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HomeBTN } from "./HomeBTN";

function Editor({id}) {

    let [userId, setUserId] = useState();
    let [readme, setReadme] = useState([]);
    let[selectedRepo, setSelectedRepo] = useState();
    let[loading, setLoading] = useState(true);

    const [mode, setMode] = useState('Preview');

    let [sidebarOpen, setSidebarOpen] = useState(false);

    let [docHeight, setDocHeight] = useState(0);

    const toggleSidebar = () => {
        sidebarOpen = !sidebarOpen;
        setSidebarOpen(sidebarOpen);
    };

    const fetchReadme = async () => {
        const response = await fetch(`/api/db/readme/?id=${userId}`);
        const data = await response.json();
        readme = data;
        setReadme(readme);
        selectedRepo = data[0].repoID;
        setSelectedRepo(selectedRepo);
    }

    const getUserID = async() => {
        const response = await fetch(`/api/db/user/?name=${id}`);
        const data = await response.json();
        userId = data.id;
        setUserId(userId);
    }

    useEffect(() => {
        const data = async() =>{
            await getUserID();
            await fetchReadme();
            loading = false;
            setLoading(loading);
        }
        data();
        return () => {
            data();
        }
    }, []);
  
  return (
    <div className="relative">
        <div className="absolute top-7 right-[6vw]"><HomeBTN/></div>
        <div className="flex">
        
            <div className="min-w-[270px] min-h-[100vh] hidden xl:block  bg-indigo-900/20">
                <div className="flex flex-col gap-5 mt-5">
                    {loading && <div className="flex justify-center items-center h-screen w-full"><h1>Loading Repos...</h1></div>}
                    {readme.map((item) => {
                        if(item.repoID === selectedRepo){return (
                            <div key={item.repoID} className="flex transition-all cursor-pointer rounded-3xl mr-2 bg-white/5 justify-center p-5 w-full">
                                <h1 className="text-xl text-sky-500 truncate transition-all">{item.repoName}</h1>
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
            <div className="flex flex-col flex-grow ">
                <div className="block xl:hidden absolute top-0 left-0">
                    <div className="absolute top-8 left-6 bottom-0">
                        {sidebarOpen ? (
                            <IoIosCloseCircleOutline size={35} onClick={toggleSidebar} />
                            ) : (
                            <IoMenu size={35} onClick={toggleSidebar} />
                        )}
                        
                    </div>
                    <div className={`min-w-[91vw] flex flex-col h-screen pb-8 absolute top-24 left-[5vw] rounded-2xl z-30 grow 
                        transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'}
                        xl:translate-x-0 bg-slate-950/90 backdrop-blur-sm`}>
                            <div className="flex flex-col gap-5 mt-5">
                            {loading && <div className="flex justify-center items-center h-screen w-full"><h1 className="text-white">Loading Repos...</h1></div>}

                                {readme.map((item) => {
                                if(item.repoID === selectedRepo){return (
                                    <div key={item.repoID} className="flex transition-all cursor-pointer rounded-3xl mr-2 bg-white/5 justify-center p-5 w-full">
                                    <h1 className="text-xl text-sky-500 truncate transition-all">{item.repoName}</h1>
                                    </div>
                                )}else{return (
                                    <div onClick={()=>{
                                    selectedRepo = item.repoID;
                                    setSelectedRepo(selectedRepo);
                                    setSidebarOpen(!sidebarOpen);
                                    }} key={item.repoID} className="flex cursor-pointer justify-center p-5 w-full">
                                    <h1 className="text-xl text-white">{item.repoName}</h1>
                                    </div>
                                )}
                                })}
                            </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-grow">
                 <div className="flex flex-col flex-grow items-center" >
                    <div className="flex mt-5 rounded-full bg-indigo-900/20 gap-3 py-2 px-3">
                        {mode === 'Preview' ? (<>
                            <div className="flex justify-center items-center p-3 bg-white/20 rounded-full transition-all">Preview</div>
                            <div className="flex flex-col justify-center items-center cursor-pointer pr-2" onClick={()=>{setMode('Markdown')}}>
                                <p>Editor</p>
                                
                            </div>
                        </>):(<>
                            <div className="flex justify-center items-center cursor-pointer pl-2" onClick={()=>{setMode('Preview')}}>Preview</div>
                            <div className="flex flex-col justify-center items-center p-3 bg-white/20 rounded-full transition-all">Editor</div>
                        </>)}
                    </div>
                    <div className="mt-10">
                        {loading && <div className="flex justify-center items-center h-screen w-full"><h1 className="text-white">Loading Readme...</h1></div>}

                        <ReadmeText list={readme} repo={selectedRepo} mode={mode}/>
                    </div>  
                </div>
                
            </div>
        </div>
        <ToastContainer  autoClose={1500} theme="dark" draggable closeOnClick/>
    </div>
  );
}

export default Editor ;