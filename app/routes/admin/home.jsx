import { Outlet, redirect, useLoaderData } from "@remix-run/react";
import Sidebar from "../../components/admin/Sidebar";
import { getSession, sessionStorage } from "../../services/session.server";
import prisma from "../../db.server";
import { useEffect, useState } from "react";
import defaultLogo from "/images/logo/logo.svg";

export const loader = async({request}) => {
  let session = await getSession(request.headers.get("cookie"));
  const sessionId = session.get('sessionId');
  let user = [];
  let logo = "";
  if(sessionId){
    //Get  logo from settings
    logo = await prisma.settings.findFirst({
        where: { fieldType: "_LOGO"}
    })

    // find out login user
      user = await prisma.users.findFirst({
          where: {
              id: parseInt(sessionId)
          },
      });
  }else{
     return redirect("/admin/login")
  }


  return {
      data:{
          user: user,
          logo: logo
      }
  };
}

export const action = async ({ request }) => {
    let session = await getSession(request.headers.get("cookie"));
    return redirect("/admin/login", {
        headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
    });
}

export default function Home () {
    const loaderData = useLoaderData()
    const [userInfo, setUserInfo] = useState({});
    const [logo, setLogo] = useState("");

     useEffect(()=> {
            if(loaderData){
                if(loaderData?.data?.user?.id) {
                    setUserInfo(loaderData?.data?.user); 
                }
                if(loaderData?.data?.logo?.id){
                  const logo = loaderData?.data?.logo;
                  const logoValue = JSON.parse(logo?.fieldValue)?.url;
                  setLogo(logoValue)
                }else{
                    setLogo(defaultLogo)
                }
                
            }
        },[loaderData]);

    return (
      <div className="min-h-screen  flex flex-row bg-gray-50 text-gray-800 w-full">
        <Sidebar user={userInfo} logo={logo}/>
        <main className="flex-1 p-6 ml-64">
          <div className="max-w-[950px] mx-auto">
              <Outlet />
          </div>
        </main>
      </div>
      );
}