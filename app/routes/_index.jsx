

import { redirect } from "@remix-run/react";
import {   getSession } from "../services/session.server";
import defaultlogo from "/images/logo/logo.svg";
import { setMetaTag } from "../libs/helper";


export const loader = async({request}) => {
    // If user set language then get the selected language data 
    // if not get only english language data 
    let session = await getSession(request.headers.get("cookie"));
    let selectedLanguage = "en";
    
    if(session.get('user-selected-language')){
        selectedLanguage = session.get('user-selected-language');
        return redirect(`/${selectedLanguage}`);
    }

    return redirect(`/${selectedLanguage}`);
}
export const meta = () => {
    const title = "Inkybay Knowledgebase - Product Customization Software for Print Shops";
    const metaDescription = `"Welcome to the InkyBay Help Center — your one-stop support hub for all things customization! 
                             Whether you have questions about your order, need help using our design tools, or want to report an issue,
                             we're here to help."`;
    const metaImage = defaultlogo;
    
    // Set meta tag if null please set value null
    const metaData = setMetaTag({title, metaImage, metaDescription});
    return metaData;
}

