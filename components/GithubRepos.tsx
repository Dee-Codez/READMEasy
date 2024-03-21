"use client"

import Link from "next/link";
import { useState,useEffect } from "react"
import Moment from 'react-moment';
import { GrLinkNext } from "react-icons/gr";
import { MdSelectAll } from "react-icons/md";
import { MdDeselect } from "react-icons/md";
import { useRouter } from "next/navigation";



const GithubRepos = ({id}) => {

  const GITHUB_KEY = process.env.NEXT_PUBLIC_GITHUB_PAT;

    const [name, setName] = useState("");
    const [repos, setRepos] = useState([]);
    let [selectedRepos, setSelectedRepos] = useState(new Set());
    const [allSelected, setAllSelected] = useState(false);
    
    const router = useRouter();
    
    const toggleSelection = (repoId,repoName ,repoUrl) => {
        setSelectedRepos(prevSelectedRepos => {
          const newSelectedRepos = new Set([...prevSelectedRepos]);
          const repoData = { id: repoId,name: repoName ,url: repoUrl };
      
          const existingRepo = [...newSelectedRepos].find(repo => repo.id === repoId);
          if (existingRepo) {
            newSelectedRepos.delete(existingRepo);
          } else {
            newSelectedRepos.add(repoData);
          }
          console.log(newSelectedRepos);
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
        console.log(selectedRepos);
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
            return new Date(b.pushed_at) - new Date(a.pushed_at);
        });
        setRepos(data);
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
    let selectedReposArray = Array.from(selectedRepos);
    console.log(selectedReposArray);
    await fetch("/api/files",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({path: "/data/url.json", content: selectedReposArray})
        })
    router.push(`/user/${id}/repo`)
  }

  useEffect(() => {
    setAllSelected(repos.length > 0 && repos.every(repo => [...selectedRepos].some(selectedRepo => selectedRepo.id === repo.id)));
}, [repos, selectedRepos]);


  useEffect(() => {
    fetchGithub();
    fetchRepos();
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
                            <button className="hidden xl:flex"> Generate README</button><GrLinkNext className="" size={30}/>
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
                
                <div className="p-4">
                    {repos.map((repo) => {
                        return (
                            <div key={repo.id} className="flex  text-white hover:bg-blue-900/80  hover:p-3 transition-all justify-between p-2  bg-indigo-900/40 rounded-lg mt-5">
                                <Link href={repo.html_url} target="_blank" className="w-[100%] ml-4 my-2 truncate">
                                    <h1 className="flex h-full lg:h-fit items-center lg:justify-normal text-2xl lg:text-xl truncate ">{repo.name}</h1>
                                    <div className="text-sm opacity-0 lg:opacity-100 font-light mt-2">
                                        Updated <Moment fromNow>{repo.pushed_at}</Moment>
                                    </div>
                                    {!repo.homepage && <div className="text-sm opacity-0 lg:opacity-100 font-light mt-2">
                                        No Deployed Site So Description Needed From User
                                    </div>
                                    }
                                </Link>
                                <div className="flex items-center">
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
