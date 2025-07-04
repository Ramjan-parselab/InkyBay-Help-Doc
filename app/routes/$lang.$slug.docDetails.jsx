import { redirect, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Toaster, toast } from 'sonner';
import Breadcrumb from "../components/Breadcrumb";
import HelpDetails from "../components/HelpDetails";
import Sidebar from "../components/SideBar";
import prisma from "../db.server";
import { setMetaTag } from "../libs/helper";
import { getSession } from "../services/session.server";

export const meta =   ({ data }) => {
    const siteName = "InkyBay Help Center";
    const title = data?.data?.helpDocDetails ? data?.data?.helpDocDetails?.docsLanguage?.[0]?.title : "InkyBay Help Center";
    const metaTitle = `InkyBay Help Center`;
    const metaDescription = data?.data?.helpDocDetails ? data?.data?.helpDocDetails?.docsLanguage?.[0]?.shortDescription : "InkyBay Help Center description";
    const metaType = "website";
    
    // Set meta tag if null please set value null
    const metaData = setMetaTag(siteName, title, metaTitle, metaDescription,  metaType);
    return metaData;
}



export const loader = async ({request, params})=> {
    // If in url not found language then language code get from cookie and
    // set it as a selected language
    let selectedLanguage = params?.lang;
    if(!selectedLanguage){
        let session = await getSession(request.headers.get("cookie"));
        selectedLanguage = session.get('user-selected-language');
    }

    let documentSlug = params?.slug ? params?.slug : "";
    
    const helpDocDetails = await prisma?.docs.findFirst({
        select: {
            id: true,
            title: true,
            slug: true,
            updatedAt: true,
            createdAt: true,
            docsLanguage:{
                select: {
                    id: true,
                    title: true,
                    subtitle: true,
                    content: true,
                    shortDescription: true,
                },
                where:{
                    lang: selectedLanguage
                }
            },
            category:{
                select:{
                    id: true, name: true, level: true, slug: true,
                    categoryLanguage:{
                        select: {
                            lang: true,
                            name: true,
                            description: true,
                        },
                        where:{
                            lang: selectedLanguage
                        }
                    },
                },
            } 
        },
        where: {
            slug: documentSlug
        }
    });
    
    //If data nof found or manual change this route , then it will redirect to the error page
    if(!helpDocDetails?.id){
        return redirect("/error")
    }
    

    // Get all active categories for the sidebar component
   const categories = await prisma.categories.findMany({
        select:{
            id: true, 
            name: true,
            slug: true,
            icon: true,
            subCategory: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
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

    

    const nexPageData = await prisma.docs.findFirst({
        select:{
            id: true, title: true, slug: true,
            docsLanguage: {
                select:{
                    id: true, title: true
                },
                where:{
                    lang: selectedLanguage
                }
            },
             category: {
                select :{
                    id: true, slug: true,
                    category: {
                        select :{
                            id: true, slug: true,
                        }
                    }
                }
            }
        },
        where: {
            id: { gt:  helpDocDetails?.id}
        }
    });

    const previousData = await prisma.docs.findFirst({
        select:{
            id: true, title: true, slug: true,
            docsLanguage: {
                select:{
                    id: true, title: true
                },
                where:{
                    lang: selectedLanguage
                }
            },
             category: {
                select :{
                    id: true, slug: true,
                    category: {
                        select :{
                            id: true, slug: true,
                        }
                    }
                }
            }
        },
        where: {
            id: { lt:  helpDocDetails?.id}
        }
    });

    return {
        data: {
            categories: categories,
            helpDocDetails: helpDocDetails,
            selectedLanguage: selectedLanguage
        }
    }
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

    if(target == "search-help-doc"){
        const query = formData.get("query");
        try {
            const searchResult = await prisma.docs.findMany({
                select: { 
                    id: true, 
                    title: true,
                    slug: true,
                    docsLanguage: {
                        select: {
                            id: true,
                            title: true,
                            subtitle: true,
                            content: true,
                            shortDescription: true,
                        },
                        where:{
                            title: {startsWith: query},
                            lang: selectedLanguage ? selectedLanguage: "en"
                        }
                    },
                    category:{
                        select:{
                            id: true,
                            slug: true,
                            category:{
                                select:{
                                    id: true,
                                    slug: true,
                                }
                            }
                        },
                    }
                },
            });

            return {
                target: target,
                message: "help doc list found",
                data: searchResult,
            }

        } catch (error) {
            return {
                target: target,
                message: "Sorry help doc not found",
                data: error,
            }
        }

    }
    else if(target === "post-review"){
        const data = formData.get('data') || "";
        const submitData = data ?  JSON.parse(data) : {};
        const review = submitData?.review;
        const docId  = submitData?.docId;
        
        try {
            await prisma.helpDocReviews?.create({
                data:{
                    review: review,
                    docId: docId
                }
            });
            
            return {
                target: target,
                message: "Successfully ! review has been send",
                data: [],
            }
        } catch (error) {
            return {
                target: target,
                message: "Sorry review fial please try again!",
                data: error,
            }
        }
    }
}


export default function DocDetails() {
    const loaderData = useLoaderData();
    const actionData = useActionData();
    const [categoryData, setCategoryData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [helpDocDetails, setHelpDocDetails] = useState([]);    

    useEffect(()=> {
        if(loaderData){
            setCategoryData(loaderData?.data?.categories);
            setSelectedCategory(loaderData?.data?.helpDocDetails?.category);
            if(loaderData?.data?.helpDocDetails){
                setHelpDocDetails(loaderData?.data?.helpDocDetails);
            }
        }
    }, [loaderData]);

    useEffect(()=> {
        if(actionData){
            if(actionData?.target == "post-review"){
                // Here store review flug to browser storeage that 
                // user already given review for this help doc
                localStorage.setItem(`${helpDocDetails?.slug}_review`, JSON.stringify({ slug: helpDocDetails?.slug,  updatedAt: new Date(helpDocDetails?.updatedAt)}));
                toast.success(actionData.message, {style: { background: "#66C25F", color: "white" } });
            }
        }
    },[actionData]);
    
    return (
        <>
           <div className="flex w-full">
                    <Toaster  position="top-right" closeButton={true}  />
                    <Sidebar categoryData={categoryData} selectedCategory={selectedCategory}/>
                    <main className="border-l border-[#C0C0C0] bg-white w-full">
                        <Breadcrumb selectedCategory={selectedCategory}/>
                        <HelpDetails 
                            helpDocDetails={helpDocDetails} 
                            RelatedArticlesData={[]} 
                            selectedCategory={selectedCategory} 
                        />
                    </main>
            </div>
        </>
    );
}