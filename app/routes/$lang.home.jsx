import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import Faq from "../components/Faq";
import Featured from "../components/featured";
import HelpCenter from "../components/HelpCenter";
import Hero from "../components/Hero";
import Notice from "../components/Notice";
import Support from "../components/Support";
import prisma from "../db.server";
import { setMetaTag } from "../libs/helper";
import { getSession } from "../services/session.server";
import defaultlogo from "/images/logo/logo.svg";

export const meta = () => {
    const title = "Inkybay Knowledgebase - Product Customization Software for Print Shops";
    const metaDescription = `"Welcome to the InkyBay Help Center — your one-stop support hub for all things customization! 
                             Whether you have questions about your order, need help using our design tools, or want to report an issue,
                             we're here to help."`;
    const metaImage = defaultlogo;
    
    // Set meta tag if null please set value null
    const metaData = setMetaTag({title, metaImage, metaDescription});
    return metaData;
}

export const loader = async ({request, params}) => {
    // If in url not found language then language code get from cookie and
    // set it as a selected language
    let selectedLanguage = params?.lang;
    if(!selectedLanguage){
        let session = await getSession(request.headers.get("cookie"));
        selectedLanguage = session.get('user-selected-language');
    }

    const docs = await prisma.docs.findMany({
        select: {
            id: true, slug: true, docsLanguage: true
        },
        orderBy: {
            id: "desc"
        }
    });

   const featuredDocs = await prisma.docs.findMany({
        select: {
            id: true, slug: true, title: true,
            docsLanguage:{
                select: {
                    id: true, title: true, shortDescription: true, 
                },
                where:{
                    lang: selectedLanguage,
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
        where:{
            isPin: true
        },
        orderBy: {
            id: "desc"
        },
        take: 6
    });

    const popularSearch = await prisma.popularSearch.findMany({
        select:{
            id: true, 
            lang: true,
            title: true
        },
        where:{
            lang: selectedLanguage,
            count: { gt: 5 }
        },
        take: 3,
        orderBy:{
            id: "desc"
        },
    });


    const settings = await prisma.settings.findFirst({
        where: { id: 1 , fieldType: "_NOTICE"},
    });

    const categories = await prisma.categories.findMany({
        select:{
            id: true, 
            name: true,
            slug: true,
            docs: {
                select:{
                    id: true,
                    slug: true
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
        take: 6,
        where:{
            level: "LEVEL_1",
            status: "ACTIVE"
        },
        orderBy: {
            id: "asc"
        }
    });

    const supports = await prisma.supports.findMany({
        select:{
            id: true, 
            title: true,
            url: true,
            newTab: true,
            supportLanguage:{
                select: {
                    lang: true,
                    title: true,
                    description: true,
                    buttonText: true,
                },
                where:{
                   lang: selectedLanguage
                }
            },
        },
        where:{
            status: "ACTIVE"
        },
        take: 3,
        orderBy: {
            id: "asc"
        }
    });

    // Fetch Faq from other server using API 
    const faqResponse = await fetch('https://jsonplaceholder.typicode.com/todos')
                        .then(response => response.json())
    const faqData = faqResponse ;
    
    return {
        data:{
            docs: docs,
            popularSearch: popularSearch,
            settings: settings,
            categories: categories,
            supports: supports,
            faqData: faqData,
            featuredDocs: featuredDocs,
            selectedLanguage: selectedLanguage,
            
        }
    };
    
}

export const action = async({request, params})=> {
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
                            title: {contains: query},
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

    }else if(target == "store-populate-search"){
        const query = formData.get("query");
        try{
            // Find out dupicate title 
            const duplicate = await prisma.popularSearch.findFirst({
                select:{
                    id: true,
                },
                where:{
                    title: query,
                    lang: selectedLanguage
                }
            });


            // Store popular search
            if(duplicate?.id){
                await prisma.popularSearch.update({
                    data:{
                        count: { increment: 1 }
                    },
                    where:{
                        id: duplicate?.id,
                    },
                });
            }else{
                await prisma.popularSearch.create({
                   data:{
                    title: query,
                    lang: selectedLanguage,
                    count: 1
                },
                });
            }
            
            
            return {
                target: target,
                message: "Store help doc",
                data: [],
            }
        }catch(error){
            return {
                target: target,
                message: "Sorry help doc not found",
                data: error,
            }
        }
    }
}

export default function Home() {
    const loaderData = useLoaderData();
    const [noticeData, setNoticeData] = useState({});
    const [categoryData, setCategoryData] = useState([]);
    const [supportData, setSupportData] = useState([]);
    const [faqData, setFaqData] = useState([]);
    const [featuredDocsData, setFeaturedDocsData] = useState([]);


    useEffect(()=> {
        if(loaderData){
            setCategoryData(loaderData?.data?.categories);
            const notice = loaderData?.data?.settings?.fieldValue ? JSON.parse(loaderData?.data?.settings?.fieldValue) : 0
            setNoticeData(notice);
            setSupportData(loaderData?.data?.supports);
            setFaqData(loaderData?.data?.faqData);
            setFeaturedDocsData(loaderData?.data?.featuredDocs);
        }
    }, [loaderData]);

    return (
        <div className="w-full">
            <Hero />
             {parseInt(noticeData?.visibility) > 0 && (
                <Notice />
             )}
             {featuredDocsData?.length > 0 && (
                <Featured featuredData={featuredDocsData}/>
             )}
            <HelpCenter categoryData={categoryData}/>
            <Faq faqData={faqData}/>
            <Support supportData={supportData} />
        </div>
    )
}
