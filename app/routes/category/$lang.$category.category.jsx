import { redirect, useLoaderData, useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import CategoryContent from "../../components/CategoryContent";
import prisma from "../../db.server";
import { setMetaTag } from "../../libs/helper";
import { getSession } from "../../services/session.server";
import defaultlogo from "/images/logo/logo.svg";


export const meta = ({ data, params }) => {
    const title = data?.data?.categoryContent?.length > 0 ? `${data?.data?.categoryContent?.[0]?.name} - Product Customization Software for Print Shops` : "InkyBay Help Center";
    const metaDescription =  "";
    const metaImage = defaultlogo;
    const urlParams = `/${params?.lang}/${params?.category}`;

    // Set meta tag if null please set value null
    const metaData = setMetaTag({title, metaImage, metaDescription, urlParams});
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

    const categorySlug = params?.category || "";

    const  categoryContent = await prisma.categories.findMany({
        select:{
            id: true, 
            name: true,
            slug: true,
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
                        where: { lang: selectedLanguage }
                    },
                },
                where:{
                    status: "ACTIVE"
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
        },
        where:{
            level: "LEVEL_1",
            status: "ACTIVE",
            slug: categorySlug
            
        },
        orderBy: {
            id: "asc"
        }
    });

    // If data nof found or manual change this route , then it will redirect to the error page
    if(!categoryContent?.length > 0){
        return redirect("/error")
    }
    
    return {
        data: {
            categoryContent: categoryContent,
            selectedLanguage: selectedLanguage
        }
    }
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

    }
}


export default function Category() {
    const loaderData = useLoaderData();
    const { selectedCategory } = useOutletContext();
    const [categoryContentData, setCategoryContentData] = useState([]);
    
    useEffect(()=> {
            if(loaderData){
                if(loaderData?.data?.categoryContent?.length > 0){
                    setCategoryContentData(loaderData?.data?.categoryContent?.[0]?.subCategory);
                }
            }
        }, [loaderData]);

    return (
        <>
            <main className="border-l border-[#C0C0C0] bg-white w-full">
                <Breadcrumb selectedCategory={selectedCategory}/>
                <CategoryContent selectedCategory={selectedCategory} categoryContentData={categoryContentData}/>  
            </main>
        </>
    );
}