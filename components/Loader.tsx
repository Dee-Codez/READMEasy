"use client"

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {Hourglass} from 'react-loader-spinner'

const GITHUB_KEY = process.env.NEXT_PUBLIC_GITHUB_PAT;

function Loader({id}) {
  const [loading, setLoading] = useState(true);
  let [repoList, setRepoList] = useState([]);
  let [currRepo, setCurrRepo] = useState(new Set());
  let [pkg, setPkg] = useState(null);
  let [folderDepth, setFolderDepth] = useState(0);
  let [repoPackage, setRepoPackage] = useState(new Set());
  const [currProcess, setCurrProcess] = useState();
  let [userId, setUserId] = useState();
  let [depList, setDepList] = useState("");

  const router = useRouter();

  const fetchRepos = async() => {
    const res = await fetch(`/api/db/user?name=${id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        userId = data.id;
        setUserId(userId);
        localStorage.setItem('userId',userId);
        repoList = data.data;
        setRepoList(repoList);
        processRepo();
  }

  const saveReadme = async(repoId,repoName,readmeText) => {
    const data = {userid: userId ,repoid: repoId, name: repoName, content: readmeText};
    const res = await fetch("/api/db/readme",{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
  })
  const val = await res.json();
  }

  const getPackage = async (repoName,path="/", depth = 0) => {
    const res = await fetch(`https://api.github.com/repos/${id}/${repoName}/contents/${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GITHUB_KEY}` 
      },
    });
    const data = await res.json();
    for await (const i of data){
      if(i.name === 'package.json') {
        pkg = i;
        setPkg(pkg);
        const pkg_url = pkg.download_url;
        console.log(pkg_url);
        setCurrProcess(`Getting Dependency Data`);
        const dependency = await fetch("/api/scrape/package", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({url: pkg_url})
        })
        const dep = await dependency.json();
        return dep;
      }
      else if(i.type === 'dir') {
        if(depth<2) {
          folderDepth=folderDepth+1;
          setFolderDepth(folderDepth);
          const res = await getPackage(repoName,i.path,folderDepth);
          if(res && res!=depList){
            depList = depList+"\n"+res.substring(5);
            setDepList(depList);
          }
        }else if(depth>=2){
          folderDepth=0;
          setFolderDepth(folderDepth);
          continue;
        }
      }else{
        continue;
      }
    }
    return depList;
  }

  const getReadme = async(text) => {
    const res = await fetch(`/api/googleai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query: text})
    });
    const data = await res.json();
    return data;
  }

  const processRepo = async() => {
    let k=1;
    setCurrProcess(`Getting Deployement URLs`);
    for await (const i of repoList) {
      depList = "";
      setDepList(depList);
      folderDepth=0;
      let repoName = i.name;
      setFolderDepth(folderDepth);
      const repoData = { id: `${k}/${repoList.length}`, name: i.name };
      currRepo = new Set([repoData]);
      setCurrRepo(currRepo);
      k++;
      const res = await fetch(`https://api.github.com/repos/${id}/${repoName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      const repoId =  data.id;
      const repoDesc =  data.description;
      const repoLang =  data.language;
      const repoUrl =  data.homepage;
      setCurrProcess(`Finding package.json`);
      const packageJson = await getPackage(repoName);
      console.log(packageJson);
      setCurrProcess(`Generating Readme Text`);
      // const deps = [];
      const dependencies = depList.split("\n");
      // dependencies.forEach((dep) => {
      //   let foundSimilar = false;
      //   deps.forEach((d) => {
      //     if(d.includes(dep) || dep.includes(d)) {
      //       console.log(`Found Similar ${dep} and ${d}`);
      //       foundSimilar = true;
      //       return;
      //     }         
      //   });
      //   if (!foundSimilar) {
      //     deps.push(dep);
      //   }
      // });
      let depCounts = {};
      let ndepList = [];
      for(let i=1;i<dependencies.length;i++){
        let foundSimilar = false;
        depCounts[dependencies[i]] = (depCounts[dependencies[i]] || 0) + 1;
        for(let j=1;j<dependencies.length;j++){
          if(i !== j && (dependencies[i].includes(dependencies[j]) || dependencies[j].includes(dependencies[i]))){
            foundSimilar = true;
              depCounts[dependencies[i]]++;
              depCounts[dependencies[j]]++;
            break;
          }
        }
        if(!foundSimilar){
          ndepList.push(dependencies[i]);
        }
      }
      let depCountsArray = Object.entries(depCounts);
      depCountsArray = depCountsArray.filter(([dep, count]) => count > 2 || (!dep.includes('-') && !dep.includes('/')));
      depCountsArray.sort((a, b) => b[1] - a[1]);    
      let top5Deps = depCountsArray.slice(0, 5);
      const depStringArr = depCountsArray.map(([dep, count]) => dep).join(",")
      console.log(depStringArr);
      const prompt = `Create a detailed Readme.md file for a github project with title ${repoName} and description ${repoDesc}, built mostly using ${repoLang} language ${packageJson && `with following dependencies : ${depStringArr}`}. The project is hosted at ${repoUrl}`;
      console.log(prompt);
      const readmeText = await getReadme(prompt)
      setCurrProcess(`Saving Readme Text`);
      saveReadme(repoId,repoName,readmeText);
    }
    setCurrProcess(`Redirecting to Editor..`);
    setTimeout(() => {router.push(`/user/${id}/editor`)}, 1000);
  }

  
  useEffect(() => {
    const fxn = fetchRepos;
    return () => {fxn()};
  },[])


  if(loading) return (<>
    <div className='relative w-[100vw]'>
      <div className='flex flex-col gap-10 justify-center  items-center'>
        <div className='flex justify-center items-center mt-32'>
          <Hourglass color="#00BFFF" height={80} width={80} />
        </div>
        <div className='text-white mt-10 text-2xl animate-pulse'>Fetching/Processing Repositories..</div>
        <div className='text-xl flex gap-3'>
          Working on 
          {[...currRepo].map((repo) => {
          return(<div key={repo.id}>{repo.name} ({repo.id})</div>)})}
        </div>
        <div>
          {currProcess}
        </div>
      </div>
    </div>
  </>)


  return <div>{id}</div>;
}

export default Loader ;
