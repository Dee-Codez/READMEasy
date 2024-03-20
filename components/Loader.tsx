"use client"

import { useEffect, useState } from 'react';
import {Hourglass} from 'react-loader-spinner'

const GITHUB_KEY = process.env.NEXT_PUBLIC_GITHUB_PAT;

function Loader({id}) {
  const [loading, setLoading] = useState(true);
  let [repoList, setRepoList] = useState(null);
  let [currRepo, setCurrRepo] = useState(null);
  let [pkg, setPkg] = useState(null);
  let [folderDepth, setFolderDepth] = useState(0);
  let [repoPackage, setRepoPackage] = useState(new Set());

  const fetchRepos = async() => {
    const res = await fetch(`/api/files`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        console.log(data);
        repoList = data;
        setRepoList(repoList);
        processRepo();
  }

  const getPackage = async(repoName,path="/") => {
    const res = await fetch(`https://api.github.com/repos/${id}/${repoName}/contents/${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GITHUB_KEY}` 
      },
    });
    const data = await res.json();
    for await (const i of data) {
      if(i.name === 'package.json') {
        pkg = i;
        setPkg(pkg);
        const PkgData = {name : repoName, data: pkg}
        const existingRepo = [...repoPackage].find(repo => repo.name === repoName);
        if (!existingRepo) {
          repoPackage = repoPackage.add(PkgData);
          setRepoPackage(repoPackage);
        }else if(existingRepo){
          return null;
        }
        return pkg;
      }
      else if(i.type === 'dir') {
        if(folderDepth<2) {
          getPackage(repoName,i.path);
          folderDepth=folderDepth+1;
          setFolderDepth(folderDepth);
        }else{
          return null;
        }
      }
    }
    return data;
  }

  const processRepo = async() => {

    for await (const i of repoList) {
      folderDepth=0;
      setFolderDepth(folderDepth);
      const repoName = i.name;
      setCurrRepo(repoName);
      const res = await fetch(`https://api.github.com/repos/${id}/${repoName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      const repoDesc = data.description;
      const repoLang = data.language;
      const repoUrl = data.homepage;
      const prompt = `Create a Readme.md file for a github project with title ${repoName} and description ${repoDesc}, built mostly using ${repoLang} language. The project is hosted at ${repoUrl}`;
      const packageJson = await getPackage(repoName);
      console.log(repoPackage);
    }
  }

  
  useEffect(() => {
    fetchRepos();
  },[])


  if(loading) return (<>
  <div className='relative w-[100vw]'>
    <div className='flex flex-col gap-10 justify-center items-center'>
      <div className='flex justify-center items-center mt-32'>
        <Hourglass color="#00BFFF" height={80} width={80} />
      </div>
      <div className='text-white mt-10 text-2xl animate-pulse'>Fetching/Processing Repositories..</div>
      <div className='text-xl'>Working on {currRepo}</div>
    </div>
  </div>
  </>)


  return <div>{id}</div>;
}

export default Loader ;