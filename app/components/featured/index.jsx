import { ArrowLeftRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLang } from "../../context/LangContext";
import Card from "../ui/card";

export default function Featured({featuredData}) {
    const { t } = useTranslation() || {};
    const selectedLanguage = useLang();

    
    return (
            <>
                <section className="w-full flex justify-center items-center">

                    <div className="container flex justify-center items-center py-24 px-5">
                        <div className="flex flex-col justify-center items-center gap-12">
                        
                            <div className="flex flex-col justify-center items-center gap-4">
                                <h2 className="text-[#101828]">{t('featured_articles')}</h2>
                                <p className="p1 text-[#667085]">{t('quick_access_to_essential_guides')}</p>
                            </div>

                            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {featuredData?.length > 0 ? (
                                    <>
                                        {featuredData?.map((singleData)=> (
                                            <Card 
                                                key={singleData?.id}
                                                title={singleData?.docsLanguage?.[0]?.title}
                                                text = {`${singleData?.docsLanguage?.[0]?.shortDescription?.slice(0, 100)}...`}
                                                // Here first category is sub category and second category is parent
                                                // category and last is help doc slug
                                                url= {
                                                    singleData?.category?.category?.slug ?   `/${selectedLanguage}/${singleData?.category?.category?.slug}/${singleData?.category?.slug}/${singleData?.slug}`
                                                    : `/${selectedLanguage}/docs/${singleData?.slug}`
                                                }
                                                variant="featured"
                                            />
                                        ))}
                                    </>

                                ): (
                                    <Card 
                                        title="Category not found" 
                                        text = ""
                                        icon={<ArrowLeftRight className="h-5 w-5 text-[#344054]" />}
                                        buttonText={t("articles", {number: 0 })}
                                        className="hover:bg-[#FFFDF0]"
                                    />
                                )}
                            </div>

                        </div>
                    </div>

                </section>
            </>
        );
}