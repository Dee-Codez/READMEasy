"use client"

import Link from "next/link";
import { useState,useEffect } from "react"
import Moment from 'react-moment';
import { GrLinkNext } from "react-icons/gr";
import { MdSelectAll } from "react-icons/md";
import { MdDeselect } from "react-icons/md";
import { useRouter } from "next/navigation";
import Modal from 'react-modal';
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { DNA } from 'react-loader-spinner'


const GithubRepos = ({id}) => {

  const GITHUB_KEY = process.env.NEXT_PUBLIC_GITHUB_PAT;
    const customStyles = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Change the last value to adjust transparency
            backdropFilter: 'blur(7px)' // This is for the blur effect
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '80%', // Set the width to 80% of the screen width
          maxWidth: '800px', // Set a maximum width
        },
      };

    const [name, setName] = useState("");
    const [repos, setRepos] = useState([]);
    let [selectedRepos, setSelectedRepos] = useState(new Set());
    const [allSelected, setAllSelected] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [repoModal, setRepoModal] = useState(null);
    let [loading, setLoading] = useState(false);
    let [initialLoad, setInitialLoad] = useState(true);

    function openModal(repo) {
        setIsOpen(true);
        setRepoModal(repo);
      }
    
      function closeModal() {
        setIsOpen(false);
      }

    const router = useRouter();
    interface Repo {
        id: number;
        name: string;
        url: string;
      }
    const toggleSelection = (repoId,repoName ,repoUrl) => {
        setSelectedRepos((prevSelectedRepos: Set<Repo>) => {
          const newSelectedRepos = new Set<Repo>([...prevSelectedRepos]);
          const repoData = { id: repoId,name: repoName ,url: repoUrl };
          
          const existingRepo = [...newSelectedRepos].find(repo => repo.id === repoId);
          if (existingRepo) {
            newSelectedRepos.delete(existingRepo);
          } else {
            newSelectedRepos.add(repoData);
          }
          return newSelectedRepos;
        });
      };

      const toggleAllRepos = () => {
        if (allSelected) {
            selectedRepos =new Set()
            setSelectedRepos(selectedRepos);
            setAllSelected(false);
        } else {
          const allRepoData = repos.map(repo => ({ id: repo.id, name: repo.name ,url: repo.homepage }));
          selectedRepos = new Set(allRepoData);
          setSelectedRepos(selectedRepos);
        }
      };
      

  const fetchGithub = async() => {
    const res = await fetch(`https://api.github.com/users/${id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GITHUB_KEY}`
            },
        });
        const data = await res.json();
        setName(data.name);
  }

  const fetchRepos = async() => {
    const res = await fetch(`https://api.github.com/users/${id}/repos`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GITHUB_KEY}`
            },
        });
        let data = await res.json();
        data = data.sort((a, b) => {
            return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
        });
        setRepos(data);
        initialLoad = false;
        setInitialLoad(initialLoad);
  }

  const saveRepos = async(data) => {
        let urlList = [];
        let i=0
        data.forEach(element => {
            const url = element.homepage
            urlList[i] = url;
            i++;
        });
        await fetch("/api/files",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(urlList)
        })
        setRepos(data);
  }

  const nextPage = async() => {
    loading = true;
    setLoading(loading);
    let selectedReposArray = Array.from(selectedRepos);
    console.log(selectedReposArray);
    await fetch("/api/db/user",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name: id, content: selectedReposArray})
        })
    router.push(`/user/${id}/repo`)
  }

  useEffect(() => {
    setAllSelected(repos.length > 0 && repos.every(repo => [...selectedRepos].some(selectedRepo => selectedRepo.id === repo.id)));
}, [repos, selectedRepos]);


  useEffect(() => {
    const data = async() =>{
        await fetchGithub();
        await fetchRepos();
        
    }
    data();
  },[])

  return (
    <div className="relative">
        <div>
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2  bg-indigo-950/40 w-[90vw] sm:w-[80vw] p-5 rounded-lg">
                <div className="flex mx-5 mt-3 justify-between items-center">
                    <div className="text-3xl flex flex-col mt-1">
                        <div className="flex">Hi <p className="text-blue-600 ml-3">{name}</p>!</div>
                        <div className="text-lg my-2 mr-2">Click On A Repo To Get Redirected, On the Box To Select</div>
                        Here are your repos:
                    </div>
                    <div className="flex flex-col ">
                        <div onClick={nextPage} className="p-3 hover:border hover:bg-sky-500 hover:text-indigo-900 hover:font-black border-white transition-all duration-75 cursor-pointer items-center text-center gap-2 flex bg-sky-600/50 rounded-md">
                            {(loading) ? 
                            (<>
                                <div className="flex justify-center items-center gap-3">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <div className="hidden xl:flex">Loading...</div>
                                </div>
                            </>):
                            (<>
                            <button className="hidden xl:flex"> Generate README</button><GrLinkNext className="" size={30}/>
                            </>)
                            }
                        </div>
                        <div onClick={toggleAllRepos} className="ml-auto mt-6 p-3 bg-blue-900/30 rounded-md cursor-pointer">
                            <div className="flex gap-2 items-center">
                                {allSelected ? <MdDeselect size={34} /> : <MdSelectAll size={34} />}
                                <div className="hidden xl:flex">
                                    {allSelected ? "Deselect All" : "Select All"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
                    {repoModal && (
                        <div className="text-black text-center flex flex-col items-center">
                            <p>Are you sure you want to visit <span className="text-indigo-500 font-bold">{repoModal.name}</span>`s Github Repository page?</p>
                            <p className="mt-2">If Yes, You`ll be redirected to <span className="text-blue-500 font-semibold">{repoModal.html_url}</span>.</p>
                            <div className="flex items-center mt-6 gap-4 justify-center">
                                <Link onClick={closeModal} href={repoModal.html_url} target="_blank" className="p-2 justify-center flex items-center gap-2 px-4 bg-lime-500 hover:bg-lime-600 rounded-lg">
                                    <FaCheck/>
                                    <p>Yes</p>
                                </Link>
                                <button onClick={closeModal} className="p-2 flex items-center gap-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg">
                                    <RxCross2 size={24} className="font-bold" />
                                    No
                                </button>
                            </div>
                        </div>
                    )}
                    </Modal>
                <div className="p-4">
                    {initialLoad && <div className="flex justify-center items-center h-screen w-full">
                        <DNA height={100} width={100} /></div>}
                    {repos.map((repo) => {
                        return (
    
                            <div key={repo.id}  className="flex text-white hover:bg-blue-900/80  hover:p-1 transition-all justify-between  bg-indigo-900/40 rounded-lg mt-5">
                                <div onClick={() => openModal(repo)} className="w-[100%] cursor-pointer py-3 ml-4 mr-8 my-2 truncate">
                                    <h1 className="flex h-full lg:h-fit items-center lg:justify-normal text-2xl lg:text-xl truncate ">{repo.name}</h1>
                                    <div className="text-sm opacity-0 lg:opacity-100 font-light mt-2">
                                        Updated <Moment fromNow>{repo.pushed_at}</Moment>
                                    </div>
                                    {!repo.homepage && <div className="text-sm opacity-0 lg:opacity-100 font-light mt-2">
                                        No Deployed Site So Description Needed From User
                                    </div>
                                    }
                                </div>
                                <div className="flex mr-4 items-center">
                                    <input className="appearance-none mr-2 w-[2.5em] h-[2.5em] border-2 border-blue-500 rounded-sm checked:bg-blue-800  checked:border-white bg-white/10" type="checkbox" checked={[...selectedRepos].some(selectedRepo => selectedRepo.id === repo.id)} onChange={() => toggleSelection(repo.id,repo.name,repo.homepage)} />
                                </div>
                                
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    </div>
  )
}

export default GithubRepos
