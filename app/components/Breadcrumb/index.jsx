import { Link, useActionData, useSubmit } from "@remix-run/react";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLang } from "../../context/LangContext";
import SearchResult from "../Hero/SearchResult";

export default function Breadcrumb({selectedCategory, activePage="" , showSearchBar=true}) {
  const { t } = useTranslation() || {};
  const submit = useSubmit();
  const actionData = useActionData();

  const selectedLanguage = useLang();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("")
  const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        const data = {
            target: "search-help-doc",
            query : query.trim()
        }
        if(query?.length > 2){
            submit(data, {method: "POST"});
        }
    }

     const [searchResult, setSearchResult] = useState([]);

    useEffect(()=> {
        if(actionData){
            if(actionData?.target === "search-help-doc"){
                // After getting docsLanguage it will show on the result 
                // if docsLanguage is empty not need to display this type of result
                const data = actionData?.data?.length > 0 ? actionData?.data?.filter(item => item?.docsLanguage?.length > 0) : [];
                setSearchResult(data);
            }
        }
    }, [actionData])


  const inputRef = useRef(null);
  const handleInputClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };


    return (

        <>
             <header className="breadcrum_box relative z-30">

            {/* ---breadcrum_box---- */}
              <div className="hidden md:flex breadcrum_items">


                <Link to="/" className="flex px-[10px] py-[5px] justify-center items-center gap-[6px] rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clipPath="url(#clip0_4753_3126)">
                      <path d="M11.875 16.2503V12.5003C11.875 12.3345 11.8092 12.1756 11.6919 12.0584C11.5747 11.9411 11.4158 11.8753 11.25 11.8753H8.75C8.58424 11.8753 8.42527 11.9411 8.30806 12.0584C8.19085 12.1756 8.125 12.3345 8.125 12.5003V16.2503C8.125 16.4161 8.05915 16.575 7.94194 16.6922C7.82473 16.8094 7.66576 16.8753 7.5 16.8753H3.75C3.58424 16.8753 3.42527 16.8094 3.30806 16.6922C3.19085 16.575 3.125 16.4161 3.125 16.2503V9.02686C3.12501 8.93976 3.14322 8.85362 3.17847 8.77398C3.21372 8.69433 3.26523 8.62293 3.32969 8.56436L9.57969 2.66279C9.69477 2.55805 9.84478 2.5 10.0004 2.5C10.156 2.5 10.306 2.55805 10.4211 2.66279L16.6711 8.56436C16.7356 8.62293 16.7871 8.69433 16.8223 8.77398C16.8576 8.85362 16.8758 8.93976 16.8758 9.02686V16.2503C16.8758 16.4161 16.8099 16.575 16.6927 16.6922C16.5755 16.8094 16.4165 16.8753 16.2508 16.8753H12.5C12.3342 16.8753 12.1753 16.8094 12.0581 16.6922C11.9408 16.575 11.875 16.4161 11.875 16.2503Z" stroke="#98A2B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_4753_3126">
                      <rect width="20" height="20" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="breadcrum_text text-[#98A2B3]">
                    {t("home")} 
                  </span>
                </Link>

                <div className="flex h-3 py-[2px] justify-center items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <g clipPath="url(#clip0_4753_3131)">
                      <path d="M4.5 2.25L8.25 6L4.5 9.75" stroke="#98A2B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_4753_3131">
                      <rect width="12" height="12" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                </div>

                {selectedCategory?.level == "LEVEL_1" && (<>

                  <Link to={`/${selectedLanguage}/${selectedCategory?.slug}`} 

                  className={`breadcrum_text hidden xl:flex ${selectedCategory?.subCategory?.[0]?.level == "LEVEL_2" || selectedCategory?.subCategory?.[0]?.docs?.length > 0 ? ("text-[#98A2B3]"):("text-[#1a1a1a]") }`}
                  
                  >
                    {selectedCategory?.categoryLanguage?.[0]?.name}
                  </Link>

                  {/* <Link to={`/${selectedLanguage}/${selectedCategory?.slug}`} 
                  className={`breadcrum_text flex xl:hidden`}>
                    ...
                  </Link> */}

                  </>)}



                {selectedCategory?.subCategory?.[0]?.level == "LEVEL_2" && (
                   <>
                      <div className="flex h-3 py-[2px] justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <g clipPath="url(#clip0_4753_3131)">
                            <path d="M4.5 2.25L8.25 6L4.5 9.75" stroke="#98A2B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </g>
                          <defs>
                            <clipPath id="clip0_4753_3131">
                            <rect width="12" height="12" fill="white"/>
                            </clipPath>
                          </defs>
                        </svg>
                      </div>

                      <Link to={`/${selectedLanguage}/${selectedCategory?.slug}/${selectedCategory?.subCategory?.[0]?.slug}`}

                       className={`breadcrum_text hidden xl:flex text-[#1a1a1a] ${selectedCategory?.subCategory?.[0]?.docs?.length > 0 ? ("text-[#98A2B3]"):("text-[#1a1a1a]")}`}
                       
                       >{selectedCategory?.subCategory?.[0]?.categoryLanguage?.[0]?.name}</Link>


                      {/* <Link to={`/${selectedLanguage}/${selectedCategory?.slug}/${selectedCategory?.subCategory?.[0]?.slug}`}

                       className={`breadcrum_text flex xl:hidden`}
                       
                       >...</Link> */}
                   </>
                )}

                {selectedCategory?.subCategory?.[0]?.docs?.length > 0 && (
                  <>
                    <div className="flex h-3 py-[2px] justify-center items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <g clipPath="url(#clip0_4753_3131)">
                          <path d="M4.5 2.25L8.25 6L4.5 9.75" stroke="#98A2B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </g>
                        <defs>
                          <clipPath id="clip0_4753_3131">
                          <rect width="12" height="12" fill="white"/>
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                      <span

                       className="breadcrum_text text-[#1a1a1a]"
                       
                       >{selectedCategory?.subCategory?.[0]?.docs?.[0]?.docsLanguage?.[0]?.title}</span>
                  </>
                )}

                {activePage != "" && (
                  <span  className="breadcrum_text text-[#1a1a1a]">{ activePage }</span>
                )}
              
              </div>
            
            {/* ---Desktop bar breadcrum_box search bar---- */}
            {showSearchBar && (
              <div className="hidden md:flex search_bar_box">
                <div className="breadcrum_search_bar focus-within:border-[#FFD700] cursor-text" onClick={handleInputClick}>
                    <div className="flex w-full h-full relative">
                    <div className="breadcrum_search_box">
                      <div className="h-5 w-5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M17.5 17.5L14.5834 14.5833M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333Z" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                      </div>
                      <input
                          type="input"
                          ref={inputRef}
                          className="breadcrum_search"
                          placeholder="Search"
                          onChange={handleSearchChange}
                          value={searchQuery}
                      />
                    </div>
                    <div className={`absolute top-10 -right-4 w-[400px] overflow-hidden transition-all duration-500 ${searchQuery && (searchQuery?.length > 2) ? ("max-h-[1000px] top-20"):("max-h-[0px] top-14")}`}>
                      <SearchResult searchResult={searchResult}/>
                    </div>
                    </div>

                    {/* <div className={`absolute w-full overflow-hidden transition-all duration-500 ${searchQuery ? ("max-h-[1000px] top-20"):("max-h-[0px] top-14")}`}>
                      <SearchResult searchResult={searchResult}/>
                    </div> */}

                  </div>
              </div>
            )}



               {/* ---Mobile version bar breadcrum_box search bar---- */}
              {searchOpen?(<>
               {!(selectedCategory?.subCategory?.[0]?.docs?.length)  && (

                <div className="relative w-full flex md:hidden">
                  <div style={{paddingTop : "8px", paddingBottom:"8px"}} className="breadcrum_search_bar w-full focus-within:border-[#FFD700]">
                    <div className="breadcrum_search_box">

                      <div className="h-5 w-5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M17.5 17.5L14.5834 14.5833M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333Z" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                      </div>

                      <input
                            type="text"
                            placeholder="Ask Anyting"
                            className="breadcrum_search"
                            onChange={handleSearchChange}
                            value={searchQuery}
                        />

                        {searchOpen && (
                          searchQuery?(
                          <button onClick={()=>setSearchQuery("")} className="p-1 hover:bg-[#F2F4F7] rounded-[8px]">
                              <X className="w-6 h-6 text-[#98a2b3]"/>
                          </button>
                          ):(
                          <button onClick={()=>setSearchOpen(false)} className="p-1 hover:bg-[#F2F4F7] rounded-[8px]">
                              <X className="w-6 h-6 text-[#98a2b3]"/>
                          </button>
                          )
                        )}

                    </div>
                  </div>

                  <div className={`absolute w-full overflow-hidden transition-all duration-500 ${searchQuery && (searchQuery?.length > 2) ? ("max-h-[1000px] top-20"):("max-h-[0px] top-14")}`}>
                      <SearchResult searchResult={searchResult}/>
                  </div>

                </div>
              
              )}
              </>):(<>

              <div className="flex md:hidden breadcrum_items">

                <Link to="/" className="flex px-[10px] py-[5px] justify-center items-center gap-[6px] rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clipPath="url(#clip0_4753_3126)">
                      <path d="M11.875 16.2503V12.5003C11.875 12.3345 11.8092 12.1756 11.6919 12.0584C11.5747 11.9411 11.4158 11.8753 11.25 11.8753H8.75C8.58424 11.8753 8.42527 11.9411 8.30806 12.0584C8.19085 12.1756 8.125 12.3345 8.125 12.5003V16.2503C8.125 16.4161 8.05915 16.575 7.94194 16.6922C7.82473 16.8094 7.66576 16.8753 7.5 16.8753H3.75C3.58424 16.8753 3.42527 16.8094 3.30806 16.6922C3.19085 16.575 3.125 16.4161 3.125 16.2503V9.02686C3.12501 8.93976 3.14322 8.85362 3.17847 8.77398C3.21372 8.69433 3.26523 8.62293 3.32969 8.56436L9.57969 2.66279C9.69477 2.55805 9.84478 2.5 10.0004 2.5C10.156 2.5 10.306 2.55805 10.4211 2.66279L16.6711 8.56436C16.7356 8.62293 16.7871 8.69433 16.8223 8.77398C16.8576 8.85362 16.8758 8.93976 16.8758 9.02686V16.2503C16.8758 16.4161 16.8099 16.575 16.6927 16.6922C16.5755 16.8094 16.4165 16.8753 16.2508 16.8753H12.5C12.3342 16.8753 12.1753 16.8094 12.0581 16.6922C11.9408 16.575 11.875 16.4161 11.875 16.2503Z" stroke="#98A2B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_4753_3126">
                      <rect width="20" height="20" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="breadcrum_text">
                    {t("home")} 
                  </span>
                </Link>

                <div className="flex h-3 py-[2px] justify-center items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <g clipPath="url(#clip0_4753_3131)">
                      <path d="M4.5 2.25L8.25 6L4.5 9.75" stroke="#98A2B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_4753_3131">
                      <rect width="12" height="12" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                </div>


                {selectedCategory?.subCategory?.[0]?.level == "LEVEL_2" || selectedCategory?.subCategory?.[0]?.docs?.length > 0 ?(
                  <div className="flex py-1 justify-center items-center rounded">
                    <span className="span1 bold2 text-[#98A2B3]">...</span>
                  </div>
                ):(
                    selectedCategory?.level == "LEVEL_1" && (<Link to={`/${selectedLanguage}/${selectedCategory?.slug}`} className="breadcrum_text text-[#1a1a1a]">{selectedCategory?.categoryLanguage?.[0]?.name}</Link>)
                )}

                
                {selectedCategory?.subCategory?.[0]?.docs?.length > 0 ?(
                  // <div className="flex py-1 justify-center items-center rounded">
                  //   <span className="span1 bold2 text-[#98A2B3]">...</span>
                  // </div>
                  <></>
                ):(
                  selectedCategory?.subCategory?.[0]?.level == "LEVEL_2" && (
                   <>
                      <div className="flex h-3 py-[2px] justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <g clipPath="url(#clip0_4753_3131)">
                            <path d="M4.5 2.25L8.25 6L4.5 9.75" stroke="#98A2B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </g>
                          <defs>
                            <clipPath id="clip0_4753_3131">
                            <rect width="12" height="12" fill="white"/>
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <Link to={`/${selectedLanguage}/${selectedCategory?.slug}/${selectedCategory?.subCategory?.[0]?.slug}`} className="breadcrum_text text-[#1a1a1a]">{selectedCategory?.subCategory?.[0]?.categoryLanguage?.[0]?.name}</Link>
                   </>
                )
                )}
                

                {selectedCategory?.subCategory?.[0]?.docs?.length > 0 && (
                  <>
                    <div className="flex h-3 py-[2px] justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <g clipPath="url(#clip0_4753_3131)">
                            <path d="M4.5 2.25L8.25 6L4.5 9.75" stroke="#98A2B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </g>
                          <defs>
                            <clipPath id="clip0_4753_3131">
                            <rect width="12" height="12" fill="white"/>
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <span className="breadcrum_text text-[#1a1a1a]">{selectedCategory?.subCategory?.[0]?.docs?.[0]?.docsLanguage?.[0]?.title}</span>
                  </>
                )}

                {activePage != "" && (
                  <span  className="breadcrum_text text-[#1a1a1a]">{ activePage }</span>
                )}
              
              </div>
               {showSearchBar && (
                <button className="flex md:hidden search_bar_box_mobile" onClick={()=>setSearchOpen(!searchOpen)}>
                  <div className="breadcrum_search_icon_mobile  hover:bg-[#F8F8F8]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M17.5 17.5L14.5834 14.5833M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333Z" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
              )}
              
              </>)}
            

          </header>

          {searchOpen && (searchQuery?.length > 2) && (
            <div onClick={()=>setSearchOpen(false)} className="fixed z-20 inset-0 h-screen bg-black/50">
            </div>
          )}
        </>
    );
}