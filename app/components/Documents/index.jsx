import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useLang } from "../../context/LangContext";


export default function Documents({docs, page}) {
  const {t} = useTranslation();
  const selectedLanguage = useLang();

    return (
        <>
            <section className="w-full flex justify-center items-center">
                <div className="container flex justify-center items-center py-24 px-5">
                    <div className="flex flex-col justify-center items-center gap-12">
                    
                        <div className="flex flex-col justify-center items-center gap-4">
                                <h2 className="text-[#101828]">{t('help_doc_articles')}</h2>
                            <p className="p1 text-[#667085]">{t('docs_description')}</p>
                        </div>

                        <div className="w-full">
                            {docs?.length > 0 && (
                                <div className="w-full">
                                        {docs.map((doc, index) => (
                                        <Link
                                            to={
                                                doc?.category?.category?.slug ?   `/${selectedLanguage}/${doc?.category?.category?.slug}/${doc?.category?.slug}/${doc?.slug}`
                                                : `/${selectedLanguage}/docs/${doc?.slug}`}
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

                                            <p className="sub_category_box_item_paragraph hidden xl:flex 1" dangerouslySetInnerHTML={{__html: `${doc?.docsLanguage?.[0]?.shortDescription?.slice(0, 120)}...`}} />
                                            <p className="sub_category_box_item_paragraph hidden xl:hidden lg:flex 2" dangerouslySetInnerHTML={{__html: `${doc?.docsLanguage?.[0]?.shortDescription?.slice(0, 135)}...`}} />
                                            <p className="sub_category_box_item_paragraph hidden lg:hidden md:flex" dangerouslySetInnerHTML={{__html: `${doc?.docsLanguage?.[0]?.shortDescription?.slice(0, 70)}...`}} />
                                            <p className="sub_category_box_item_paragraph hidden md:hidden sm:flex" dangerouslySetInnerHTML={{__html: `${doc?.docsLanguage?.[0]?.shortDescription?.slice(0, 130)}...`}} />
                                            <p className="sub_category_box_item_paragraph block sm:hidden" dangerouslySetInnerHTML={{__html: `${doc?.docsLanguage?.[0]?.shortDescription?.slice(0, 60)}...`}} />                                </div>

                                        </Link>
                                        ))}
                                </div>
                            )}
                        </div>


                            <div className="w-full hidden md:flex h-16 justify-center items-center gap-3">
                                {page > 1 && (
                                    <Link
                                        to={`?page=${parseInt(page) - 1}`}
                                        className="prev_button hover:bg-[#F9FAFB]"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M15.8332 10.0001H4.1665M4.1665 10.0001L9.99984 15.8334M4.1665 10.0001L9.99984 4.16675" stroke="#344054" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <span className="span1 bold3 text-[#344054]">
                                            {t('previous_article')}
                                        </span>
                                    </Link>
                                )} 

                                {docs?.length > 0 && (
    
                                    <Link
                                        to={`?page=${parseInt(page) + 1}`}
                                        className="next_button hover:bg-[#F9FAFB]"
                                    >
                                        <span className="span1 bold2 text-[#182230]">
                                        {t('next_article')}
                                        </span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                        <path d="M4.66675 10.0001H16.3334M16.3334 10.0001L10.5001 4.16675M16.3334 10.0001L10.5001 15.8334" stroke="#344054" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </Link>
                                )}
                            </div>

                            {/*--------- mobile Version pagination------- */}
                            <div className="w-full md:hidden flex mobile_pagination">

                                {page > 1 && (
                                    <Link to={`?page=${parseInt(page) - 1}`} className="mobile prev_button hover:bg-[#F9FAFB]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M15.8332 10.0001H4.1665M4.1665 10.0001L9.99984 15.8334M4.1665 10.0001L9.99984 4.16675" stroke="#344054" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </Link>
                                )}

                                {/* <Link to="?page=" className="flex justify-center items-center rounded-lg">
                                    <span className="span1 bold1 text-[#182230]">
                                        Page <span className="span1 bold2 text-[#182230]">1</span> of <span className="span1 bold2 text-[#182230]">3</span>
                                    </span>
                                </Link> */}

                                {docs?.length > 0 && (
                                    <Link to={`?page=${parseInt(page) + 1}`} className="mobile next_button hover:bg-[#F9FAFB]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M4.1665 10.0001H15.8332M15.8332 10.0001L9.99984 4.16675M15.8332 10.0001L9.99984 15.8334" stroke="#344054" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </Link>
                                )}

                            </div>

                    </div>
                </div>
            </section>
        </>
    );
}