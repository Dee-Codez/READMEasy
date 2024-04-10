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
  const [currProcess, setCurrProcess] = useState<string | undefined>(undefined);
  let [userId, setUserId] = useState();
  let [depList, setDepList] = useState("");
  let [progress, setProgress] = useState(0);
  const router = useRouter();
  interface Repo {
    id: number;
    name: string;
  }
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

  const saveReadme = async(repoId: any,repoName: any,readmeText: any) => {
    const data = {userid: userId ,repoid: repoId, name: repoName, content: readmeText};
    const res = await fetch("/api/db/readme",{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
  })
  }

  const getPackage = async (repoName: any,path="/", depth = 0) => {
    const res = await fetch(`/api/github/jsondrill?id=${id}&reponame=${repoName}&path=${path}`);
    let data = await res.json();
    data = Array.isArray(data) ? data : [];
    for (const i of data){
      if(i.name === 'package.json') {
        pkg = i;
        setPkg(pkg);
        const pkg_url = pkg.download_url;
        setCurrProcess(`Getting Dependency Data`);
        // const dependency = await fetch("/api/scrape/package", {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({url: pkg_url})
        // })
        const pkgdata = await fetch(pkg_url).then(res => res.json());
        const devDep = Object.keys(pkgdata.devDependencies);
        const dep = Object.keys(pkgdata.dependencies);
        const allDep = [...devDep, ...dep];
        return allDep;
      }
      else if(i.type === 'dir') {
        if(depth<2) {
          folderDepth=folderDepth+1;
          setFolderDepth(folderDepth);
          const res = await getPackage(repoName,i.path,folderDepth);
          if(res){
            return res;
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

  const getGemini = async(text: string) => {
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
    for await (const i of repoList) {
      setProgress(0);
      setCurrProcess(`Getting Deployement URLs`);
      depList = "";
      setDepList(depList);
      folderDepth=0;
      let repoName = i.name;
      setFolderDepth(folderDepth);
      const repoData = { id: `${k}/${repoList.length}`, name: i.name };
      currRepo = new Set([repoData]);
      setCurrRepo(currRepo);
      k++;
      
      const res = await fetch(`/api/github/fetchrepo?id=${id}&reponame=${repoName}`);
      const data = await res.json();
      const repoId =  data.id;
      const repoDesc =  data.description;
      const repoLang =  data.language;
      const repoUrl =  data.homepage;
      setCurrProcess(`Finding package.json`);
      if(progress<10) {
        progress = 10;
        setProgress(progress);
      }
      const packageJson = await getPackage(repoName);
      
      // const deps = [];
      const dependencies = packageJson;
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
      // for(let i=0;i<dependencies.length;i++){
      //   let foundSimilar = false;
      //   depCounts[dependencies[i]] = (depCounts[dependencies[i]] || 0) + 1;
      //   for(let j=i+1;j<dependencies.length;j++){
      //     if(i !== j && (dependencies[i].includes(dependencies[j]) || dependencies[j].includes(dependencies[i]))){
      //       foundSimilar = true;
      //         depCounts[dependencies[i]]++;
      //         depCounts[dependencies[j]]++;
      //       break;
      //     }
      //   }
      //   if(!foundSimilar){
      //     ndepList.push(dependencies[i]);
      //   }
      // }
      for(let i=0;i<dependencies.length;i++){
        let count = 0;
        for(let j=0;j<dependencies.length;j++){
          if(i !== j && (dependencies[i].includes(dependencies[j]) || dependencies[j].includes(dependencies[i]))){
            count++;
          }
          if(dependencies[i].includes('@')){
            count-=2;
          }
        }
        depCounts[dependencies[i]] = count;
      }
      console.log(depCounts);
      let depCountsArray = Object.entries(depCounts);
      depCountsArray = depCountsArray.filter(([dep, count]: [string, number]) => count > 2 || ((!dep.includes('-') && !dep.includes('/') && !dep.includes('@') && !dep.includes('.') || count>4)));
      let top5Deps = depCountsArray.slice(0, 5);
      const depStringArr = depCountsArray.map(([dep, count]: [string, number]) => dep).join(",");
      console.log(depStringArr);
      if(progress<60){
        progress = 80;
        setProgress(progress);
      }else if(progress>60){
        progress = 80;
        setProgress(progress);
      }
      const prompt = `Create a detailed Readme.md file for a github project with title ${repoName} and description ${repoDesc}, built mostly using ${repoLang} language ${depStringArr && `with following dependencies : ${depStringArr}`}. The project is hosted at ${repoUrl}
      Follow the below structure:
      1. Title
      2. Description(write a detailed description about the project with the relevance of the project and its importance)
      3. Deployement
      4. Dependencies
      5. Installation
      and more such detailed points.
      Return just the markdown text.Nothing irrelevant.
      `;
      setCurrProcess(`Generating Readme Text`);
      const readmeText = await getGemini(prompt);
      if(progress<90){
        progress = 90;
        setProgress(progress);
      }
      setCurrProcess(`Saving Readme Text`);
      saveReadme(repoId,repoName,readmeText);
      setProgress(100);
    }
    setCurrProcess(`Redirecting to Editor..`);
    setTimeout(() => {router.push(`/user/${id}/editor`)}, 1000);
  }

  
  useEffect(() => {
    const fxn = fetchRepos;
    fxn();
    
  },[])

  useEffect(() => {
    const intrvl = setInterval(() => {
      if(progress<85){
        progress += 3;
        setProgress(progress);
      }else if(progress<99){
        progress += 1;
        setProgress(progress);
      }
    },1000);;
    return () => {
      clearInterval(intrvl);
    };
  },[progress])


  if(loading) return (<>
    <div className='relative w-[100vw]'>
      <div className='flex flex-col gap-10 justify-center items-center'>
        <div className='flex justify-center items-center mt-32'>
          <Hourglass height={80} width={80} />
        </div>
        <div className='text-white mt-10 text-2xl text-center animate-pulse'>Fetching/Processing Repositories..</div>
        <div className='text-xl flex gap-3'>
          Working on 
          {[...currRepo].map((repo: Repo) => {
          return(<div key={repo.id}>{repo.name} ({repo.id})</div>)})}
        </div>
        <div>
          {currProcess}
        </div>
        <div className='bg-white/20 mt-4 w-[80vw] max-w-[500px] overflow-hidden'>
          <div className={`bg-[#0ea5e9] flex items-center justify-center h-7 text-center transition-all overflow-hidden`} style={{width: `${progress}%`}}>
            <div className='hidden lg:flex'>
            {(progress>=40)?`${progress}% Repo Processed`:`${progress}%`}
            </div>
            <div className='flex lg:hidden'>
            {(progress>=60)?`${progress}% Repo Processed`:`${progress}%`}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>)


  return <div>{id}</div>;
}

export default Loader ;
