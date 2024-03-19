"use client"

import { useState,useEffect } from "react"
import Moment from 'react-moment';

const GithubRepos = ({id}) => {

  const GITHUB_KEY = process.env.GITHUB_PAT;

    const [name, setName] = useState("");
    const [repos, setRepos] = useState([]);
    

  const fetchGithub = async() => {
    const res = await fetch(`https://api.github.com/users/${id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${GITHUB_KEY}`
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
                'Authorization': `${GITHUB_KEY}`
            },
        });
        let data = await res.json();
        data = data.sort((a, b) => {
            return new Date(b.pushed_at) - new Date(a.pushed_at);
        });
        setRepos(data);
        saveRepos(data);
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


  useEffect(() => {
    fetchGithub();
    fetchRepos();
  },[])

  return (
    <div>
        <div>
            <div className="bg-blue-950/40 w-[80vw] p-5 rounded-lg">
                Hi {name}! Here are your repos :
                <div className="p-4">
                    {repos.map((repo) => {
                        return (
                            <div key={repo.id} className="flex hover:bg-blue-900/80 hover:scale-105 hover:p-3 transition-all hover:m-5 justify-between p-2  bg-blue-900/40 rounded-lg mt-5">
                                <div>
                                    <h1 className="text-white">{repo.name}</h1>
                                    <div className="text-sm font-light mt-2">
                                        Last Updated  <Moment fromNow>{repo.pushed_at}</Moment>
                                    </div>
                                    {!repo.homepage && "No Deployed Site So Description Needed From User"}
                                </div>
                                <div>
                                    <p className="text-white">{repo.language}</p>
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
