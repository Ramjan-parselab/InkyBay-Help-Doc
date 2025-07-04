import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useLang } from "../../context/LangContext";

export default function SubCategoryContent({selectedCategory, subcategoryContentData, totalHelpDoc, page}) {
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
            <section className="sub_category_container w-full">
              <div className="sub_category_items w-full">
                <h4 className="text-[#16171A]">{subcategoryContentData?.categoryLanguage?.[0]?.name}</h4>


                <div className="sub_category_box_items w-full">
                    {subcategoryContentData?.docs?.length > 0 ? (
                          <div className="w-full">
                            {subcategoryContentData?.docs.map((doc, index) => (
                              <Link
                                to={`/${selectedLanguage}/${selectedCategory?.slug}/${selectedCategory?.subCategory?.[0]?.slug}/${doc?.slug}`}
                                key={doc?.id}
                                className="w-full"
                              >
                                <div className={`sub_category_box_item hover:bg-[#F5F5F5] w-full ${index === 0 ?(""):("border-t border-[#C0C0C0]")}`}>

                                  <div className="sub_category_box_item_title w-full">
                                    <p className="p1 text-[#212121]">{doc?.docsLanguage?.[0]?.title}</p>
                                    <div className="sub_category_box_item_title_icon">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="21" height="14" viewBox="0 0 21 14" fill="none">
                                        <path d="M19.3334 6.99991L0.666748 6.99996M19.3334 6.99991L13.5001 12.8333M19.3334 6.99991L13.5001 1.16663" stroke="#1A1A1A" strokeWidth="1.5"/>
                                      </svg>
                                    </div>
                                  </div>

                                  <p className="sub_category_box_item_paragraph hidden xl:flex 1" dangerouslySetInnerHTML={{__html: `${doc?.docsLanguage?.[0]?.content?.slice(0, 120)}...`}} />
                                  <p className="sub_category_box_item_paragraph hidden xl:hidden lg:flex 2" dangerouslySetInnerHTML={{__html: `${doc?.docsLanguage?.[0]?.content?.slice(0, 135)}...`}} />
                                  <p className="sub_category_box_item_paragraph hidden lg:hidden md:flex" dangerouslySetInnerHTML={{__html: `${doc?.docsLanguage?.[0]?.content?.slice(0, 70)}...`}} />
                                  <p className="sub_category_box_item_paragraph hidden md:hidden sm:flex" dangerouslySetInnerHTML={{__html: `${doc?.docsLanguage?.[0]?.content?.slice(0, 130)}...`}} />
                                  <p className="sub_category_box_item_paragraph block sm:hidden" dangerouslySetInnerHTML={{__html: `${doc?.docsLanguage?.[0]?.content?.slice(0, 60)}...`}} />
                                  {/* <p className="sub_category_box_item_paragraph" dangerouslySetInnerHTML={{__html: `${doc?.docsLanguage?.[0]?.content?.slice(0, 90)}...`}} /> */}
                                </div>

                              </Link>
                            ))}
                          
                          </div>
                      ) : (
                        <div className={`p-6 flex justify-between items-start hover:bg-[#f9fafb] cursor-pointer w-full`}>
                          <div className="w-full"> 
                            <p className="text-[#1a1a1a] p1 bold2 mb-1">{t("help_doc_not_found")}</p>
                          </div>
                        </div>
                      )}
                </div>



                <div className="w-full hidden md:flex h-16 justify-center items-center gap-3">


                    {totalHelpDoc?._count?.docs > subcategoryContentData?.docs?.length &&  page > 1 && (
                        <Link
                            to={`?page=${parseInt(page) - 1}`}
                            className="prev_button hover:bg-[#F9FAFB]"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M15.8332 10.0001H4.1665M4.1665 10.0001L9.99984 15.8334M4.1665 10.0001L9.99984 4.16675" stroke="#344054" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                            <span className="span1 bold3 text-[#344054]">
                              {t('previous')}
                            </span>
                        </Link>
                    )}

                    {totalHelpDoc?._count?.docs > subcategoryContentData?.docs?.length && [1, 2 , "..", 3].map((pageNumber, index) => (
                      <Link
                          key={index}
                          to={`?page=${parseInt(pageNumber)}`}
                          className={`flex w-10 h-10 justify-center items-center rounded-lg ${
                            pageNumber == page
                              ? "bg-[#F2F4F7]"
                              : "hover:bg-[#F2F4F7]"
                          }`}
                      >
                        <span className="span1 bold2 text-[#182230]">
                          {pageNumber}
                        </span>
                      </Link>
                    ))}


                    {(totalHelpDoc?._count?.docs > subcategoryContentData?.docs?.length) && subcategoryContentData?.docs?.length > 0 && (
                        <Link
                            to={`?page=${parseInt(page) + 1}`}
                            className="next_button hover:bg-[#F9FAFB]"
                        >
                          <span className="span1 bold2 text-[#182230]">
                            {t('next')}
                          </span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                            <path d="M4.66675 10.0001H16.3334M16.3334 10.0001L10.5001 4.16675M16.3334 10.0001L10.5001 15.8334" stroke="#344054" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Link>
                    )}


                </div>

            {/*--------- mobile Version pagination------- */}
                <div className="w-full md:hidden flex mobile_pagination">


                    {totalHelpDoc?._count?.docs > subcategoryContentData?.docs?.length &&  page > 1 && (

                        <Link to={`?page=${parseInt(page) - 1}`} className="mobile prev_button hover:bg-[#F9FAFB]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M15.8332 10.0001H4.1665M4.1665 10.0001L9.99984 15.8334M4.1665 10.0001L9.99984 4.16675" stroke="#344054" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Link>
                    )}

                    {totalHelpDoc?._count?.docs > subcategoryContentData?.docs?.length &&(
                      <Link to="?page=" className="flex justify-center items-center rounded-lg">
                        <span className="span1 bold1 text-[#182230]">
                          Page <span className="span1 bold2 text-[#182230]">1</span> of <span className="span1 bold2 text-[#182230]">3</span>
                        </span>
                      </Link>
                    )}


                    {(totalHelpDoc?._count?.docs > subcategoryContentData?.docs?.length) && subcategoryContentData?.docs?.length > 0 && (

                        <Link to={`?page=${parseInt(page) + 1}`} className="mobile next_button hover:bg-[#F9FAFB]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M4.1665 10.0001H15.8332M15.8332 10.0001L9.99984 4.16675M15.8332 10.0001L9.99984 15.8334" stroke="#344054" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Link>
                    )}
                </div>



                 </div>
            </section>
        </>
    );
}