import Content from "./content"
import { useTranslation } from "react-i18next";
import { useLang } from "../../context/LangContext";

export default function CategoryContent({selectedCategory, categoryContentData}) {
    const {t} = useTranslation() || {}; 
    const selectedLanguage = useLang();

    return (
        <>
        {/* <style>
            {`
            body{
             height : 100vh;
            }
            
            `}
        </style> */}
            <section className="content_body">
                <div className="content_cards_body w-full">

                    <div className="content_body_header">
                        <div className="flex items-center gap-3">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                                    <path d="M36.6667 15H3.33337M23.3334 29.1667L27.5 25L23.3334 20.8333M16.6667 20.8333L12.5 25L16.6667 29.1667M3.33337 13L3.33337 27C3.33337 29.8003 3.33337 31.2004 3.87834 32.2699C4.35771 33.2108 5.12261 33.9757 6.06342 34.455C7.13298 35 8.53311 35 11.3334 35H28.6667C31.467 35 32.8671 35 33.9367 34.455C34.8775 33.9757 35.6424 33.2108 36.1217 32.27C36.6667 31.2004 36.6667 29.8003 36.6667 27V13C36.6667 10.1997 36.6667 8.79961 36.1217 7.73005C35.6424 6.78924 34.8775 6.02434 33.9367 5.54497C32.8671 5 31.467 5 28.6667 5L11.3334 5C8.53311 5 7.13298 5 6.06342 5.54497C5.12261 6.02433 4.35771 6.78924 3.87834 7.73005C3.33337 8.79961 3.33337 10.1997 3.33337 13Z" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h4 className="text-[#16171A]">{selectedCategory?.categoryLanguage?.[0]?.name}</h4>
                        </div>
                        <p className="text-[#212121]">
                            {selectedCategory?.categoryLanguage?.[0]?.description}
                        </p> 
                    </div>



                    {categoryContentData.length > 0  ? (
                                <div className="contant_body_grid_content">
                                    {categoryContentData?.map((subCategory)=> (
                                        <Content 
                                            key={subCategory?.id}
                                            title={subCategory?.categoryLanguage?.[0]?.name} 
                                            badge={subCategory?.docs?.length > 0 ?  subCategory?.docs?.length : 0} 
                                            helpDocs={subCategory?.docs?.length > 0 ? subCategory?.docs?.slice(0, 6) : []}
                                            url={`/${selectedLanguage}/${selectedCategory?.slug}/${subCategory?.slug}`}  
                                        />
                                    ))}
                                </div>
                            ): (
                                <div className="grid">
                                    <Content 
                                        title={t("result_not_found")}
                                        badge={0} 
                                        helpDocs={[]} 
                                    />
                                </div>
                            )}
                    
                </div>
            </section>
        </>
    );
}