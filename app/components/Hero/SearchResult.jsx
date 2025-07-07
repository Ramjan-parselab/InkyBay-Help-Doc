import { Link } from "@remix-run/react";
import { ArrowRight, Frown } from "lucide-react"
import { useTranslation } from "react-i18next";
import { useLang } from "../../context/LangContext";


export default function SearchResult({searchResult}) {
    const {t} = useTranslation() || {};
    const searchResultData = [...searchResult];
    const selectedLanguage = useLang();
    
    return (
        <>
            <div className="flex justify-center items-starts w-full">
                 {searchResultData?.length > 0 ? (
                    <div className="w-full max-w-4xl bg-white rounded-lg border border-[#eaecf0] shadow-sm">
                        <div className="flex justify-between items-center px-6 py-4 border-b-[1px] border-[#C0C0C0]">
                            <p className="text-[#667085] bold2">{searchResultData?.length} {t("result_found")}</p>
                            <Link to={`/${selectedLanguage}/docs`} className="flex items-center text-[#476df2] text-base bold2">
                                 {t("see_all")}
                                <ArrowRight className="ml-1 h-5 w-5" />
                            </Link>
                        </div>

    
                        {searchResultData?.map((item)=> (
                            <div key={item?.id} className="flex flex-col px-2 justify-center items-start w-full">
                                <Link 
                                to={ item?.category?.category !=null ? `/${selectedLanguage}/${item?.category?.category?.slug}/${item?.category?.slug}/${item?.slug}` 
                                :`/${selectedLanguage}/docs/${item?.slug}` } 
                                key={item?.id} 
                                className="flex w-full" >
                                    <div  className="p-[10px] flex flex-col items-start gap-2 rounded-md w-full">
                                        <div className="flex flex-col justify-center items-start gap-2 w-full">
                                            <p className="text-[#101828] bold2 flex w-full">{item?.docsLanguage?.[0]?.title}</p>
                                            <p className="text-[#475467] span1 bold1 text-justify break-words w-full overflow-hidden">{item?.docsLanguage?.[0]?.shortDescription}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (

                    <div className="w-full max-w-4xl bg-white rounded-lg border border-[#eaecf0] shadow-sm overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-[#C0C0C0]">

                            <p className="text-[#667085] bold2">0 { t("result_not_found") }</p>

                            <p className="flex items-center text-[#A3B7E8] bold2">
                                {t("see_all")}
                                <ArrowRight className="ml-1 h-5 w-5" />
                            </p>

                        </div>

                    <div className="flex justify-center items-center flex-col">
                        <div  className="flex justify-center items-center flex-col gap-8 p-8 w-[400px]">
                            <div className="flex justify-center items-center flex-col gap-4">
                                <div style={{border:"1px solid #EAECF0"}} className="p-3 rounded-xl bg-[#FFF] shadow-sm">
                                    <Frown/>
                                </div>
                                <div className="flex justify-center items-center flex-col w-full p-2">
                                    <h3 className="text-[#101828] text-xl text-center font-semibold mb-2">{t("no_result_found")}</h3>
                                    <p className="text-[#475467] text-sm text-center">
                                        { t("your_search_result") }
                                    </p>
                                </div>
                            </div>

                            <Link  to={`/${selectedLanguage}/ticket`} className="flex items-center text-black text-md mt-4">
                                {t("submit_a_ticket")}
                                <ArrowRight className="ml-1 h-5 w-5" />
                            </Link>

                        </div>
                    </div>
                </div>
                )}
            </div>
        </>
    );
}