import { Outlet, redirect, useLoaderData, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import prisma from "../db.server";
import { commitSession, getSession } from "../services/session.server";
import PageLoader from "../components/PageLoader";


export const loader = async({request, params}) => {
    // If in url not found language then language code get from cookie and
    // set it as a selected language
    let selectedLanguage = params?.lang;
    if(!selectedLanguage){
        let session = await getSession(request.headers.get("cookie"));
        selectedLanguage = session.get('user-selected-language');
    }

    // Get All Active Language
    const languages = await prisma.language.findMany({
        where: {
            status: "ACTIVE"
        },
    });
    
    //If language code not match with our language code then 
    // it will redirect to error page
    const languageCodes = languages?.length > 0 ? languages?.map((item)=> item?.code) : [];
    if(!languageCodes?.includes(selectedLanguage)){
        // throw new Response("Error is ready",{status:404});
        return redirect("/error");
    }
    

    // This settings fetch only logo from url
    // If user set Logo it will be set to the header page 
    // If not then display only local image
    const settings = await prisma.settings.findFirst({
        where: { id: 2 , fieldType: "_LOGO"},
    });

    const footerMenus = await prisma.footerMenu.findMany({
        select:{
            id: true, 
            name: true,
            url: true,
            newTab: true,
            footerMenuLanguage:{
                select: {
                    lang: true,
                    name: true
                },
                where:{
                    lang: selectedLanguage
                    
                }
            },
        },
        orderBy: {
            position: "asc"
        }
    });

    const socials = await prisma.socialMedia.findMany({
        select:{
          id: true, name:true, url: true, logo: true
        }
    });


  return {
      data:{
        languages: languages,
        footerMenus: footerMenus,
        socials: socials,
        settings: settings,
        selectedLanguage: selectedLanguage
      }
  };
}

export const action = async({request}) => {
    const formData = await request.formData();
    const target = formData.get('target') || "";

    if(target == "language-change"){
      try {
          const url = formData.get("url") || "";
          const urlPath = url?.split("/");
          const languageCode  = urlPath?.[0];

          let session = await getSession(request.headers.get("cookie"));
          session.set("user-selected-language", languageCode);

          // commit the session
          let headers = new Headers({ "Set-Cookie": await commitSession(session) });
          return redirect(`/${url}`, { headers });
        
      } catch (error) {
          console.log(error);
          return {
              target: target,
              message: "Sorry language setup fail",
              data: error,
          }
      }

    }else{
      alert("action target is missing");
      return "";
    }
}

export default function Index() {
  const loaderData = useLoaderData();
  const [languageData, SetLanguageData] = useState([]);
  const [footerMenuData, SetFooterMenuData] = useState([]);
  const [socialMediaData, SetSocialMediaData] = useState([]);
  const [logoData, setlogoData] = useState([]);
  const [pageLoader, setPageLoader] = useState(true);


  const submit = useSubmit();

  const handleSubmit = (submitData)=> {
      submit(submitData, {method: "POST"});
  }


  useEffect(()=> {
    if(loaderData) {
      SetLanguageData(loaderData?.data?.languages);
      SetFooterMenuData(loaderData?.data?.footerMenus);
      SetSocialMediaData(loaderData?.data?.socials);
      // Here fieldValue return this type of result {"url":"/images/logo/1747736088668_Logo (1).png"}
      // that's why we format this value
      const logoInfo = loaderData?.data?.settings?.fieldValue ? JSON.parse(loaderData?.data?.settings?.fieldValue) : 0
      
      setlogoData(logoInfo);
      setPageLoader(false);
    }
},[loaderData]);


  return (
    <>
        {pageLoader ? (
            <PageLoader />
        ) : (
            <> 
                <Header logoData={logoData} languages={languageData} handleSubmit={handleSubmit}/>
                <main className="w-full -mt-[2px] border-t-2 border-[#000]"> 
                <Outlet />
                </main>
                <Footer footerMenuData={footerMenuData} socialMediaData={socialMediaData}/>
            </>
        )}
    </>
  );
}
