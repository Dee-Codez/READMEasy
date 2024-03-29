"use client"

import { useEffect,useState } from "react";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Remarkable } from 'remarkable';
import DOMPurify from "dompurify";
import MDEditor from '@uiw/react-md-editor';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import copy from 'copy-to-clipboard';
import { IoMdCopy } from "react-icons/io";



function ReadmeText({repo,mode,list}) {
    var md = new Remarkable('full', {
        html: true,
        typographer: true,
      });
    const hljs = require('highlight.js');
    console.log(list);
    const selRepo = list.find((item) => item.repoID === repo);
    console.log(selRepo);

    
    if (!selRepo) {
        return null; // Or return some fallback UI
    }

    const [value, setValue] = useState(selRepo.readmeText);

    useEffect(() => {
        setValue(selRepo.readmeText);
    },[selRepo]);

    const copyText = () => {
        if (selRepo) {
          copy(value);
          toast.success("Markdown copied to clipboard");
        }
      };

    const changeText = (value) => {
        setValue(value);
        selRepo.readmeText = value;
    };


    if(selRepo){
        const txt = md.render(selRepo.readmeText);
        const sanitizedFile = () => ({ __html: DOMPurify.sanitize(txt) });
        return (<>
            <div>
              <div className="relative min-w-[70vw] my-5 mb-20 mx-6 md:mx-16 bg-[#0d1117] rounded-2xl p-5">
                <button 
                    onClick={copyText} 
                    className="absolute flex items-center gap-2 top-[1.3rem] z-20 right-6 px-2 bg-indigo-900 rounded-md text-white hover:bg-indigo-600 hover:text-white transition-all duration-75"
                >
                    <div className="flex p-1 lg:hidden"><IoMdCopy size={25} /></div>
                    <div className="hidden lg:flex items-center gap-2">Copy Markdown<IoMdCopy size={20} /></div>
                </button>
                  {(mode == 'Preview') ? <div className="flex flex-col ">
                    {/* <div id="test_document" className="flex flex-col gap-5 leading-8" dangerouslySetInnerHTML={sanitizedFile()}/> */}
                    {/* <Markdown remarkPlugins={[remarkGfm]} className="leading-8 flex flex-col gap-5">{txt}</Markdown> */}
                    <MDEditor.Markdown  source={value} style={{lineHeight: '3'}} components={{
                        ul: ({node, ...props}) => <ul style={{listStyleType: 'circle'}} {...props} />,
                        ol: ({node, ...props}) => <ol style={{listStyleType: 'decimal'}} {...props} />,
                    }} />
                  </div>
                    : <>
                    <div className="flex lg:hidden">
                    <div className="z-10 flex flex-col whitespace-pre-wrap">
                        <MDEditor
                            value={value}
                            onChange={changeText}
                            preview="edit"
                            height={"100%"}
                            hideToolbar={true}
                        />
                    </div>
                    </div>
                    <div className="hidden lg:flex">
                    <div className="z-10 flex w-full flex-col whitespace-pre-wrap">
                        <MDEditor
                            value={value}
                            onChange={changeText}
                            preview="live"
                            height={"100%"} 
                        />
                    </div>
                    </div>
                    
                    
                    </>
            }
              </div>
            </div>
            <ToastContainer autoClose={1500} theme="dark" draggable closeOnClick/>
        </>)
    }
  
}

export { ReadmeText };