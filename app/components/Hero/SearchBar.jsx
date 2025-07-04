import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import {  Search, X } from "lucide-react"
import { useEffect, useRef, useState } from "react";
import SearchResult from "./SearchResult";
import { useTranslation } from "react-i18next";
import Badge from "../ui/badge";

export default function SearchBar({setBlur}) {
    const {t} = useTranslation() || {};
    const submit = useSubmit();
    const loaderData = useLoaderData();
    const actionData = useActionData();
    const [searchQuery, setSearchQuery] = useState("")
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [popularSearchData, setPopularSearchData] = useState([]);


    const clearSearchQuery = () => {
        setSearchQuery("");
    }

    const handleSearchField = () => {
        setSearchOpen(true);
        setBlur();
    }

    
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

    

    const storePopularSearch = ()=> {
        if(searchQuery){
            const data = {
                target: "store-populate-search",
                query : searchQuery
            }
            submit(data, {method: "POST"});
        }
    }
    useEffect(()=> {
        if(loaderData){
            setPopularSearchData(loaderData?.data?.popularSearch)
        }
    },[loaderData]);
    

    useEffect(()=> {
        if(actionData){
            if(actionData?.target === "search-help-doc"){
                // After getting docsLanguage it will show on the result 
                // if docsLanguage is empty not need to display this type of result
                const data = actionData?.data?.length > 0 ? actionData?.data?.filter(item => item?.docsLanguage?.length > 0) : [];
                setSearchResult(data);
            }
        }
    }, [actionData]);




    const inputRef = useRef(null);
    
      const handleInputClick = () => {
        if (inputRef.current) {
          inputRef.current.focus();
          handleSearchField();
        }
        handleSearchField();
      };

    return (
        <>
            <div className="relative">
                <div className="w-full mx-auto overflow-hidden">
                    <div className="search_box relative focus-within:border-[#F58220] cursor-text" onClick={() => (!searchOpen && (handleInputClick()))}>
                        <Search className="w-6 h-6 text-[#667085] mr-2"/>
                        <input
                            type="text"
                            ref={inputRef}
                            placeholder="i need help with.."
                            className="w-full faq_search"
                            onClick={handleSearchField}
                            onChange={handleSearchChange}
                            onBlur={storePopularSearch}
                            value={searchQuery}
                        />
                        {searchQuery && (
                            <button onClick={clearSearchQuery} className="p-1 hover:bg-[#F2F4F7] rounded-[8px]">
                                <X className="w-6 h-6 text-[#98a2b3]"/>
                            </button>
                        )}
                    </div>
                    <div className="h-3 w-full sazzu"></div>

                        <div className={`absolute top-full left-0 right-0 overflow-hidden z-10 transition-all duration-700 ${searchOpen && (searchQuery?.length > 2) ?("max-h-[1000px]"):("max-h-[0px]")}`}>
                            <div className="bg-white text-start rounded-md shadow-lg border z-50">
                                <SearchResult searchResult={searchResult}/>
                            </div>
                        </div>

                </div>
            </div>

            {popularSearchData?.length > 0 && (
                <div className="flex sm:flex-row flex-col justify-center items-center gap-3">
                    <p className="text-[#1a1a1a] p1">{ t("popular_search") }:</p>
                    <div className="flex flex-row justify-center items-center gap-2 popular_search_data">
                        {popularSearchData?.map((item)=> (
                            <button key={item?.id} type="button" onClick={()=> setSearchQuery(item?.title)}>
                                <Badge  text={item?.title}/>
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
        </>
    );
}