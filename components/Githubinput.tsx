"use client";

import { useState, useEffect } from "react"
import { MdOutlineNavigateNext } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import { MdEditSquare } from "react-icons/md";
import { MdCreateNewFolder } from "react-icons/md";
import { InfinitySpin } from 'react-loader-spinner'
import { GetServerSideProps } from 'next';

import { useRouter } from 'next/navigation'

const Githubinput = () => {
    
    const router = useRouter()
    const [githubId, setGithubId] = useState("");
    let [validGit, setValidGit] = useState(null);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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

      function openModal() {
        setIsOpen(true);
      }
    
      function closeModal() {
        setIsOpen(false);
        setTimeout(() => {setIsLoading(false);},4000)
      }

      const handleNew = () => {
        router.push(`/user/${githubId}`);
        closeModal();
      }

      const handleExisting = () => {
        router.push(`/user/${githubId}/editor`);
        closeModal();
      }

    const GitCheck = async (e) => {
        e.preventDefault();
        setIsLoading(true);
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
                setIsLoading(false);
                setTimeout(() => {
                    setValidGit(null);
                }, 5000);
                throw new Error("GitHub user not found");
            } 
            else {
                setUser(data);
                openModal();
                // router.push(`/user/${githubId}`);
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
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>         
            <div className="text-black text-center flex flex-col items-center">
                <p>Hi <span className="text-indigo-500 font-bold">{user && user.name}</span>. Thank you for visiting the site again</p>
                <p className="mt-2">You can either continue editing <span className="text-blue-500 font-semibold">previously generated READMEs</span> or can start <span className="text-blue-500 font-semibold">creating new ones</span>..</p>
                <div className="flex items-center mt-6 gap-4 justify-center">
                    <div onClick={handleExisting} className="p-2 cursor-pointer justify-center text-white flex items-center gap-2  bg-blue-500 hover:bg-blue-600 rounded-lg">
                        <MdEditSquare className="hidden md:flex" size={18}/>
                        Continue Editing
                    </div>
                    <div onClick={handleNew} className="p-2 cursor-pointer justify-center text-black flex items-center gap-2  bg-lime-500 hover:bg-lime-600 rounded-lg">
                        <MdCreateNewFolder className="hidden md:flex" size={20} />
                        Create New
                    </div>
                </div>
            </div>
        </Modal>
        {isLoading ? 
        (<>
            <InfinitySpin color="#00BFFF" width="200" />
        </>):
        (<>
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
        </>)}
    </div>
  )
}

export default Githubinput
