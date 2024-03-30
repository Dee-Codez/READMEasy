"use client"
import { IoMdHome } from "react-icons/io";
import { useRouter } from "next/navigation";


function HomeBTN() {

    const router = useRouter();

  return (
  <div>
    <div className="" >
        <div onClick={()=>{router.push("/")}} className="bg-sky-200/25 text-sky-400 flex text-lg gap-2 cursor-pointer hover:bg-sky-100/30 items-center p-2 rounded-md">
            <IoMdHome className="m-[.4rem] sm:m-0" size={20}/>
            <p className="hidden sm:flex">Home</p>
        </div>
    </div>
  </div>
  );
}

export { HomeBTN };