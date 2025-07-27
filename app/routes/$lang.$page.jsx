import { useTranslation } from "react-i18next";
import Breadcrumb from "../components/Breadcrumb";
import { setMetaTag } from "../libs/helper";
import defaultlogo from "/images/logo/logo.svg";
import { useEffect, useState } from "react";
import { redirect, useLoaderData } from "@remix-run/react";
import { getSession } from "../services/session.server";
import prisma from "../db.server";

export const loader = async({request, params})=> {

    let selectedLanguage = params?.lang;
    if(!selectedLanguage){
        let session = await getSession(request.headers.get("cookie"));
        selectedLanguage = session.get('user-selected-language');
    }

    let pageSlug = params?.slug ? params?.slug : "";

    const pageData = await prisma?.pages.findFirst({
        select: {
            id: true,
            name: true,
            slug: true,
            updatedAt: true,
            createdAt: true,
            pageLanguage:{
                select: {
                    id: true,
                    title: true,
                    name: true,
                    content: true,
                },
                where:{
                    lang: selectedLanguage
                }
            },
        },
        where: {
            slug: pageSlug,
            status: "ACTIVE"
        }
    });
    
    //If data nof found or manual change this route , then it will redirect to the error page
    if(!pageData?.id){
        return redirect("/error")
    }
    
    return {
        data: {
            pageData: pageData
        }
    }
}

export const meta = ({ data, params }) => {
    const title = `InkyBay - Product Customizer - ${data?.data?.pageData?.pageLanguage?.[0]?.name}`;
    const metaDescription = `InkyBay - Product Customizer Software for Shopify, Privacy Policy`
    const metaImage = defaultlogo;
    const urlParams = `/${params?.lang}/${data?.data?.pageData?.slug}`;
    
    // Set meta tag if null please set value null
    const metaData = setMetaTag({title, metaImage, metaDescription, urlParams});
    return metaData;
}

export default function CustomPage() {
    const {t} = useTranslation();
    const loaderData = useLoaderData();
    const [pageData, setpageData] = useState({});

    useEffect(()=> {
        if(loaderData){
            setpageData(loaderData?.data?.pageData);
        }
    }, [loaderData]);

    return (
        <div className="w-full">
            <Breadcrumb selectedCategory={''} activePage={pageData?.pageLanguage?.[0]?.name} showSearchBar={false}/>
            <section className="w-full">
                <div className="container flex justify-center items-center py-10 px-5">
                    <div className="flex flex-col justify-center items-center gap-12">
                        <div className="flex flex-col justify-center items-center gap-4">

                            <h2 className="text-[#101828] font-semibold">{pageData?.pageLanguage?.[0]?.title}</h2>
                        </div>
                    </div>
                </div>

                {pageData?.pageLanguage?. length > 0 ? pageData?.pageLanguage?.map((section) => (
                    <div key={section?.id} className="container flex justify-start items-start py-5 px-5">
                        <div className="documantation_details_section">
                            <div className="text-[#212121] documantation_paragraph_section">
                                <div className="documantation_details_section">
                                    {/* <h4 className="text-[#16171A]">{index+1}.{0 + 1} {section?.subtitle}</h4> */}
                                    <p className="text-[#212121] documantation_paragraph_section" dangerouslySetInnerHTML={{__html:`${section?.content}`}}/>
                                    </div>
                                </div>
                        </div>
                    </div>
                )) : (
                    <div className="container flex justify-start items-start py-5 px-5">
                        <div className="documantation_details_section">
                            <div className="text-[#212121] documantation_paragraph_section">
                                    <div className="documantation_details_section">
                                        <h4 className="text-[#16171A]">{t("result_not_found")}</h4>
                                    </div>
                                </div>
                        </div>
                    </div>
                )}


            </section>
            
        </div>
    )
}
