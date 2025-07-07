import { redirect, useActionData, useLoaderData, useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Toaster, toast } from 'sonner';
import Breadcrumb from "../../components/Breadcrumb";
import HelpDetails from "../../components/HelpDetails";
import prisma from "../../db.server";
import { getSession } from "../../services/session.server";


export const meta =   ({ data }) => {
    const title = data?.data?.selectedCategory ? data?.data?.selectedCategory?.subCategory?.[0]?.docs?.[0]?.docsLanguage?.[0]?.title : "JewelsLab Help Center";
    const description = data?.data?.helpDocDetails ? data?.data?.helpDocDetails?.docsLanguage?.[0]?.shortDescription : "JewelsLab Help Center";

     return ([
         { title: `${title} | JewelsLab Help Center` },
         { name: "description",  content: description,  },
     ]);
}

export const loader = async ({request, params})=> {
    // If in url not found language then language code get from cookie and
    // set it as a selected language
    let selectedLanguage = params?.lang;
    if(!selectedLanguage){
        let session = await getSession(request.headers.get("cookie"));
        selectedLanguage = session.get('user-selected-language');
    }

    let categorySlug = params?.category ? params?.category : "";
    let subcategorySlug = params?.subcategory ? params?.subcategory : "";
    let documentSlug = params?.slug ? params?.slug : "";

    
    const selectedCategory = await prisma.categories.findFirst({
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
            subCategory:{
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
                    docs:{
                        select:{
                            id:true, title: true, slug: true,
                            docsLanguage: {
                                select:{
                                    id: true, title: true,
                                },
                                where:{
                                    lang: selectedLanguage
                                }
                            }
                        },
                        where:{
                            slug: documentSlug
                        }
                    }
                },
                where: {
                    slug: subcategorySlug
                }
            },
        },
        where: {
            slug: categorySlug
        }
    });

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
                select:{
                    id: true,
                    slug: true,
                }
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
                    shortDescription: true
                },
                where:{
                    lang: selectedLanguage
                }
            }, 
        },
        where: {
            slug: documentSlug
        }
    });

    //If data nof found or manual change this route , then it will redirect to the error page
    if(!helpDocDetails?.id){
        return redirect("/error")
    }

    const relatedArticales = await prisma?.docs.findMany({
        select: {
            id: true,
            title: true,
            slug: true,
            docsLanguage: {
                select: {
                    title: true,
                    subtitle: true
                },
                where:{
                    lang: selectedLanguage
                }
            }
        },
        where: {
            categoryId: selectedCategory?.subCategory?.[0]?.id,
            NOT:{
                id: helpDocDetails?.id
            }
        },
    });

    const nexPageData = await prisma.categories.findFirst({
        select:{
            id: true, name: true, slug: true,
            subCategory:{
               select:{
                   id: true, name: true, slug: true,
                   docs:{
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
                        },
                         where:{
                            id: { gt: helpDocDetails?.id}
                        }
                   },
               },
               where:{
                 status: "ACTIVE",
                 slug: subcategorySlug,
               }
            }
        },
        where:{
            slug: categorySlug,
            status: "ACTIVE"
        }
    })

    const previousData = await prisma.categories.findFirst({
        select:{
            id: true, name: true, slug: true,
            subCategory:{
               select:{
                   id: true, name: true, slug: true,
                   docs:{
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
                        },
                         where:{
                            id: { lt: helpDocDetails?.id}
                        }
                   }
               },
               where:{
                 status: "ACTIVE",
                 slug: subcategorySlug,
               }
            }
        },
        where:{
            slug: categorySlug,
            status: "ACTIVE"
        }
    })

    return {
        data: {
            categories: categories,
            selectedCategory: selectedCategory,
            helpDocDetails: helpDocDetails,
            relatedArticales: relatedArticales,
            nexPageData: nexPageData,
            previousData: previousData,
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
    
    if(target === "post-review"){
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
    }else if(target == "search-help-doc"){
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
}


export default function Details() {
    const loaderData = useLoaderData();
    const actionData = useActionData();
    const { selectedCategory } = useOutletContext();
    const [helpDocDetails, setHelpDocDetails] = useState([]);
    const [RelatedArticlesData, setRelatedArticlesData] = useState();
    const [nexPageData, setNextPageData] = useState("");    
    const [previousPageData, setPreviousPageData] = useState("");    

    useEffect(()=> {
        if(loaderData){
            if(loaderData?.data?.helpDocDetails){
                setHelpDocDetails(loaderData?.data?.helpDocDetails);
            }
            if(loaderData?.data?.relatedArticales?.length > 0){
                setRelatedArticlesData(loaderData?.data?.relatedArticales);
            }
            setNextPageData(loaderData?.data?.nexPageData);
            setPreviousPageData(loaderData?.data?.previousData);
        }
    }, [loaderData]);

    useEffect(()=> {
        if(actionData){
            if(actionData?.target == "post-review"){
                // Here store review flug to browser storeage that 
                // user already given review for this help doc
                localStorage.setItem(`${helpDocDetails?.slug}_review`, JSON.stringify({ slug: helpDocDetails?.slug,  updatedAt: new Date(helpDocDetails?.updatedAt)}));
                toast.success(actionData.message, {style: { background: "#66C25F", color: "white" } });
                alert(actionData?.message);
            }
        }
    },[actionData]);

    console.log("nexPageData===", nexPageData)

    return (
        <>
          <main className="border-l border-[#C0C0C0] bg-white w-full">
            <Toaster  position="top-right" closeButton={true}  />   
                <Breadcrumb selectedCategory={selectedCategory}/>
                <HelpDetails 
                    helpDocDetails={helpDocDetails} 
                    RelatedArticlesData={RelatedArticlesData} 
                    selectedCategory={selectedCategory} 
                    nexPageData={nexPageData}
                    previousPageData={previousPageData}
                />
            </main>
        </>
    );
}