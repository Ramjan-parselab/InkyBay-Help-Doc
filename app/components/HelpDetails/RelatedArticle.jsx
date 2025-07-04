import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function RelatedArticle({RelatedArticlesData, selectedCategory}) {
    const {t} = useTranslation() || {} ;
    const [selectedLanguage, setSelectedLanguage] = useState("en");

    useEffect(()=> {
        const urlPath = window?.location?.pathname?.split("/");
        const languageUrlCode = urlPath?.[1];
        setSelectedLanguage(languageUrlCode);
    },[])
    
    return (
        <>
            <div className="related_articles_section">
                <p className="p1 bold3 text-[#1a1a1a]">{t("related_articles")}</p>

                <ul className="">
                    {RelatedArticlesData?.length > 0 && RelatedArticlesData?.map((topic)=> (
                        <li key={topic?.id} className="related_article_item">
                            <Link to={`/${selectedLanguage}/${selectedCategory?.slug}/${selectedCategory?.subCategory?.[0]?.slug}/${topic?.slug}`} className="hover:underline">
                                <p className="text-[#476DF2]">
                                    {topic?.docsLanguage?.[0]?.title}
                                </p>
                            </Link>
                        </li>
                    ))}
                </ul>

            </div>
        </>
    );
}