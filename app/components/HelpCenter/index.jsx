import Card from "../ui/card";
import { ArrowLeftRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLang } from "../../context/LangContext";

export default function HelpCenter({categoryData}) {
    const { t } = useTranslation() || {};
    const selectedLanguage = useLang();
    
    return (
            <>
                <section className="w-full flex justify-center items-center">

                    <div className="container flex justify-center items-center py-24 px-5">

                        <div className="flex flex-col justify-center items-center gap-7">

                            <h5 className="text-[#646464]">
                                {t("explore_our_complete_guide_setting")}{" "}
                                <span className="text-2xl bold2 text-[#000]">{t("app_name")}</span>
                            </h5>

                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

                                {categoryData?.length > 0 ? (
                                    <>
                                        {categoryData?.map((category)=> (
                                            <Card 
                                                key={category?.id}
                                                title={category?.categoryLanguage?.[0]?.name}
                                                text = {`${category?.categoryLanguage?.[0]?.description?.slice(0, 100)}...`}
                                                icon={<ArrowLeftRight className="h-5 w-5 text-[#344054]" />}
                                                url= {
                                                    category?.docs.length > 0 ? `/${selectedLanguage}/docs/${category?.docs?.[0]?.slug}` :
                                                    category?.slug ? `/${selectedLanguage}/${category?.slug}/`: '/'
                                                }
                                                buttonText={t("see_all_articles")}
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