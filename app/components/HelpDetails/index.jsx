import { Link, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLang } from "../../context/LangContext";
import { calculateReadingTime, formatDateTime } from "../../libs/helper";
import RelatedArticle from "./RelatedArticle";
import TopicList from "./TopicList";

export default function HelpDetails({helpDocDetails, RelatedArticlesData, selectedCategory, nexPageData, previousPageData}) {
    const {t} = useTranslation() || {} ;
    const submit = useSubmit();
    const [review, setReview] = useState("");
    const selectedLanguage = useLang();
    const [showReviewSection, setReviewSection] = useState(true);

    const docSections = helpDocDetails?.docsLanguage;
    const title = docSections?.[0]?.title;

    const TotalReadingTime =  () => {
        let readingTime = 0;
        if(docSections?.length > 0){
            docSections?.map((section)=> (
              readingTime = calculateReadingTime(section?.content) + parseInt(readingTime)
            ));
        }
        
        return ( 
          <>
            <span>{ t("min_to_read", {readingTime: readingTime}) }</span>
          </>
        );
    }
    

    const handleHelpDocReviewSection = (review, docId) => {
        if(review){
            setReview(review);
            submit({ target: "post-review", data: JSON.stringify({review: review, docId:docId}) }, { method: "POST" });
        }
    }

   
    
   useEffect(()=> {
    // Here get review flug from browser storeage which  
    // user already given review for this help doc 
     const localStorageInfo = localStorage.getItem(`${helpDocDetails?.slug}_review`) ? JSON.parse(localStorage.getItem(`${helpDocDetails?.slug}_review`)) : "";
     const docUpdatedAt = helpDocDetails?.updatedAt ? new Date(helpDocDetails?.updatedAt).toISOString() : "";

     if(localStorageInfo){
        if((localStorageInfo?.slug == helpDocDetails?.slug) && (localStorageInfo?.updatedAt == docUpdatedAt)){
            setReviewSection(false);
        }else{
          setReviewSection(true);
        }
     }
   },[helpDocDetails])

   
    return (
        <>
            <div className="w-full details_page">
                <div className="w-full lg:w-3/4">

                <div className="details_page_contents">

                    <div className="details_page_content_body">

                      <div className="documantation_details">

                        <div className="documantation_details_header">

                          <div className="flex flex-col items-start gap-4">
   
                            <div className="flex justify-center items-start flex-col md:flex-row gap-2">

                              <button className="update_details_button">
                                <i>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M14.6668 8.00004C14.6668 11.68 11.6802 14.6667 8.00016 14.6667C4.32016 14.6667 1.3335 11.68 1.3335 8.00004C1.3335 4.32004 4.32016 1.33337 8.00016 1.33337C11.6802 1.33337 14.6668 4.32004 14.6668 8.00004Z" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M10.4734 10.12L8.40675 8.88671C8.04675 8.67338 7.75342 8.16005 7.75342 7.74005V5.00671" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </i>
                                <span className="span1 text-[#667085] text-center"><TotalReadingTime /> to read</span>
                              </button>

                              <div className="last_update">
                                <span className="span1 bold2 text-[#667085] text-center"> {t("last_update_on")} {helpDocDetails?.updatedAt ? formatDateTime(helpDocDetails?.updatedAt) : formatDateTime(helpDocDetails?.createdAt)}</span>
                              </div>

                            </div>

                            <h3 className="text-[#000]">{title}</h3>

                          </div>

                          <div className="flex lg:hidden max-h-96 overflow-y-auto">
                            <TopicList topicList={docSections}/>
                          </div>

                            <p className="text-[#212121]">
                              {docSections?.[0]?.shortDescription}
                            </p>

                        </div>



                        {docSections?.length > 0 &&  docSections?.map((section, index)=> (

                            <div key={section?.id} id={`${section?.id}`} className="documantation_details_section">
                              <h4 className="text-[#16171A]">{index+1}.{0 + 1} {section?.subtitle}</h4>
                              <p className="text-[#212121] documantation_paragraph_section" dangerouslySetInnerHTML={{__html:`${section?.content}`}}/>
                              
                            </div>

                        ))}

                      </div>

                        {showReviewSection && (
                          <div className="review_section">
                            <p className="p1 bold3 text-[#000]">{t("did_this_post_help_you")}</p>
                            <div className="flex gap-4 items-center">
                              <button onClick={()=> handleHelpDocReviewSection("YES", helpDocDetails?.id) } className={`hover:bg-[#F9FAFB] review_section_button ${review == "YES" ? ` bg-gray-300 text-gray-700`: `bg-[#fff]`}`}>
                                  <p className="text-[#667085]">{t("yes")} <i className="p1 bold2">😊</i></p>
                              </button>

                              <button onClick={()=> handleHelpDocReviewSection("NO", helpDocDetails?.id) } className={`hover:bg-[#F9FAFB] review_section_button ${review == "NO" ? ` bg-gray-300 text-gray-700`: `bg-white`}`}>
                                  <p className="text-[#667085]">{t("not_really")} <i className="p1 bold2">😕</i></p>
                              </button>
                            </div>
                          </div>
                        )}

                    </div>

                    <div className="pagiantion_sections">
                        <div className="pagiantion_section">
                            {previousPageData  && previousPageData?.subCategory?.length > 0 &&(
                                <>
                                  <Link 
                                  // to={`/${selectedLanguage}/${selectedCategory?.slug}/${selectedCategory?.subCategory?.[0]?.slug}/${previousPageData?.slug}`} 
                                  to={
                                      `/${selectedLanguage}/${previousPageData?.slug}/${previousPageData?.subCategory?.[0]?.slug}/${previousPageData?.subCategory?.[0]?.docs?.[0]?.slug}`
                                  }
                                  className="pagination_button">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="13" viewBox="0 0 20 13" fill="none">
                                      <path d="M0.999818 6.36869L19.6665 6.36873M0.999818 6.36869L6.83311 12.2021M0.999818 6.36869L6.83315 0.5354" stroke="#475467"/>
                                    </svg>
                                      <p className="text-[#475467]">
                                         {t("previous_article")}
                                      </p>
                                  </Link>

                                  <p className="text-left p1 bold3 text-[#16171A]">{previousPageData?.subCategory?.[0]?.docs?.[0]?.docsLanguage?.[0]?.title}</p>
                                </>
                            )} 
                        </div>

                        <div className="pagiantion_section">
                            {nexPageData && nexPageData?.subCategory?.length > 0 && (
                              <>
                                  <Link 
                                  // to={`/${selectedLanguage}/${selectedCategory?.slug}/${selectedCategory?.subCategory?.[0]?.slug}/${nexPageData?.slug}`} 
                                  to={
                                      `/${selectedLanguage}/${nexPageData?.slug}/${nexPageData?.subCategory?.[0]?.slug}/${nexPageData?.subCategory?.[0]?.docs?.[0]?.slug}`
                                  } 
                                  className="pagination_button">
                                      <p className="text-[#475467]">
                                        {t("next_article")} 
                                      </p>

                                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="13" viewBox="0 0 20 13" fill="none">
                                        <path d="M19.0002 6.36869L0.333496 6.36873M19.0002 6.36869L13.1669 12.2021M19.0002 6.36869L13.1668 0.5354" stroke="#475467"/>
                                      </svg>
                                  </Link>

                                    <p className="p1 bold3 text-right text-[#16171A]">{nexPageData?.subCategory?.[0]?.docs?.[0]?.docsLanguage?.[0]?.title}</p>
                              </>
                            )}
                            
                        </div>
                    </div>


                    <div className="flex lg:hidden max-h-96 overflow-y-auto">
                      <RelatedArticle RelatedArticlesData={RelatedArticlesData} selectedCategory={selectedCategory}/>
                    </div>


                  </div>

                </div>



                <div className="sticky top-4 hidden lg:flex lg:w-1/4">
                  <div className="flex flex-col items-start gap-12">
                    <TopicList topicList={docSections}/>
                    <RelatedArticle RelatedArticlesData={RelatedArticlesData} selectedCategory={selectedCategory}/>
                  </div>
                </div>
            </div>
        </>
    );
}