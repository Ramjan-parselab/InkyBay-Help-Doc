import { Outlet, redirect, useLoaderData, useParams, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Sidebar from "../../components/SideBar";
import prisma from "../../db.server";
import { commitSession, getSession } from "../../services/session.server";


export const loader = async({request, params}) => {
  // If in url not found language then language code get from cookie and
    // set it as a selected language
    let selectedLanguage = params?.lang;
    if(!selectedLanguage){
        let session = await getSession(request.headers.get("cookie"));
        selectedLanguage = session.get('user-selected-language');
    }

    // find out category last serial number
    const languages = await prisma.language.findMany({
        where: {
            status: "ACTIVE"
        },
    });

     // Get all active categories for the sidebar component
    const categories = await prisma.categories.findMany({
        select:{
            id: true, 
            name: true,
            slug: true,
            icon: true,
            level: true,
            subCategory: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    level: true,
                    docs: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            docsLanguage:{
                                select: {
                                    id: true,
                                    title: true
                                },
                                where:{
                                    lang: selectedLanguage
                                }
                            }
                        },
                    },
                    categoryLanguage:{
                        select: {
                            lang: true,
                            name: true,
                            description: true
                        },
                        where:{
                            lang: selectedLanguage
                        }
                    },
                },
                where:{
                    status: "ACTIVE",
                }
            },
            categoryLanguage:{
                select: {
                    lang: true,
                    name: true,
                    description: true
                },
                where:{
                    lang: selectedLanguage
                }
            },
            docs:{
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    docsLanguage:{
                        select: {
                            id: true,
                            title: true
                        },
                        where:{
                            lang: selectedLanguage
                        }
                    }
                },
            }
        },
        where:{
            level: "LEVEL_1",
            status: "ACTIVE"
        },
        orderBy: {
            id: "asc"
        }
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
            categories: categories,
            footerMenus: footerMenus,
            socials: socials,
            selectedLanguage: selectedLanguage
        }
    };
}

export const action = async({request, params}) => {
    const formData = await request.formData();
    const target = formData.get('target') || "";

    // If in url not found language then language code get from cookie and
    // set it as a selected language
    let selectedLanguage = params?.lang;
    if(!selectedLanguage){
        let session = await getSession(request.headers.get("cookie"));
        selectedLanguage = session.get('user-selected-language');
    }

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
    }else if(target == "search-help-doc"){
      console.log("=====================")
      console.log("============hhhh =========", target)
      console.log("=====================")
    }
    else{
      alert("action target is missing");
      return "";
    }
}

export default function Index() {
    const loaderData = useLoaderData();
    const [languageData, SetLanguageData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [footerMenuData, SetFooterMenuData] = useState([]);
    const [socialMediaData, SetSocialMediaData] = useState([]);

    const params = useParams();
    let filteredCategory = "";
    let selectedCategory = "";
    
    if(params?.category){
        filteredCategory = categoryData?.length > 0 ? categoryData?.filter((item) => item?.slug === params?.category) : [];
        selectedCategory = filteredCategory?.length > 0 ?  filteredCategory?.map((item) => ({
            id: item?.id,
            name: item?.name,
            level: item?.level,
            slug: item?.slug,
            categoryLanguage: item?.categoryLanguage,
        }))?.[0] : [];
         
    }
    if(params?.subcategory){ 
        const parentCategory =  filteredCategory?.[0];
        const subCategory = parentCategory?.subCategory?.length > 0 ? parentCategory?.subCategory?.filter((item)=> item?.slug === params?.subcategory) : [];
        filteredCategory = {
            ...parentCategory,
             subCategory 
        };

        selectedCategory = {
            id: filteredCategory?.id,
            name: filteredCategory?.name,
            level: filteredCategory?.level,
            slug: filteredCategory?.slug,
            categoryLanguage: filteredCategory?.categoryLanguage,
            subCategory: [{
                id: filteredCategory?.subCategory?.[0]?.id,
                name: filteredCategory?.subCategory?.[0]?.name,
                level: filteredCategory?.subCategory?.[0]?.level,
                slug: filteredCategory?.subCategory?.[0]?.slug,
                categoryLanguage: filteredCategory?.subCategory?.[0]?.categoryLanguage,
            }],
        }; 
    }

    if(params?.slug){
         selectedCategory = {
            id: filteredCategory?.id,
            name: filteredCategory?.name,
            level: filteredCategory?.level,
            slug: filteredCategory?.slug,
            categoryLanguage: filteredCategory?.categoryLanguage,
            subCategory: [{
                id: filteredCategory?.subCategory?.[0]?.id,
                name: filteredCategory?.subCategory?.[0]?.name,
                level: filteredCategory?.subCategory?.[0]?.level,
                slug: filteredCategory?.subCategory?.[0]?.slug,
                categoryLanguage: filteredCategory?.subCategory?.[0]?.categoryLanguage,
                docs: filteredCategory?.subCategory?.[0]?.docs
            }],
        }; 
    }

    const submit = useSubmit();

    const handleSubmit = (submitData)=> {
        submit(submitData, {method: "POST"});
    }

    useEffect(()=> {
      if(loaderData) {
        SetLanguageData(loaderData?.data?.languages);
        setCategoryData(loaderData?.data?.categories);
        SetFooterMenuData(loaderData?.data?.footerMenus);
        SetSocialMediaData(loaderData?.data?.socials);
      }
    },[loaderData]);

    return (
      <>
        <Header languages={languageData} handleSubmit={handleSubmit}/>
        <div className="w-full h-full"> 
            <div className="flex w-full h-full">
                  <Sidebar categoryData={categoryData} selectedCategory={selectedCategory}/>
                  <Outlet context={{ selectedCategory }}/> 
            </div>
        </div>
        <Footer footerMenuData={footerMenuData} socialMediaData={socialMediaData}/>
      </>
    );
}
