import { redirect, useLoaderData, useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import SubCategoryContent from "../../components/SubCategoryContent";
import prisma from "../../db.server";
import { getSession } from "../../services/session.server";
import { setMetaTag } from "../../libs/helper";
import defaultlogo from "/images/logo/logo.svg";


export const meta = ({ data, params }) => {
    const title = data?.data?.subcategoryContent?.length > 0 ? `${data?.data?.subcategoryContent?.[0]?.name} - Product Customization Software for Print Shops` : "InkyBay Help Center";
    const metaDescription =  "";
    const metaImage = defaultlogo;
    const urlParams = `/${params?.lang}/${params?.category}/${params?.subcategory}`;

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


    let categorySlug = params?.category ? params?.category : "";
    let subcategorySlug = params?.subcategory ? params?.subcategory : "";

    const url = new URL(request?.url);
    const page = url?.searchParams.get('page') || 1;
    const showData = 6;


    const skipData = page > 1 ? (page -1) * showData : 0;

    const paginationCondition = () => {
        const baseQuery = {
            select: {
                id: true,
                title: true,
                slug: true,
                docsLanguage:{
                    select: {
                        id: true,
                        title: true,
                        content: true,
                    },
                    where:{lang: selectedLanguage}
                },
                
            },
            take: showData,
            skip: skipData
        }
        return baseQuery;
    }

    const  subcategoryContent = await prisma.categories.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                docs: paginationCondition(),
                categoryLanguage:{
                    select: {
                        lang: true,
                        name: true,
                        description: true
                    },
                    where: {
                        lang: selectedLanguage
                    }
                },
            },
            where: {
                slug: subcategorySlug
            }
        
    });

    //If data nof found or manual change this route , then it will redirect to the error page
        if(!subcategoryContent?.length > 0){
            return redirect("/error")
        }

    const totalCategoryHelpDoc = await prisma.categories.findFirst({
        select:{
           _count: {
             select:{
                docs: true
             }
           }
        },
        where: {
            slug: subcategorySlug
        }
    });
    
    return {
        data: {
            page: page,
            subcategoryContent: subcategoryContent,
            totalCategoryHelpDoc: totalCategoryHelpDoc,
            selectedLanguage: selectedLanguage,
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


export default function Category() {
    const loaderData = useLoaderData();
    const { selectedCategory } = useOutletContext();
    const [subcategoryContentData, setSubCategoryContentData] = useState([]);
    const [totalHelpDoc, setTotalHelpDoc] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(()=> {
            if(loaderData){
                if(loaderData?.data?.subcategoryContent?.length > 0){
                    setSubCategoryContentData(loaderData?.data?.subcategoryContent?.[0]);
                    setTotalHelpDoc(loaderData?.data?.totalCategoryHelpDoc);
                }
                setPage(loaderData?.data?.page)
            }
        }, [loaderData]);
    
    return (
        <>
           
                <main className="border-l border-[#C0C0C0] bg-white w-full">
                    <Breadcrumb selectedCategory={selectedCategory} />
                    <SubCategoryContent
                        selectedCategory={selectedCategory} 
                        subcategoryContentData={subcategoryContentData} 
                        totalHelpDoc={totalHelpDoc}
                        page={page}
                    />
                </main>
        </>
    );
}
