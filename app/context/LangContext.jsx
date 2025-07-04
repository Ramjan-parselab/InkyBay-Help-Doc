import { createContext, useContext } from "react";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

export const useLang = () => {
   const loaderData = useLoaderData("");
   const [selectedLanguage, setSelectedLanguage] = useState("en");

     useEffect(()=> {
         if(loaderData){
             setSelectedLanguage(loaderData?.data?.selectedLanguage);
         }
    },[loaderData]);

    const langContext = createContext(selectedLanguage);
    const lang =   useContext(langContext);
    return lang;
}



