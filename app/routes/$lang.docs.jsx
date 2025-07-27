import { useLoaderData } from "@remix-run/react";
import Breadcrumb from "../components/Breadcrumb";
import prisma from "../db.server";
import { useEffect, useState } from "react";
import { getSession } from "../services/session.server";
import Documents from "../components/Documents";
import { setMetaTag } from "../libs/helper";
import { useTranslation } from "react-i18next";
import defaultlogo from "/images/logo/logo.svg";


export const meta = ({ params }) => {
    const title = "Inkybay Knowledgebase - Product Customization Software for Print Shops";
    const metaDescription = `Welcome to the JewelsLab Help Center — your one-stop support hub for all things jewelry customization! 
                            Whether you have questions about your order, need help using our design tools, or want to report an issue,
                            we're here to help.`
    const metaImage = defaultlogo;
    const urlParams = `/${params?.lang}/docs`;
    
    // Set meta tag if null please set value null
    const metaData = setMetaTag({title, metaImage, metaDescription, urlParams});
    return metaData;
}

export const loader = async({request, params}) => {
    // If in url not found language then language code get from cookie and
    // set it as a selected language
    let selectedLanguage = params?.lang;
    if(!selectedLanguage){
        let session = await getSession(request.headers.get("cookie"));
        selectedLanguage = session.get('user-selected-language');
    }

    const url = new URL(request?.url);
    const page = url?.searchParams.get('page') || 1;
    const showData = 10;
    const skipData = page > 1 ? (page -1) * showData : 0;

    const documents = await prisma.docs.findMany({
        select: {
            id: true, slug: true, title: true,
            docsLanguage:{
                select: {
                    id: true, title: true, shortDescription: true, content: true
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
        orderBy: {
            id: "desc"
        },
        take: showData,
        skip: skipData
    });

    return {
        data: {
            page: page,
            docs: documents,
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



export default function Docs() {
    const {t} = useTranslation();
    const loaderData = useLoaderData();
    const [docsData, setDocsData] = useState([]);
    const [page, setPage] = useState(1);


    useEffect(()=> {
        if(loaderData){
            setDocsData(loaderData?.data?.docs);
            setPage(loaderData?.data?.page)
        }
    }, [loaderData]);

    return (
        <div className="flex flex-col min-h-screen">
            <Breadcrumb selectedCategory={''} activePage={t('docs')}/>
            <Documents docs={docsData} page={page}/>
        </div>
    )
}