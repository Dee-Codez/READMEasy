"use client";

import { useState, useEffect } from "react"
import { MdOutlineNavigateNext } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useRouter } from 'next/navigation'

const Githubinput = () => {
    
    const router = useRouter()
    const [githubId, setGithubId] = useState("");
    let [validGit, setValidGit] = useState(null);

    const GITHUB_KEY = process.env.GITHUB_PAT;
    
    // const GitCheck = async(e) => {
    //     e.preventDefault();

    //     const res = await fetch(`https://api.github.com/users/${githubId}`,{
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `${GITHUB_KEY}`
    //         },
    //     });
    //     const data = await res.json();
    //     if(data.message === "Not Found") {
    //         setValidGit(false);
    //         setTimeout(() => {
    //             setValidGit(null);
    //         }, 5000);
    //     } else {
    //         setValidGit(true);
    //         console.log(data);
    //         router.push(`/user/${githubId}`);
    //     }
    // }

    const GitCheck = (e) => {
        e.preventDefault();
    
        const fetchUser = fetch(`https://api.github.com/users/${githubId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${GITHUB_KEY}`
            },
        })
        .then(res => res.json())
        .then(data => {
            if(data.message === "Not Found") {
                setValidGit(false);
                setTimeout(() => {
                    setValidGit(null);
                }, 5000);
                throw new Error("GitHub user not found");
            } else {
                router.push(`/user/${githubId}`);
                setValidGit(true);
            }
        });
    
        toast.promise(
            fetchUser,
            {
                pending: 'Checking GitHub user...',
                success: 'GitHub user found',
                error: 'GitHub user not found'
            }
        );
    }

    const handleIdChange = (e) => {
        setGithubId(e.target.value);
    }


  return (
    <div className="relative">
      <form onSubmit={GitCheck} className="bg-white/15  flex flex-col gap-4 p-[4vw] rounded-lg">
              {(validGit==false) && <p className="text-red-500 text-sm">*Enter Valid Github ID</p>}
              <label htmlFor="githubid">Enter Github ID : </label>
                <input type="text" className="outline-none rounded-md bg-white/20 p-2" onChange={handleIdChange} />
                <div onClick={GitCheck} className="relative mt-4 cursor-pointer inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out border-2 border-blue-950 rounded-full shadow-md group">
                    <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-blue-950 group-hover:translate-x-0 ease">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </span>
                    <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">Continue</span>
                    <span className="relative invisible">Submit</span>
                </div>
                
      </form>
    </div>
  )
}

export default Githubinput
